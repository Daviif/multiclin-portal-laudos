import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getHomeRouteForPerfil, setUserSession } from "../services/auth";
import multiclinLogo from "../assets/multiclin-logo.png";
import "./Login.css";

const TAMANHO_MINIMO_SENHA = 8;

// RF09 — Definição de senha por convite no primeiro acesso (issue #9), e
// também redefinição ("esqueci minha senha") — mesma tela, o token na URL
// (?token=...) já diz pro backend qual dos dois casos é (lib/resetSenha.js).
export default function DefinirSenha() {
  const navigate = useNavigate();
  const [token] = useState(() => new URLSearchParams(window.location.search).get("token"));
  const [contaInfo, setContaInfo] = useState(null);
  const [erroToken, setErroToken] = useState(null);
  const [carregandoToken, setCarregandoToken] = useState(true);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Confere o token antes de mostrar o formulário, pra exibir de quem é a
  // conta (evita a pessoa digitar uma senha nova sem saber pra qual login ela vale).
  useEffect(() => {
    if (!token) {
      setErroToken("Link inválido. Peça um novo convite ou uma nova redefinição de senha.");
      setCarregandoToken(false);
      return;
    }

    api(`/auth/token-info/${token}`)
      .then(setContaInfo)
      .catch((err) => setErroToken(err.message))
      .finally(() => setCarregandoToken(false));
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(null);

    if (novaSenha.length < TAMANHO_MINIMO_SENHA) {
      setErro(`A senha precisa ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`);
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const data = await api("/auth/definir-senha", { method: "POST", body: { token, novaSenha } });
      setUserSession(data);
      navigate(getHomeRouteForPerfil(data.usuario.perfil), { replace: true });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoToken) {
    return <div className="login-container" />;
  }

  if (erroToken) {
    return (
      <div className="login-container">
        <div className="login-form">
          <img src={multiclinLogo} alt="Multiclin" className="login-logo" />
          <h1 className="login-title">Link inválido</h1>
          <p className="login-error" role="alert">
            {erroToken}
          </p>
          <button type="button" className="login-submit" onClick={() => navigate("/")}>
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <img src={multiclinLogo} alt="Multiclin" className="login-logo" />
        <h1 className="login-title">Definir senha</h1>
        <p className="login-description">
          Definindo a senha de <strong>{contaInfo.nome}</strong> ({contaInfo.email}).
        </p>

        <div className="login-field">
          <label className="login-label" htmlFor="nova-senha">
            Nova senha
          </label>
          <input
            id="nova-senha"
            type="password"
            autoComplete="new-password"
            required
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="confirmar-senha">
            Confirmar senha
          </label>
          <input
            id="confirmar-senha"
            type="password"
            autoComplete="new-password"
            required
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="login-input"
          />
        </div>

        {erro && (
          <p className="login-error" role="alert">
            {erro}
          </p>
        )}

        <button type="submit" className="login-submit" disabled={carregando}>
          {carregando ? "Confirmando…" : "Confirmar"}
        </button>
      </form>
    </div>
  );
}
