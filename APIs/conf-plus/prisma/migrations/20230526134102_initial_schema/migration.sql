-- CreateTable
CREATE TABLE "Institution" (
    "institution_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Author" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "institution_id" TEXT NOT NULL,
    CONSTRAINT "Author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Author_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "Institution" ("institution_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reviewer" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "Reviewer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organizer" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "Organizer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Author_Paper" (
    "author_id" INTEGER NOT NULL,
    "paper_id" INTEGER NOT NULL,
    "main_author" BOOLEAN NOT NULL,

    PRIMARY KEY ("author_id", "paper_id"),
    CONSTRAINT "Author_Paper_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Author_Paper_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper" ("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paper" (
    "paper_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "document" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Review" (
    "overall" INTEGER NOT NULL,
    "contribution" INTEGER NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "paper_id" INTEGER NOT NULL,

    PRIMARY KEY ("paper_id", "reviewer_id"),
    CONSTRAINT "Review_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "Paper" ("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "Reviewer" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conference" (
    "conference_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "img" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "city" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Session" (
    "session_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "conference_id" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "from_time" TEXT NOT NULL,
    "to_time" TEXT NOT NULL,
    CONSTRAINT "Session_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "Conference" ("conference_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PaperToSession" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PaperToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Paper" ("paper_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PaperToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LocationToSession" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LocationToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Location" ("city") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LocationToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_PaperToSession_AB_unique" ON "_PaperToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_PaperToSession_B_index" ON "_PaperToSession"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToSession_AB_unique" ON "_LocationToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToSession_B_index" ON "_LocationToSession"("B");
