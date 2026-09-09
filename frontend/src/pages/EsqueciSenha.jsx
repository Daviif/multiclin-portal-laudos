import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import multiclinLogo from "../assets/multiclin-logo.png";
import "./Login.css";

// "Esqueci minha senha" — não é uma RF formal do documento de requisitos, é o
// pré-requisito pro link do botão de mesmo nome no Login (RF01) funcionar de
// verdade. Sempre mostra a mesma mensagem de sucesso, exista ou não o e-mail,
// pra não revelar quem tem conta no sistema (enumeração de usuários).
export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      await api("/auth/esqueci-senha", { method: "POST", body: { email } });
      setEnviado(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <img src={multiclinLogo} alt="Multiclin" className="login-logo" />
        <h1 className="login-title">Redefinir senha</h1>
        <p className="login-description">
          Informe seu e-mail cadastrado. Se ele existir, enviamos um link para você definir uma nova senha.
        </p>

        {enviado ? (
          <p className="login-notice" role="status">
            Se esse e-mail estiver cadastrado, você vai receber um link de redefinição em instantes.
          </p>
        ) : (
          <>
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

            {erro && (
              <p className="login-error" role="alert">
                {erro}
              </p>
            )}

            <button type="submit" className="login-submit" disabled={carregando}>
              {carregando ? "Enviando…" : "Enviar link"}
            </button>
          </>
        )}

        <div className="login-link-row">
          <button type="button" className="login-link" onClick={() => navigate("/")}>
            Voltar para o login
          </button>
        </div>
      </form>
    </div>
  );
}
