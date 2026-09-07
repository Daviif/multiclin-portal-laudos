import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { verificarTokenConvite } from "../lib/convite.js";

export const authRouter = Router();

// Perfil "principal" decide o redirecionamento (RF01); pacienteVinculado avisa
// o front que essa pessoa também tem exames/laudos próprios pra ver — caso
// comum do Administrador (ou outro membro da equipe) que também é paciente
// da clínica.
async function montarRespostaSessao(usuario) {
  const paciente = await prisma.paciente.findUnique({ where: { usuarioId: usuario.id } });

  const token = jwt.sign({ sub: usuario.id, perfil: usuario.perfil }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      pacienteVinculado: Boolean(paciente),
    },
  };
}

// RF01 — login por perfil. Front decide o redirecionamento a partir de usuario.perfil.
authRouter.post("/login", async (req, res) => {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    return res.status(400).json({ error: "Informe e-mail e senha" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    return res.status(401).json({ error: "E-mail ou senha inválidos" });
  }

  // RF09: usuário convidado que ainda não definiu a senha.
  if (!usuario.senhaHash) {
    return res.status(403).json({
      error: "Você ainda não definiu sua senha. Verifique o convite enviado por e-mail.",
    });
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);
  if (!senhaConfere) {
    return res.status(401).json({ error: "E-mail ou senha inválidos" });
  }

  res.json(await montarRespostaSessao(usuario));
});

// RF09 — definição de senha por convite no primeiro acesso.
// Já loga o usuário em seguida, pra não obrigar um segundo formulário.
authRouter.post("/definir-senha", async (req, res) => {
  const { token, novaSenha } = req.body ?? {};

  if (!token || !novaSenha) {
    return res.status(400).json({ error: "Informe o token do convite e a nova senha" });
  }
  if (novaSenha.length < 8) {
    return res.status(400).json({ error: "A senha precisa ter pelo menos 8 caracteres" });
  }

  let payload;
  try {
    payload = verificarTokenConvite(token);
  } catch {
    return res.status(400).json({ error: "Convite inválido ou expirado" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.sub } });
  if (!usuario) {
    return res.status(400).json({ error: "Convite inválido ou expirado" });
  }
  // RF09 é só pra primeiro acesso — depois de usado, o mesmo link não pode
  // redefinir a senha de novo (senão vira um reset de senha sem controle).
  if (usuario.senhaHash) {
    return res.status(400).json({ error: "Este convite já foi utilizado" });
  }

  const senhaHash = await bcrypt.hash(novaSenha, 10);
  const usuarioAtualizado = await prisma.usuario.update({ where: { id: usuario.id }, data: { senhaHash } });

  res.json(await montarRespostaSessao(usuarioAtualizado));
});

// RF10 — alteração de senha
authRouter.post("/alterar-senha", (req, res) => {
  res.status(501).json({ error: "TODO RF10: alteração de senha do usuário logado" });
});
