import express from "express";
import cors from "cors";

import { authRouter } from "./routes/auth.routes.js";
import { usuariosRouter } from "./routes/usuarios.routes.js";
import { pacientesRouter } from "./routes/pacientes.routes.js";
import { examesRouter } from "./routes/exames.routes.js";
import { laudosRouter } from "./routes/laudos.routes.js";
import { regulacaoRouter } from "./routes/regulacao.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/pacientes", pacientesRouter);
app.use("/exames", examesRouter);
app.use("/laudos", laudosRouter);
app.use("/regulacao", regulacaoRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});
