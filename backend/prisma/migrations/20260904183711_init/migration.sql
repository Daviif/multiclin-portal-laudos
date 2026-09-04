-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('PACIENTE', 'MEDICO_SOLICITANTE', 'MEDICO_EXECUTANTE', 'REGULACAO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "ModalidadeExame" AS ENUM ('US', 'RX', 'MG', 'TC', 'RM');

-- CreateEnum
CREATE TYPE "StatusExame" AS ENUM ('SOLICITADO', 'EM_EXECUCAO', 'LAUDO_DISPONIVEL', 'CANCELADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT,
    "perfil" "Perfil" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicos_solicitantes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "crm" TEXT NOT NULL,

    CONSTRAINT "medicos_solicitantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicos_executantes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "crm" TEXT NOT NULL,

    CONSTRAINT "medicos_executantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulacoes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "uf" TEXT NOT NULL,

    CONSTRAINT "regulacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exames" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "medico_solicitante_id" TEXT NOT NULL,
    "regulacao_id" TEXT,
    "tipo_exame" "ModalidadeExame" NOT NULL,
    "data_solicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusExame" NOT NULL DEFAULT 'SOLICITADO',

    CONSTRAINT "exames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laudos" (
    "id" TEXT NOT NULL,
    "exame_id" TEXT NOT NULL,
    "medico_executante_id" TEXT NOT NULL,
    "arquivo_pdf" TEXT NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "laudos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "laudo_id" TEXT NOT NULL,
    "destinatario_id" TEXT NOT NULL,
    "canal" TEXT NOT NULL DEFAULT 'email',
    "enviado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_usuario_id_key" ON "pacientes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_cpf_key" ON "pacientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_solicitantes_usuario_id_key" ON "medicos_solicitantes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_executantes_usuario_id_key" ON "medicos_executantes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "regulacoes_usuario_id_key" ON "regulacoes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "laudos_exame_id_key" ON "laudos"("exame_id");

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicos_solicitantes" ADD CONSTRAINT "medicos_solicitantes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicos_executantes" ADD CONSTRAINT "medicos_executantes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulacoes" ADD CONSTRAINT "regulacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exames" ADD CONSTRAINT "exames_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exames" ADD CONSTRAINT "exames_medico_solicitante_id_fkey" FOREIGN KEY ("medico_solicitante_id") REFERENCES "medicos_solicitantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exames" ADD CONSTRAINT "exames_regulacao_id_fkey" FOREIGN KEY ("regulacao_id") REFERENCES "regulacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laudos" ADD CONSTRAINT "laudos_exame_id_fkey" FOREIGN KEY ("exame_id") REFERENCES "exames"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laudos" ADD CONSTRAINT "laudos_medico_executante_id_fkey" FOREIGN KEY ("medico_executante_id") REFERENCES "medicos_executantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_laudo_id_fkey" FOREIGN KEY ("laudo_id") REFERENCES "laudos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_destinatario_id_fkey" FOREIGN KEY ("destinatario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
