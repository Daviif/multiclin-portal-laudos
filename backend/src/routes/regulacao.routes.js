import { Router } from "express";
import { requireAuth, requirePerfil } from "../middleware/auth.middleware.js";

export const regulacaoRouter = Router();

// RF06 — painel de acompanhamento dos exames sob responsabilidade da regulação (RN04)
regulacaoRouter.get("/painel", requireAuth, requirePerfil("REGULACAO"), (req, res) => {
  res.status(501).json({ error: "TODO RF06: painel de acompanhamento da regulação" });
});
