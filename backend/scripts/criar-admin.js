import "dotenv/config";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

// Bootstrap do primeiro Administrador (RF14): POST /usuarios exige estar
// logado como admin, então precisa de um jeito de criar o primeiro sem passar
// pela API. Uso: npm run admin:criar
async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const nome = (await rl.question("Nome: ")).trim();
  const email = (await rl.question("E-mail: ")).trim().toLowerCase();
  const senha = await rl.question("Senha (mínimo 8 caracteres): ");

  // Quem cria a própria conta de admin pode também já ter feito exame na
  // clínica como paciente (ex: dono/funcionário da Multiclin) — mesmo caso do
  // checkbox "também é paciente" do cadastro via painel.
  const tambemPacienteResp = (await rl.question("Essa pessoa também é paciente da clínica? (s/N): "))
    .trim()
    .toLowerCase();
  const tambemPaciente = tambemPacienteResp === "s" || tambemPacienteResp === "sim";
  let cpf = "";
  let dataNascimento = "";
  if (tambemPaciente) {
    cpf = (await rl.question("CPF: ")).trim();
    dataNascimento = (await rl.question("Data de nascimento (AAAA-MM-DD): ")).trim();
  }
  rl.close();

  if (!nome || !email) {
    console.error("Nome e e-mail são obrigatórios.");
    process.exitCode = 1;
    return;
  }
  if (senha.length < 8) {
    console.error("A senha precisa ter pelo menos 8 caracteres.");
    process.exitCode = 1;
    return;
  }
  if (tambemPaciente && (!cpf || !dataNascimento)) {
    console.error("Paciente exige CPF e data de nascimento.");
    process.exitCode = 1;
    return;
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    console.error(`Já existe um usuário com o e-mail ${email} (perfil ${existente.perfil}).`);
    process.exitCode = 1;
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.$transaction(async (tx) => {
    const criado = await tx.usuario.create({
      data: { nome, email, perfil: "ADMINISTRADOR", senhaHash },
    });
    if (tambemPaciente) {
      await tx.paciente.create({
        data: { usuarioId: criado.id, cpf, dataNascimento: new Date(dataNascimento) },
      });
    }
    return criado;
  });

  console.log(
    `Administrador criado: ${usuario.email}${tambemPaciente ? " (também paciente)" : ""}. Já pode fazer login normalmente.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
