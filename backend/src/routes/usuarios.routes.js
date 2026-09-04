import { Router } from "express";
import { requireAuth, requirePerfil } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import { gerarTokenConvite } from "../lib/convite.js";

export const usuariosRouter = Router();

// PACIENTE fica de fora: paciente não é cadastrado manualmente pelo admin,
// e sim automaticamente pela integração com o PACS/RIS (RF03) quando um
// exame chega — ver TODO RF03 em laudos.routes.js.
const PERFIS_VALIDOS = ["MEDICO_SOLICITANTE", "MEDICO_EXECUTANTE", "REGULACAO", "ADMINISTRADOR"];

// RF14 (issue #14) — Administrador cadastra usuário de qualquer perfil e
// dispara o convite de primeiro acesso (RF09). RF07 (e-mail) ainda não existe,
// então por enquanto devolvemos o link do convite na resposta para o admin
// repassar manualmente — trocar por envio de e-mail quando RF07 for implementado.
usuariosRouter.post("/", requireAuth, requirePerfil("ADMINISTRADOR"), async (req, res) => {
  const { nome, email, perfil, cpf, dataNascimento, crm, municipio, uf, tambemPaciente } = req.body ?? {};

  if (!nome || !email || !perfil) {
    return res.status(400).json({ error: "Informe nome, e-mail e perfil" });
  }
  if (!PERFIS_VALIDOS.includes(perfil)) {
    return res.status(400).json({
      error:
        perfil === "PACIENTE"
          ? "Paciente é cadastrado automaticamente pela integração com o PACS/RIS (RF03), não manualmente."
          : `Perfil inválido. Use um de: ${PERFIS_VALIDOS.join(", ")}`,
    });
  }
  // Uma pessoa da equipe (ex: administrador) também pode já ter feito exames
  // na clínica como paciente — nesse caso ela ganha um Paciente vinculado além
  // do perfil principal, e passa a poder ver seus próprios laudos.
  const criarVinculoPaciente = Boolean(tambemPaciente);
  if (criarVinculoPaciente && (!cpf || !dataNascimento)) {
    return res.status(400).json({ error: "Paciente exige cpf e dataNascimento" });
  }
  if ((perfil === "MEDICO_SOLICITANTE" || perfil === "MEDICO_EXECUTANTE") && !crm) {
    return res.status(400).json({ error: "Médico exige crm" });
  }
  if (perfil === "REGULACAO" && (!municipio || !uf)) {
    return res.status(400).json({ error: "Regulação exige municipio e uf" });
  }

  const emailEmUso = await prisma.usuario.findUnique({ where: { email } });
  if (emailEmUso) {
    return res.status(409).json({ error: "Já existe um usuário com esse e-mail" });
  }

  const usuario = await prisma.$transaction(async (tx) => {
    const criado = await tx.usuario.create({
      data: { nome, email, perfil, senhaHash: null },
    });

    if (criarVinculoPaciente) {
      await tx.paciente.create({
        data: { usuarioId: criado.id, cpf, dataNascimento: new Date(dataNascimento) },
      });
    }
    if (perfil === "MEDICO_SOLICITANTE") {
      await tx.medicoSolicitante.create({ data: { usuarioId: criado.id, crm } });
    } else if (perfil === "MEDICO_EXECUTANTE") {
      await tx.medicoExecutante.create({ data: { usuarioId: criado.id, crm } });
    } else if (perfil === "REGULACAO") {
      await tx.regulacao.create({ data: { usuarioId: criado.id, municipio, uf } });
    }

    return criado;
  });

  const conviteToken = gerarTokenConvite(usuario.id);

  res.status(201).json({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil },
    conviteToken,
    conviteCaminho: `/definir-senha?token=${conviteToken}`,
  });
});

// RF14 — listar usuários cadastrados (edição/desativação ficam para uma issue à parte)
usuariosRouter.get("/", requireAuth, requirePerfil("ADMINISTRADOR"), async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { criadoEm: "desc" },
    select: {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      criadoEm: true,
      senhaHash: true,
      paciente: { select: { id: true } },
    },
  });

  res.json(
    usuarios.map(({ senhaHash, paciente, ...usuario }) => ({
      ...usuario,
      convitePendente: !senhaHash,
      pacienteVinculado: Boolean(paciente),
    }))
  );
});
