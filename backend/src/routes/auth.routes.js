import { Router } from "express";

export const authRouter = Router();

// RF01 — login por perfil
authRouter.post("/login", (req, res) => {
  res.status(501).json({ error: "TODO RF01: autenticação por perfil" });
});

// RF09 — definição de senha por convite no primeiro acesso
authRouter.post("/definir-senha", (req, res) => {
  res.status(501).json({ error: "TODO RF09: definir senha via token de convite" });
});

// RF10 — alteração de senha
authRouter.post("/alterar-senha", (req, res) => {
  res.status(501).json({ error: "TODO RF10: alteração de senha do usuário logado" });
});
