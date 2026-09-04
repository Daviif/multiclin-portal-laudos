import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { getUserSession } from "../services/auth";
import BotaoSair from "../components/BotaoSair.jsx";
import "./AdminUsuarios.css";

// PACIENTE não entra aqui: pacientes são cadastrados automaticamente pela
// integração com o PACS/RIS (RF03), não manualmente pelo admin.
const PERFIS_CADASTRAVEIS = [
  { valor: "MEDICO_SOLICITANTE", rotulo: "Médico solicitante" },
  { valor: "MEDICO_EXECUTANTE", rotulo: "Médico executante" },
  { valor: "REGULACAO", rotulo: "Regulação municipal" },
  { valor: "ADMINISTRADOR", rotulo: "Administrador" },
];

// Usado só pra exibir o rótulo na tabela — inclui PACIENTE porque pacientes
// aparecem na lista (criados pela integração) mesmo não sendo cadastráveis aqui.
const PERFIS_TODOS = [...PERFIS_CADASTRAVEIS, { valor: "PACIENTE", rotulo: "Paciente" }];

const FORM_VAZIO = {
  nome: "",
  email: "",
  perfil: PERFIS_CADASTRAVEIS[0].valor,
  cpf: "",
  dataNascimento: "",
  crm: "",
  municipio: "",
  uf: "",
  tambemPaciente: false,
};

// RF14 — Administrador cadastra usuário de qualquer perfil e dispara o convite (RF09).
export default function AdminUsuarios() {
  const navigate = useNavigate();
  const [sessao, setSessao] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState(null);

  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const [conviteGerado, setConviteGerado] = useState(null);

  useEffect(() => {
    const sessaoAtual = getUserSession();
    if (sessaoAtual?.usuario?.perfil !== "ADMINISTRADOR") {
      navigate("/", { replace: true });
      return;
    }
    setSessao(sessaoAtual);
  }, [navigate]);

  useEffect(() => {
    if (!sessao) return;
    carregarUsuarios(sessao.token);
  }, [sessao]);

  async function carregarUsuarios(token) {
    setCarregandoLista(true);
    setErroLista(null);
    try {
      const lista = await api("/usuarios", { token });
      setUsuarios(lista);
    } catch (err) {
      setErroLista(err.message);
    } finally {
      setCarregandoLista(false);
    }
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErroForm(null);
    setConviteGerado(null);
    setSalvando(true);

    try {
      const resultado = await api("/usuarios", {
        method: "POST",
        token: sessao.token,
        body: form,
      });
      setConviteGerado(resultado);
      setForm(FORM_VAZIO);
      await carregarUsuarios(sessao.token);
    } catch (err) {
      setErroForm(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (!sessao) return null;

  return (
    <main className="admin-container">
      <header className="admin-header">
        <div className="admin-header-top">
          <h1>Usuários</h1>
          <BotaoSair className="admin-link" />
        </div>
        <p>
          Cadastre médicos, regulação ou outros administradores e envie o convite de primeiro acesso.
          Pacientes são cadastrados automaticamente pela integração com o PACS/RIS quando um exame chega
          (RF03) — não aparecem aqui no formulário.
        </p>
        {sessao.usuario.pacienteVinculado && (
          <button type="button" className="admin-link" onClick={() => navigate("/paciente")}>
            Ver meus laudos →
          </button>
        )}
      </header>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" required value={form.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} />
          </div>

          <div className="admin-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => atualizarCampo("email", e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="perfil">Perfil</label>
            <select id="perfil" value={form.perfil} onChange={(e) => atualizarCampo("perfil", e.target.value)}>
              {PERFIS_CADASTRAVEIS.map((p) => (
                <option key={p.valor} value={p.valor}>
                  {p.rotulo}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field admin-field-checkbox">
            <label htmlFor="tambemPaciente">
              <input
                id="tambemPaciente"
                type="checkbox"
                checked={form.tambemPaciente}
                onChange={(e) => atualizarCampo("tambemPaciente", e.target.checked)}
              />
              {" "}Também é paciente da clínica
            </label>
          </div>

          {form.tambemPaciente && (
            <>
              <div className="admin-field">
                <label htmlFor="cpf">CPF</label>
                <input id="cpf" required value={form.cpf} onChange={(e) => atualizarCampo("cpf", e.target.value)} />
              </div>
              <div className="admin-field">
                <label htmlFor="dataNascimento">Data de nascimento</label>
                <input
                  id="dataNascimento"
                  type="date"
                  required
                  value={form.dataNascimento}
                  onChange={(e) => atualizarCampo("dataNascimento", e.target.value)}
                />
              </div>
            </>
          )}

          {(form.perfil === "MEDICO_SOLICITANTE" || form.perfil === "MEDICO_EXECUTANTE") && (
            <div className="admin-field">
              <label htmlFor="crm">CRM</label>
              <input id="crm" required value={form.crm} onChange={(e) => atualizarCampo("crm", e.target.value)} />
            </div>
          )}

          {form.perfil === "REGULACAO" && (
            <>
              <div className="admin-field">
                <label htmlFor="municipio">Município</label>
                <input
                  id="municipio"
                  required
                  value={form.municipio}
                  onChange={(e) => atualizarCampo("municipio", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="uf">UF</label>
                <input
                  id="uf"
                  required
                  maxLength={2}
                  value={form.uf}
                  onChange={(e) => atualizarCampo("uf", e.target.value.toUpperCase())}
                />
              </div>
            </>
          )}
        </div>

        {erroForm && (
          <p className="admin-alert admin-alert-error" role="alert">
            {erroForm}
          </p>
        )}

        {conviteGerado && (
          <p className="admin-alert admin-alert-success">
            Usuário <strong>{conviteGerado.usuario.nome}</strong> cadastrado. RF07 (e-mail) ainda não existe — copie o
            link de convite abaixo e envie manualmente por enquanto:
            <br />
            <code>{window.location.origin + conviteGerado.conviteCaminho}</code>
          </p>
        )}

        <button type="submit" className="admin-submit" disabled={salvando}>
          {salvando ? "Cadastrando…" : "Cadastrar usuário"}
        </button>
      </form>

      <section className="admin-lista">
        <h2>Usuários cadastrados</h2>
        {carregandoLista && <p>Carregando…</p>}
        {erroLista && <p className="admin-alert admin-alert-error">{erroLista}</p>}
        {!carregandoLista && !erroLista && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>
                    {PERFIS_TODOS.find((p) => p.valor === u.perfil)?.rotulo ?? u.perfil}
                    {u.perfil !== "PACIENTE" && u.pacienteVinculado && (
                      <span className="admin-badge admin-badge-info"> + paciente</span>
                    )}
                  </td>
                  <td>
                    <span className={u.convitePendente ? "admin-badge admin-badge-pendente" : "admin-badge admin-badge-ativo"}>
                      {u.convitePendente ? "Convite pendente" : "Ativo"}
                    </span>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={4}>Nenhum usuário cadastrado ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
