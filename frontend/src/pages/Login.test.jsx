import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { clearUserSession } from "../services/auth";

// api() é chamado de verdade só no submit do form de login — mockamos fetch
// pra nenhum teste bater numa rede/backend de verdade.
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  clearUserSession();
  window.history.pushState({}, "", "/");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Login />
    </MemoryRouter>
  );
}

describe("Login", () => {
  it('clicar em "Primeiro acesso" não chama a API de login (não é mais um submit)', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /primeiro acesso/i }));

    expect(fetch).not.toHaveBeenCalled();
  });

  it('clicar em "Esqueci minha senha" também não chama a API de login', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /esqueci minha senha/i }));

    expect(fetch).not.toHaveBeenCalled();
  });

  it('só o botão "Entrar" envia o formulário e chama /auth/login', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "t", usuario: { id: "1", perfil: "PACIENTE" } }),
    });
    renderLogin();

    await user.type(screen.getByLabelText(/e-mail/i), "maria@multiclin.example");
    await user.type(screen.getByLabelText(/senha/i), "multiclin123");
    await user.click(screen.getByRole("button", { name: /^entrar$/i }));

    expect(fetch).toHaveBeenCalledWith("/api/auth/login", expect.objectContaining({ method: "POST" }));
  });

  it("mostra a mensagem de erro do backend quando o login falha", async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "E-mail ou senha inválidos" }),
    });
    renderLogin();

    await user.type(screen.getByLabelText(/e-mail/i), "maria@multiclin.example");
    await user.type(screen.getByLabelText(/senha/i), "errada");
    await user.click(screen.getByRole("button", { name: /^entrar$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("E-mail ou senha inválidos");
  });

  it('mostra o aviso de sessão expirada quando a URL tem "?sessaoExpirada=1"', () => {
    // Login.jsx lê window.location.search diretamente (não useSearchParams),
    // então quem simula a URL aqui é o history real do jsdom, não o MemoryRouter.
    window.history.pushState({}, "", "/?sessaoExpirada=1");

    renderLogin();

    expect(screen.getByRole("status")).toHaveTextContent("Sua sessão expirou");
  });
});
