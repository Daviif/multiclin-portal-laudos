import { clearUserSession } from "./auth";

const BASE_URL = "/api";

// Wrapper fino sobre fetch — troca o header Authorization automaticamente
// quando houver um token salvo (RF01/RF08). Ampliar conforme as rotas do
// backend forem implementadas.
export async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    // 401 numa chamada que já mandou token = sessão expirada/inválida (não é
    // "senha errada" — isso não passa token e é tratado normalmente pela
    // tela de login). Desloga e manda pra tela de login com o motivo.
    if (res.status === 401 && token) {
      clearUserSession();
      window.location.href = "/?sessaoExpirada=1";
      return new Promise(() => {});
    }

    throw new Error(error.error || `Erro ${res.status}`);
  }

  return res.json();
}
