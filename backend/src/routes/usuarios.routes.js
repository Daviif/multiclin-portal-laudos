import { Router } from "express";
import { requireAuth, requirePerfil } from "../middleware/auth.middleware.js";

export const usuariosRouter = Router();

// RF14 (issue #14) — Administrador cadastra usuário de qualquer perfil
// (paciente, médico solicitante, médico executante, regulação) e dispara
// o convite de primeiro acesso (RF09).
usuariosRouter.post("/", requireAuth, requirePerfil("ADMINISTRADOR"), (req, res) => {
  res.status(501).json({ error: "TODO RF14: cadastrar usuário + disparar convite (RF09)" });
});

// RF14 — listar/gerenciar (editar, desativar) usuários cadastrados
usuariosRouter.get("/", requireAuth, requirePerfil("ADMINISTRADOR"), (req, res) => {
  res.status(501).json({ error: "TODO RF14: listar usuários" });
});
