-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hearts" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "heartsResetAt" TIMESTAMP(3);
