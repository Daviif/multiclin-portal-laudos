// RF07 — disparo de notificação por e-mail quando um laudo novo fica disponível.
// Chamado internamente (ex: a partir do fluxo de RF03), não é uma rota HTTP.
export async function notificarLaudoDisponivel(_laudoId) {
  throw new Error("TODO RF07: enviar e-mail ao paciente e ao médico solicitante");
}
