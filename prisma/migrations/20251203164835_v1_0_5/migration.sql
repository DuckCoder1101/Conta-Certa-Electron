-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cobrancas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fee" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "dueDate" TEXT NOT NULL,
    "paidAt" TEXT,
    "clientId" INTEGER,
    CONSTRAINT "Cobrancas_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clientes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cobrancas" ("clientId", "dueDate", "fee", "id", "paidAt", "status") SELECT "clientId", "dueDate", "fee", "id", "paidAt", "status" FROM "Cobrancas";
DROP TABLE "Cobrancas";
ALTER TABLE "new_Cobrancas" RENAME TO "Cobrancas";
CREATE UNIQUE INDEX "Cobrancas_dueDate_clientId_key" ON "Cobrancas"("dueDate", "clientId");
CREATE TABLE "new_ServicosCobranca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "serviceOriginId" INTEGER,
    "billingId" INTEGER,
    CONSTRAINT "ServicosCobranca_serviceOriginId_fkey" FOREIGN KEY ("serviceOriginId") REFERENCES "Servicos" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ServicosCobranca_billingId_fkey" FOREIGN KEY ("billingId") REFERENCES "Cobrancas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ServicosCobranca" ("billingId", "id", "name", "quantity", "serviceOriginId", "value") SELECT "billingId", "id", "name", "quantity", "serviceOriginId", "value" FROM "ServicosCobranca";
DROP TABLE "ServicosCobranca";
ALTER TABLE "new_ServicosCobranca" RENAME TO "ServicosCobranca";
CREATE UNIQUE INDEX "ServicosCobranca_billingId_serviceOriginId_key" ON "ServicosCobranca"("billingId", "serviceOriginId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
