import { describe, it, expect, beforeEach } from "vitest";
import {
  setUserSession,
  getUserSession,
  clearUserSession,
  getHomeRouteForPerfil,
} from "./auth";

describe("getHomeRouteForPerfil", () => {
  it("mapeia cada perfil para a home correta", () => {
    expect(getHomeRouteForPerfil("PACIENTE")).toBe("/paciente");
    expect(getHomeRouteForPerfil("MEDICO_SOLICITANTE")).toBe("/medico-solicitante");
    expect(getHomeRouteForPerfil("MEDICO_EXECUTANTE")).toBe("/medico-executante");
    expect(getHomeRouteForPerfil("REGULACAO")).toBe("/regulacao/painel");
    expect(getHomeRouteForPerfil("ADMINISTRADOR")).toBe("/admin/usuarios");
  });

  it("cai em / para um perfil desconhecido", () => {
    expect(getHomeRouteForPerfil("PERFIL_QUE_NAO_EXISTE")).toBe("/");
    expect(getHomeRouteForPerfil(undefined)).toBe("/");
  });
});

describe("sessão do usuário (localStorage)", () => {
  beforeEach(() => {
    clearUserSession();
  });

  it("retorna null quando não há sessão salva", () => {
    expect(getUserSession()).toBeNull();
  });

  it("guarda e recupera token + usuário", () => {
    const sessao = { token: "abc123", usuario: { id: "1", perfil: "PACIENTE" } };
    setUserSession(sessao);
    expect(getUserSession()).toEqual(sessao);
  });

  it("limpa a sessão salva", () => {
    setUserSession({ token: "abc123", usuario: { id: "1", perfil: "PACIENTE" } });
    clearUserSession();
    expect(getUserSession()).toBeNull();
  });
});
