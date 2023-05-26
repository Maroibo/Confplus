/*
  Warnings:

  - Added the required column `done` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "overall" INTEGER NOT NULL,
    "contribution" INTEGER NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "done" BOOLEAN NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "paper_id" INTEGER NOT NULL,

    PRIMARY KEY ("paper_id", "reviewer_id"),
    CONSTRAINT "Review_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper" ("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "Reviewer" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("accepted", "contribution", "overall", "paper_id", "reviewer_id", "strength", "weakness") SELECT "accepted", "contribution", "overall", "paper_id", "reviewer_id", "strength", "weakness" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
