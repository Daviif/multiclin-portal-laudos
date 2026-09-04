import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import DefinirSenha from "./pages/DefinirSenha.jsx";
import PacienteHome from "./pages/PacienteHome.jsx";
import MedicoSolicitanteHome from "./pages/MedicoSolicitanteHome.jsx";
import MedicoExecutanteHome from "./pages/MedicoExecutanteHome.jsx";
import RegulacaoPainel from "./pages/RegulacaoPainel.jsx";
import RegulacaoMeusLaudos from "./pages/RegulacaoMeusLaudos.jsx";
import Configuracoes from "./pages/Configuracoes.jsx";

// As 8 rotas abaixo espelham as 8 telas do wireframe/protótipo da Etapa 4
// (Etapa 4 - Planejamento/prototipo_navegavel_multiclin.html).
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/definir-senha" element={<DefinirSenha />} />
      <Route path="/paciente" element={<PacienteHome />} />
      <Route path="/medico-solicitante" element={<MedicoSolicitanteHome />} />
      <Route path="/medico-executante" element={<MedicoExecutanteHome />} />
      <Route path="/regulacao/painel" element={<RegulacaoPainel />} />
      <Route path="/regulacao/meus-laudos" element={<RegulacaoMeusLaudos />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
    </Routes>
  );
}
