import nodemailer from "nodemailer";

// SMTP_HOST vazio (padrão do .env.example) = sem provedor configurado ainda.
// Em vez de falhar, loga o e-mail no console — dá pra testar convite/redefinição
// de senha em dev sem precisar de uma caixa de entrada de verdade.
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    })
  : null;

export async function enviarEmail({ para, assunto, texto }) {
  if (!transporter) {
    console.log(`[email] SMTP não configurado — exibindo no console em vez de enviar.\nPara: ${para}\nAssunto: ${assunto}\n\n${texto}\n`);
    return;
  }

  await transporter.sendMail({ from: process.env.SMTP_FROM, to: para, subject: assunto, text: texto });
}
