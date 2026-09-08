import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api } from "./api";
import * as auth from "./auth";

describe("api()", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("faz GET em /api<path> com o header de conteúdo certo e devolve o JSON", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: "ok" }),
    });

    const data = await api("/health");

    expect(fetch).toHaveBeenCalledWith(
      "/api/health",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
      })
    );
    expect(data).toEqual({ status: "ok" });
  });

  it("envia o body como JSON e o método informado", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await api("/auth/login", { method: "POST", body: { email: "a@b.com", senha: "123456" } });

    const [, options] = fetch.mock.calls[0];
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ email: "a@b.com", senha: "123456" });
  });

  it("inclui o header Authorization quando um token é passado", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await api("/usuarios", { token: "abc123" });

    const [, options] = fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer abc123");
  });

  it("lança um erro com a mensagem do backend quando a resposta não é ok", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "E-mail ou senha inválidos" }),
    });

    await expect(api("/auth/login", { method: "POST", body: {} })).rejects.toThrow(
      "E-mail ou senha inválidos"
    );
  });

  it("em 401 com token, limpa a sessão e redireciona pro login (sessão expirada) em vez de lançar erro", async () => {
    const clearUserSessionSpy = vi.spyOn(auth, "clearUserSession").mockImplementation(() => {});
    delete window.location;
    window.location = { href: "" };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Token inválido ou expirado" }),
    });

    // A promise nunca resolve nesse caso (a navegação é o "retorno") — só
    // garantimos que o redirect e a limpeza de sessão acontecem antes disso.
    api("/usuarios", { token: "abc123" });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(clearUserSessionSpy).toHaveBeenCalled();
    expect(window.location.href).toBe("/?sessaoExpirada=1");
  });

  it("em 401 sem token (senha errada no login), lança o erro normalmente", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "E-mail ou senha inválidos" }),
    });

    await expect(api("/auth/login", { method: "POST", body: {} })).rejects.toThrow(
      "E-mail ou senha inválidos"
    );
  });
});
