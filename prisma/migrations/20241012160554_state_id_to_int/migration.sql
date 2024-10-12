/*
  Warnings:

  - Changed the type of `stateId` on the `savedSponsor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "savedSponsor" DROP COLUMN "stateId",
ADD COLUMN     "stateId" INTEGER NOT NULL;
