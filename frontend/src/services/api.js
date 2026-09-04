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
    throw new Error(error.error || `Erro ${res.status}`);
  }

  return res.json();
}
