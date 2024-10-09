-- AlterTable
ALTER TABLE "User" ADD COLUMN "bio" TEXT;

-- CreateTable
CREATE TABLE "Socials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    CONSTRAINT "Socials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
