import jwt from "jsonwebtoken";

const EXPIRA_EM = "1h";

// Redefinição de senha ("esqueci minha senha"): mesma mecânica do convite
// (lib/convite.js) — token JWT autocontido, sem estado no banco — mas expira
// bem mais rápido e, ao contrário do convite, pode ser usado mesmo que o
// usuário já tenha uma senha definida (é exatamente o caso de uso).
export function gerarTokenRedefinicao(usuarioId) {
  return jwt.sign({ sub: usuarioId, tipo: "redefinicao" }, process.env.JWT_SECRET, {
    expiresIn: EXPIRA_EM,
  });
}

export function verificarTokenRedefinicao(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  if (payload.tipo !== "redefinicao") {
    throw new Error("Token não é uma redefinição válida");
  }
  return payload;
}
