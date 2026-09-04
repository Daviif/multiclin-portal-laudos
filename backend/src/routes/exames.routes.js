import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

export const examesRouter = Router();

// RF04 — busca e filtro de exames/laudos por paciente, data e modalidade (US/RX/MG/TC/RM)
// A lista retornada depende do perfil de req.usuario (RN01, ver Fluxo.puml)
examesRouter.get("/", requireAuth, (req, res) => {
  res.status(501).json({ error: "TODO RF04: busca/filtro de exames por perfil" });
});
