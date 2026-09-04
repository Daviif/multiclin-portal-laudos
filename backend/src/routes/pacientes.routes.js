import { Router } from "express";
import { requireAuth, requirePerfil } from "../middleware/auth.middleware.js";

export const pacientesRouter = Router();

// RF02 — cadastro e gerenciamento de pacientes.
// Quem cadastra é o Administrador (RF14, issue #14) — dados específicos do
// paciente (cpf, data_nascimento); o Usuario/convite em si é criado via /usuarios.
pacientesRouter.post("/", requireAuth, requirePerfil("ADMINISTRADOR"), (req, res) => {
  res.status(501).json({ error: "TODO RF02: cadastrar paciente" });
});

pacientesRouter.get("/", requireAuth, (req, res) => {
  res.status(501).json({ error: "TODO RF02: listar/gerenciar pacientes" });
});
