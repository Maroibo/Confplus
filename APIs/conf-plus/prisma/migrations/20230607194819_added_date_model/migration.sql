-- CreateTable
CREATE TABLE "Date" (
    "day" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Date_day_key" ON "Date"("day");
