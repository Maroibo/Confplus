/*
  Warnings:

  - You are about to drop the column `session_id` on the `Paper` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Presentation" (
    "presentation_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paper_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    CONSTRAINT "Presentation_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper" ("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Presentation_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paper" (
    "paper_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "document" TEXT NOT NULL
);
INSERT INTO "new_Paper" ("abstract", "document", "paper_id", "title") SELECT "abstract", "document", "paper_id", "title" FROM "Paper";
DROP TABLE "Paper";
ALTER TABLE "new_Paper" RENAME TO "Paper";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Presentation_paper_id_key" ON "Presentation"("paper_id");
