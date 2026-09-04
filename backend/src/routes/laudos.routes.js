import { Router } from "express";
import { requireAuth, requirePerfil } from "../middleware/auth.middleware.js";

export const laudosRouter = Router();

// RF03 — recebimento automático do laudo via PACS/RIS (objetivo desejável;
// alternativa: endpoint de importação manual se a integração não for viável no prazo).
// Também é aqui que o Paciente é cadastrado automaticamente (RF02): se o exame que
// vem do PACS/RIS for de alguém sem Usuario/Paciente ainda, criar os dois nessa rota
// (mesmo padrão de usuarios.routes.js: Usuario com senhaHash null + convite RF09).
laudosRouter.post("/", requireAuth, requirePerfil("MEDICO_EXECUTANTE"), (req, res) => {
  res.status(501).json({ error: "TODO RF03: disponibilizar laudo (PACS/RIS ou importação manual)" });
});

// RF11 — laudos executados pelo médico executante logado
laudosRouter.get("/executados", requireAuth, requirePerfil("MEDICO_EXECUTANTE"), (req, res) => {
  res.status(501).json({ error: "TODO RF11: listar laudos executados pelo médico logado" });
});

// RF05 — visualização/download de um laudo em PDF (checar permissão via RN01 antes de servir o arquivo)
laudosRouter.get("/:id/download", requireAuth, (req, res) => {
  res.status(501).json({ error: "TODO RF05: download do laudo em PDF" });
});

// RF12 — download em lote de laudos por período (regulação)
laudosRouter.get("/lote", requireAuth, requirePerfil("REGULACAO"), (req, res) => {
  res.status(501).json({ error: "TODO RF12: download em lote por período" });
});
