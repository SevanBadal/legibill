/*
  Warnings:

  - Added the required column `sessionId` to the `savedBill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "savedBill" ADD COLUMN     "sessionId" INTEGER NOT NULL;
