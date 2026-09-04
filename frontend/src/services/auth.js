const STORAGE_KEY = "multiclin.sessao";

// RF01 — cada perfil cai numa home diferente depois do login.
const ROTA_POR_PERFIL = {
  PACIENTE: "/paciente",
  MEDICO_SOLICITANTE: "/medico-solicitante",
  MEDICO_EXECUTANTE: "/medico-executante",
  REGULACAO: "/regulacao/painel",
  ADMINISTRADOR: "/admin/usuarios",
};

export function setUserSession({ token, usuario }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, usuario }));
}

export function getUserSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function clearUserSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getHomeRouteForPerfil(perfil) {
  return ROTA_POR_PERFIL[perfil] ?? "/";
}
