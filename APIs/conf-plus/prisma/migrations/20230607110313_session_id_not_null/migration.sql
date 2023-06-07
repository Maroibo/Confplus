-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paper" (
    "paper_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "session_id" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Paper_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("session_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Paper" ("abstract", "document", "paper_id", "session_id", "title") SELECT "abstract", "document", "paper_id", coalesce("session_id", 0) AS "session_id", "title" FROM "Paper";
DROP TABLE "Paper";
ALTER TABLE "new_Paper" RENAME TO "Paper";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
