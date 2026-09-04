import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

export const pacientesRouter = Router();

// RF02 — cadastro e gerenciamento de pacientes
// TODO: definir qual(is) perfil(is) pode(m) cadastrar paciente antes de travar com requirePerfil(...)
pacientesRouter.post("/", requireAuth, (req, res) => {
  res.status(501).json({ error: "TODO RF02: cadastrar paciente" });
});

pacientesRouter.get("/", requireAuth, (req, res) => {
  res.status(501).json({ error: "TODO RF02: listar/gerenciar pacientes" });
});
