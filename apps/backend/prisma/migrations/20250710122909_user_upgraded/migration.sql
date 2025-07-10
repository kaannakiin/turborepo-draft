-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "verifiedUser" BOOLEAN NOT NULL DEFAULT false;
