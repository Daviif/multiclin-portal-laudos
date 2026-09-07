import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api } from "./api";

describe("api()", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
});
