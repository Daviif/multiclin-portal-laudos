import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getHomeRouteForPerfil, getUserSession, setUserSession } from "../services/auth";
import multiclinLogo from "../assets/multiclin-logo.png";
import "./Login.css";

// RF01 — Login com direcionamento automático por perfil.
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  // Lido uma vez só no mount: se ligasse direto em searchParams, sumiria
  // assim que a URL fosse limpa abaixo.
  const [sessaoExpirada] = useState(
    () => new URLSearchParams(window.location.search).get("sessaoExpirada") === "1"
  );

  // Já logado (sessão salva de uma visita anterior)? Pula direto pra home do perfil.
  useEffect(() => {
    const sessao = getUserSession();
    if (sessao?.usuario?.perfil) {
      navigate(getHomeRouteForPerfil(sessao.usuario.perfil), { replace: true });
    }
  }, [navigate]);

  // Some com o "?sessaoExpirada=1" da URL depois de guardar o aviso acima,
  // sem recarregar a página nem empilhar no histórico.
  useEffect(() => {
    if (!sessaoExpirada) return;
    window.history.replaceState(null, "", window.location.pathname);
  }, [sessaoExpirada]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      const data = await api("/auth/login", { method: "POST", body: { email, senha } });
      setUserSession(data);
      navigate(getHomeRouteForPerfil(data.usuario.perfil), { replace: true });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <div className="login-scan" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <img src={multiclinLogo} alt="Multiclin" className="login-logo" />
        <h1 className="login-title">Bem-vindo(a) de volta</h1>
        <p className="login-description">
          Acesse seus laudos com segurança — excelência em diagnóstico por imagem e atendimento humanizado.
        </p>

        {sessaoExpirada && (
          <p className="login-notice" role="status">
            Sua sessão expirou. Entre novamente para continuar.
          </p>
        )}

        <div className="login-field">
          <label className="login-label" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="senha">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="login-input"
          />
        </div>

        {erro && (
          <p className="login-error" role="alert">
            {erro}
          </p>
        )}

        <button type="submit" className="login-submit" disabled={carregando}>
          {carregando ? "Entrando…" : "Entrar"}
        </button>

        <button type="button" className="login-submit" onClick={() => navigate("/definir-senha")} disabled={carregando}>
          {carregando ? "Entrando…" : "Primeiro acesso"}
        </button>

        <div className="login-link-row">
          <button type="button" className="login-link" onClick={() => navigate("/definir-senha")} disabled={carregando}>
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}
