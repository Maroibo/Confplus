-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Presentation" (
    "presentation_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paper_id" INTEGER NOT NULL,
    "session_id" INTEGER NOT NULL,
    CONSTRAINT "Presentation_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper" ("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Presentation_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Presentation" ("paper_id", "presentation_id", "session_id") SELECT "paper_id", "presentation_id", "session_id" FROM "Presentation";
DROP TABLE "Presentation";
ALTER TABLE "new_Presentation" RENAME TO "Presentation";
CREATE UNIQUE INDEX "Presentation_paper_id_key" ON "Presentation"("paper_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
