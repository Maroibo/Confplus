-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reviewer" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "Reviewer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Reviewer" ("user_id") SELECT "user_id" FROM "Reviewer";
DROP TABLE "Reviewer";
ALTER TABLE "new_Reviewer" RENAME TO "Reviewer";
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
CREATE TABLE "new_Author_Paper" (
    "relation_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author_id" INTEGER NOT NULL,
    "paper_id" INTEGER NOT NULL,
    "main_author" BOOLEAN NOT NULL,
    CONSTRAINT "Author_Paper_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Author_Paper_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper" ("paper_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Author_Paper" ("author_id", "main_author", "paper_id", "relation_id") SELECT "author_id", "main_author", "paper_id", "relation_id" FROM "Author_Paper";
DROP TABLE "Author_Paper";
ALTER TABLE "new_Author_Paper" RENAME TO "Author_Paper";
CREATE TABLE "new_Session" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conference_id" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "from_time" TEXT NOT NULL,
    "to_time" TEXT NOT NULL,
    "location_city" TEXT NOT NULL,
    CONSTRAINT "Session_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "Conference" ("conference_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_location_city_fkey" FOREIGN KEY ("location_city") REFERENCES "Location" ("city") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("conference_id", "day", "from_time", "location_city", "session_id", "to_time") SELECT "conference_id", "day", "from_time", "location_city", "session_id", "to_time" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE TABLE "new_Author" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "institution_id" TEXT NOT NULL,
    CONSTRAINT "Author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Author_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "Institution" ("institution_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Author" ("institution_id", "user_id") SELECT "institution_id", "user_id" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE TABLE "new_Organizer" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "Organizer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Organizer" ("user_id") SELECT "user_id" FROM "Organizer";
DROP TABLE "Organizer";
ALTER TABLE "new_Organizer" RENAME TO "Organizer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
