# Requisitos (base para o backlog)

Resumo dos requisitos funcionais definidos na Etapa 3 (`../../Etapa 3 - Requisitos/CSI606_Etapa3_Multiclin.docx`)
e das histórias de usuário da Etapa 4. Cada RF abaixo vira uma ou mais issues no board.

## Requisitos Funcionais

- **RF01** — Autenticação de usuários com perfis distintos: médico solicitante, médico executante, paciente e regulação municipal.
- **RF02** — Cadastro e gerenciamento de pacientes vinculados aos seus exames e laudos.
- **RF03** — Disponibilização automática do laudo via integração com o sistema de imagem existente (PACS/RIS) — não é upload manual. *(Objetivo desejável; se inviável no prazo, cai para importação manual — ver Escopo na Etapa 3.)*
- **RF04** — Busca e filtro de laudos por paciente, data e modalidade de exame (US, RX, MG, TC, RM).
- **RF05** — Visualização e download de laudos em PDF.
- **RF06** — Painel de acompanhamento para a regulação municipal, com status dos exames sob sua responsabilidade.
- **RF07** — Notificação automática por e-mail ao paciente e ao médico solicitante quando um novo laudo fica disponível.
- **RF08** — Controle de permissões, garantindo que cada perfil acesse apenas os laudos aos quais tem direito.
- **RF09** — Definição de senha por convite no primeiro acesso (sem cadastro livre de senha).
- **RF10** — Alteração de senha pelo próprio usuário (tela de configurações).
- **RF11** — Listagem de laudos executados pelo médico executante (com filtro por modalidade).
- **RF12** — Download em lote de laudos por período, para a regulação municipal.

> **RF13**: numeração pendente de fechamento — ver histórico da Etapa 4 (pendência já registrada de
> inserir as histórias de usuário RF09-RF13 e os diagramas PlantUML no documento). Ajustar este
> arquivo e a Etapa 4 assim que a dupla decidir o requisito exato.

## Requisitos Não Funcionais

- **RNF01** — Interface responsiva (desktop e celular).
- **RNF02** — Segurança dos dados: autenticação criptografada e comunicação via HTTPS.
- **RNF03** — Usabilidade simples (parte dos pacientes tem baixa familiaridade com tecnologia).
- **RNF04** — Desempenho adequado na busca e no carregamento dos laudos.
- **RNF05** — Disponibilidade da aplicação, hospedada em ambiente de nuvem.
- **RNF06** — Conformidade com a LGPD (dados sensíveis de saúde).

## Regras de Negócio

- **RN01** — Um laudo só pode ser acessado pelo paciente ao qual pertence, pelo médico solicitante que encaminhou o exame, pelo médico executante responsável e, quando aplicável, pela regulação municipal.
- **RN02** — Somente laudos finalizados pelo médico executante ficam disponíveis para os demais perfis.
- **RN03** — O paciente pode apenas visualizar e baixar seus laudos, sem permissão para alterá-los ou excluí-los.
- **RN04** — A regulação municipal tem acesso apenas aos exames encaminhados pelo sistema público de saúde, não à totalidade dos laudos da clínica.

## Perfis / Atores

- **Paciente** — acessa e baixa seus próprios laudos.
- **Médico solicitante** — acompanha o retorno dos laudos dos pacientes que encaminhou.
- **Médico executante** — produz e finaliza laudos.
- **Regulação municipal** — acompanha exames encaminhados pelo sistema público de saúde.
