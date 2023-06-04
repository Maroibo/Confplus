/*
  Warnings:

  - The primary key for the `Author_Paper` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `relation_id` to the `Author_Paper` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author_Paper" (
    "relation_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author_id" INTEGER NOT NULL,
    "paper_id" INTEGER NOT NULL,
    "main_author" BOOLEAN NOT NULL,
    CONSTRAINT "Author_Paper_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Author_Paper_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper" ("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Author_Paper" ("author_id", "main_author", "paper_id") SELECT "author_id", "main_author", "paper_id" FROM "Author_Paper";
DROP TABLE "Author_Paper";
ALTER TABLE "new_Author_Paper" RENAME TO "Author_Paper";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
