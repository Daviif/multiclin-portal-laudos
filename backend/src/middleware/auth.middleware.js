import jwt from "jsonwebtoken";

// RF01/RF08 — exige um usuário autenticado. Uso: router.get("/rota", requireAuth, handler)
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token não informado" });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

// RF08 — restringe a rota a um ou mais perfis. Uso: requirePerfil("REGULACAO")
export function requirePerfil(...perfis) {
  return (req, res, next) => {
    if (!perfis.includes(req.usuario?.perfil)) {
      return res.status(403).json({ error: "Perfil sem permissão para este recurso" });
    }
    next();
  };
}
