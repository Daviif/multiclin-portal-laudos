# Portal de Laudos Multiclin

Projeto da disciplina **CSI606 — Sistemas Web I** (UFOP), em dupla.

Portal único de laudos médicos para a clínica de diagnóstico por imagem Multiclin, com acesso segmentado por perfil de usuário (Paciente, Médico Solicitante, Médico Executante e Regulação Municipal), substituindo o cenário atual de laudos espalhados em 2-3 plataformas sem controle de acesso.

## Dupla

- Davi Emílio de Paula Fonseca
- João Vitor Cota Silva

## Documentação das etapas anteriores

- `Etapa 1 - Escolha da Empresa`
- `Etapa 2 - Pitch`
- `Etapa 3 - Requisitos`
- `Etapa 4 - Planejamento` (modelo de dados, diagramas, wireframes e protótipo navegável)

Os requisitos funcionais/não funcionais e regras de negócio usados como base para o backlog desta etapa estão resumidos em [`docs/requisitos.md`](docs/requisitos.md).

## Stack

Definida na Etapa 2 (`Etapa 2 - Pitch/Pitch_Multiclin_CSI606.pdf`):

- **Frontend:** React (Vite)
- **Backend/API:** Node.js + Express
- **Banco de dados:** PostgreSQL + Prisma
- **Autenticação:** JWT
- **Hospedagem:** nuvem (a definir)

## Estrutura do repositório

```
backend/     API Express + Prisma (schema em backend/prisma/schema.prisma)
frontend/    App React (Vite), uma página por tela do wireframe da Etapa 4
docker-compose.yml   Postgres local para desenvolvimento
```

## Como rodar localmente

1. Suba o banco: `docker compose up -d`
2. Backend:
   ```
   cd backend
   cp .env.example .env
   npm install
   npm run prisma:migrate   # cria as tabelas a partir do schema.prisma
   npm run admin:criar      # cria o 1º usuário Administrador (nome/e-mail/senha via prompt)
   npm run dev              # http://localhost:3333
   ```
   Alternativa pra testar rápido sem digitar nada: `npm run prisma:seed` cria um usuário de
   demonstração por perfil (senha `multiclin123` pra todos — não usar fora do ambiente local).
3. Frontend:
   ```
   cd frontend
   npm install
   npm run dev               # http://localhost:5173
   ```

O frontend faz proxy de `/api/*` para o backend (ver `frontend/vite.config.js`).

RF01 (login), RF09 (definir senha do convite) e RF14 (Administrador cadastra usuário) já
funcionam de ponta a ponta. O resto das rotas/telas ainda é um placeholder (`TODO RFxx: ...`)
apontando para a issue correspondente no board — a estrutura de pastas já reflete os 8
wireframes e os RF01-RF12, falta implementar a lógica de cada um.

## Processo de desenvolvimento

Trabalhamos com **Kanban** no GitHub Projects. O fluxo de trabalho, convenções de branch/commit e definição de pronto estão descritos em [`PROCESSO.md`](PROCESSO.md).

- **Board:** https://github.com/users/Daviif/projects/1
- **Issues (backlog):** https://github.com/Daviif/multiclin-portal-laudos/issues

## Status

Etapa 5 (implementação) recém-iniciada — ver o board do projeto para o andamento atual.
