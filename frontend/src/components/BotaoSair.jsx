import { useNavigate } from "react-router-dom";
import { clearUserSession } from "../services/auth";

export default function BotaoSair({ className }) {
  const navigate = useNavigate();

  function sair() {
    clearUserSession();
    navigate("/", { replace: true });
  }

  return (
    <button type="button" className={className} onClick={sair}>
      Sair
    </button>
  );
}
