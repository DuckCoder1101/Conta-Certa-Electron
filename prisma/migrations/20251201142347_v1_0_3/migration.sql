-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Clientes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "fee" REAL NOT NULL,
    "feeDueDay" INTEGER NOT NULL
);
INSERT INTO "new_Clientes" ("cnpj", "cpf", "email", "fee", "feeDueDay", "id", "name", "phone") SELECT "cnpj", "cpf", "email", "fee", "feeDueDay", "id", "name", "phone" FROM "Clientes";
DROP TABLE "Clientes";
ALTER TABLE "new_Clientes" RENAME TO "Clientes";
CREATE UNIQUE INDEX "Clientes_cpf_key" ON "Clientes"("cpf");
CREATE UNIQUE INDEX "Clientes_cnpj_key" ON "Clientes"("cnpj");
CREATE UNIQUE INDEX "Clientes_phone_key" ON "Clientes"("phone");
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
