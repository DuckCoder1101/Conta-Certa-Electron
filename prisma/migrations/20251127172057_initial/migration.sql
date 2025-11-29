-- CreateTable
CREATE TABLE "Clientes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT NOT NULL DEFAULT '',
    "cnpj" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "fee" REAL NOT NULL,
    "feeDueDay" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Cobrancas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fee" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "dueDate" DATETIME NOT NULL,
    "paidAt" DATETIME,
    "clientId" INTEGER NOT NULL,
    CONSTRAINT "Cobrancas_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Servicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "ServicosCobranca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceOriginId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "billingId" INTEGER,
    CONSTRAINT "ServicosCobranca_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "Cobrancas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_cpf_key" ON "Clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_cnpj_key" ON "Clientes"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_phone_key" ON "Clientes"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cobrancas_dueDate_clientId_key" ON "Cobrancas"("dueDate", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Servicos_name_key" ON "Servicos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServicosCobranca_billingId_serviceOriginId_key" ON "ServicosCobranca"("billingId", "serviceOriginId");
