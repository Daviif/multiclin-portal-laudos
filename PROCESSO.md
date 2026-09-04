# Processo de desenvolvimento — Kanban

Como somos dois desenvolvendo em paralelo, adotamos um fluxo simples de **Kanban**
em vez de tentar encaixar sprints formais no calendário da disciplina. O objetivo é
ter visibilidade do que cada um está fazendo e evitar retrabalho, sem burocracia
desnecessária.

## Board

Board no GitHub Projects, ligado a este repositório. Colunas:

| Coluna | Significado |
|---|---|
| **Backlog** | Item identificado, ainda não detalhado/pronto para começar |
| **A Fazer** | Detalhado o suficiente para alguém pegar e começar agora |
| **Em andamento** | Alguém está trabalhando (limite: 1-2 itens por pessoa por vez) |
| **Em revisão** | Pull Request aberto, aguardando o outro revisar |
| **Concluído** | Revisado, mergeado na `main` e testado manualmente |

Cada item do board é uma *issue* do repositório, derivada de um requisito funcional
(RF) do documento de requisitos. Issues grandes (um RF inteiro) devem ser quebradas
em subtarefas menores antes de irem para "A Fazer".

## Fluxo de trabalho

1. Pegue um item de **A Fazer**, mova para **Em andamento** e atribua-se a ele.
2. Crie uma branch a partir da `main`: `tipo/descricao-curta` (ex: `feat/login-por-perfil`,
   `fix/filtro-modalidade`, `docs/atualizar-readme`).
3. Faça commits pequenos e com mensagens no padrão *Conventional Commits*:
   `feat: `, `fix: `, `docs: `, `refactor: `, `test: `, `chore: `.
4. Ao terminar, abra um Pull Request para a `main`, mova o item para **Em revisão**
   e peça revisão da outra pessoa da dupla.
5. Quem revisa testa localmente e comenta/aprova. Só o autor do PR faz o merge,
   depois de aprovado.
6. Após o merge, mova o item para **Concluído** e feche a issue (o GitHub faz isso
   automaticamente se o commit/PR referenciar `closes #N`).

## Definição de pronto (Definition of Done)

Um item só vai para **Concluído** quando:

- O código está mergeado na `main`;
- Foi testado manualmente rodando a aplicação (não só lido/revisado);
- Não quebrou nenhuma tela/fluxo existente do protótipo/backlog anterior;
- Está de acordo com o requisito funcional (RF) de origem.

## Prioridade dos itens

A ordem do backlog segue o escopo definido na Etapa 3, priorizando primeiro o que é
essencial para qualquer perfil logar e ver um laudo (RF01, RF08, RF05), depois o
fluxo de disponibilização automática (RF03) e notificação (RF07), e por último os
recursos específicos de cada perfil (RF04, RF06, RF09-RF12).

A integração real com PACS/RIS (RF03) é tratada como objetivo desejável — se não for
viável dentro do prazo, cai para importação manual como alternativa (conforme já
registrado no escopo da Etapa 3).
