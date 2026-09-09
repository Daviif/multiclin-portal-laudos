import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { verificarTokenConvite } from "../lib/convite.js";
import { gerarTokenRedefinicao, verificarTokenRedefinicao } from "../lib/resetSenha.js";
import { enviarEmail } from "../lib/email.js";

export const authRouter = Router();

// /definir-senha e /token-info aceitam tanto o token de convite (RF09,
// primeiro acesso) quanto o de redefinição ("esqueci minha senha") — mesma
// tela do front pros dois casos, só muda a validade e a regra de reuso.
function verificarTokenSenha(token) {
  try {
    return { payload: verificarTokenConvite(token), tipo: "convite" };
  } catch {
    return { payload: verificarTokenRedefinicao(token), tipo: "redefinicao" };
  }
}

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

// GET /auth/token-info/:token — pro front mostrar de quem é a conta (nome/e-mail)
// antes da pessoa digitar a senha nova, tanto em convite quanto em redefinição.
authRouter.get("/token-info/:token", async (req, res) => {
  let payload;
  try {
    ({ payload } = verificarTokenSenha(req.params.token));
  } catch {
    return res.status(400).json({ error: "Link inválido ou expirado" });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.sub },
    select: { nome: true, email: true },
  });
  if (!usuario) {
    return res.status(400).json({ error: "Link inválido ou expirado" });
  }

  res.json(usuario);
});

// RF09 — definição de senha por convite no primeiro acesso, e também "esqueci
// minha senha" (token de redefinição, ver lib/resetSenha.js). Já loga o
// usuário em seguida, pra não obrigar um segundo formulário.
authRouter.post("/definir-senha", async (req, res) => {
  const { token, novaSenha } = req.body ?? {};

  if (!token || !novaSenha) {
    return res.status(400).json({ error: "Informe o token e a nova senha" });
  }
  if (novaSenha.length < 8) {
    return res.status(400).json({ error: "A senha precisa ter pelo menos 8 caracteres" });
  }

  let payload;
  let tipo;
  try {
    ({ payload, tipo } = verificarTokenSenha(token));
  } catch {
    return res.status(400).json({ error: "Link inválido ou expirado" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { id: payload.sub } });
  if (!usuario) {
    return res.status(400).json({ error: "Link inválido ou expirado" });
  }
  // Convite é só pra primeiro acesso — depois de usado, o mesmo link não pode
  // definir a senha de novo (senão vira uma redefinição sem controle). Já a
  // redefinição existe justamente pra sobrescrever uma senha já existente.
  if (tipo === "convite" && usuario.senhaHash) {
    return res.status(400).json({ error: "Este convite já foi utilizado" });
  }

  const senhaHash = await bcrypt.hash(novaSenha, 10);
  const usuarioAtualizado = await prisma.usuario.update({ where: { id: usuario.id }, data: { senhaHash } });

  res.json(await montarRespostaSessao(usuarioAtualizado));
});

// "Esqueci minha senha" — sempre responde a mesma mensagem genérica, exista ou
// não o e-mail, pra não deixar alguém descobrir quem tem conta no sistema
// testando e-mails (enumeração de usuários). Reaproveita a conta mesmo se o
// convite de primeiro acesso ainda estiver pendente (perdeu o e-mail original).
authRouter.post("/esqueci-senha", async (req, res) => {
  const { email } = req.body ?? {};
  if (!email) {
    return res.status(400).json({ error: "Informe o e-mail" });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (usuario) {
    const token = gerarTokenRedefinicao(usuario.id);
    const link = `${process.env.FRONTEND_URL}/definir-senha?token=${token}`;
    await enviarEmail({
      para: usuario.email,
      assunto: "Multiclin — redefinição de senha",
      texto: `Olá ${usuario.nome},\n\nRecebemos um pedido para redefinir sua senha na Multiclin.\nClique no link abaixo para escolher uma nova senha (válido por 1 hora):\n${link}\n\nSe você não pediu isso, pode ignorar este e-mail.`,
    });
  }

  res.json({ mensagem: "Se esse e-mail estiver cadastrado, enviamos um link de redefinição." });
});

// RF10 — alteração de senha
authRouter.post("/alterar-senha", (req, res) => {
  res.status(501).json({ error: "TODO RF10: alteração de senha do usuário logado" });
});
