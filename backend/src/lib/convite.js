import jwt from "jsonwebtoken";

const EXPIRA_EM = "7d";

// RF09 — token do convite de primeiro acesso. Sem estado no banco: a própria
// assinatura + expiração do JWT validam o convite na hora de definir a senha.
export function gerarTokenConvite(usuarioId) {
  return jwt.sign({ sub: usuarioId, tipo: "convite" }, process.env.JWT_SECRET, {
    expiresIn: EXPIRA_EM,
  });
}

export function verificarTokenConvite(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.tipo !== "convite") {
    throw new Error("Token não é um convite válido");
  }
  return payload;
}
