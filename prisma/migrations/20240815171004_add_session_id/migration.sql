/*
  Warnings:

  - Added the required column `sessionId` to the `savedBill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "savedBill" ADD COLUMN "sessionId" INTEGER;
UPDATE "savedBill" SET "sessionId" = COALESCE("sessionId", 0);
ALTER TABLE "savedBill" ALTER COLUMN "sessionId" SET NOT NULL;