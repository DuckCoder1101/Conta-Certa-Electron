-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cobrancas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fee" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "dueDate" TEXT NOT NULL,
    "paidAt" TEXT,
    "clientId" INTEGER NOT NULL,
    CONSTRAINT "Cobrancas_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clientes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cobrancas" ("clientId", "dueDate", "fee", "id", "paidAt", "status") SELECT "clientId", "dueDate", "fee", "id", "paidAt", "status" FROM "Cobrancas";
DROP TABLE "Cobrancas";
ALTER TABLE "new_Cobrancas" RENAME TO "Cobrancas";
CREATE UNIQUE INDEX "Cobrancas_dueDate_clientId_key" ON "Cobrancas"("dueDate", "clientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
