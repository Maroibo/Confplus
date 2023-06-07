/*
  Warnings:

  - You are about to drop the `_LocationToSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaperToSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location_city` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_LocationToSession_B_index";

-- DropIndex
DROP INDEX "_LocationToSession_AB_unique";

-- DropIndex
DROP INDEX "_PaperToSession_B_index";

-- DropIndex
DROP INDEX "_PaperToSession_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_LocationToSession";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PaperToSession";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Paper" (
    "paper_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "session_id" INTEGER,
    CONSTRAINT "Paper_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session" ("session_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Paper" ("abstract", "document", "paper_id", "title") SELECT "abstract", "document", "paper_id", "title" FROM "Paper";
DROP TABLE "Paper";
ALTER TABLE "new_Paper" RENAME TO "Paper";
CREATE TABLE "new_Session" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conference_id" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "from_time" TEXT NOT NULL,
    "to_time" TEXT NOT NULL,
    "location_city" TEXT NOT NULL,
    CONSTRAINT "Session_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "Conference" ("conference_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Session_location_city_fkey" FOREIGN KEY ("location_city") REFERENCES "Location" ("city") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("conference_id", "day", "from_time", "session_id", "to_time") SELECT "conference_id", "day", "from_time", "session_id", "to_time" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
