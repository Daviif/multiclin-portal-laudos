import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

// Usuários de demonstração para desenvolvimento local — um por perfil (RF01).
// Senha de todos: "multiclin123". Nunca usar em produção.
const SENHA_DEMO = "multiclin123";

async function upsertUsuario({ nome, email, perfil }) {
  const senhaHash = await bcrypt.hash(SENHA_DEMO, 10);
  return prisma.usuario.upsert({
    where: { email },
    update: {},
    create: { nome, email, perfil, senhaHash },
  });
}

async function main() {
  const admin = await upsertUsuario({
    nome: "Admin Multiclin",
    email: "admin@multiclin.example",
    perfil: "ADMINISTRADOR",
  });

  const medicoSo = await upsertUsuario({
    nome: "Dr. Carlos",
    email: "carlos.solicitante@multiclin.example",
    perfil: "MEDICO_SOLICITANTE",
  });

  const medicoEx = await upsertUsuario({
    nome: "Dra. Fernanda",
    email: "fernanda.executante@multiclin.example",
    perfil: "MEDICO_EXECUTANTE",
  });

  const regulacao = await upsertUsuario({
    nome: "Ana (Regulação)",
    email: "ana.regulacao@multiclin.example",
    perfil: "REGULACAO",
  });

  const pacienteUsuario = await upsertUsuario({
    nome: "Maria",
    email: "maria.paciente@multiclin.example",
    perfil: "PACIENTE",
  });

  await prisma.paciente.upsert({
    where: { usuarioId: pacienteUsuario.id },
    update: {},
    create: {
      usuarioId: pacienteUsuario.id,
      cpf: "000.000.000-00",
      dataNascimento: new Date("1973-04-12"),
    },
  });

  await prisma.medicoSolicitante.upsert({
    where: { usuarioId: medicoSo.id },
    update: {},
    create: { usuarioId: medicoSo.id, crm: "CRM-MG 00000" },
  });

  await prisma.medicoExecutante.upsert({
    where: { usuarioId: medicoEx.id },
    update: {},
    create: { usuarioId: medicoEx.id, crm: "CRM-MG 11111" },
  });

  await prisma.regulacao.upsert({
    where: { usuarioId: regulacao.id },
    update: {},
    create: { usuarioId: regulacao.id, municipio: "Ouro Preto", uf: "MG" },
  });

  console.log(`Seed concluído. Senha de todos os usuários de demonstração: ${SENHA_DEMO}`);
  console.log(
    [admin, medicoSo, medicoEx, regulacao, pacienteUsuario].map((u) => `${u.perfil}: ${u.email}`).join("\n")
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
