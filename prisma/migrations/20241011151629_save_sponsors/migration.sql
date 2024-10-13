-- CreateTable
CREATE TABLE "savedSponsor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "legiscanPeopleId" INTEGER NOT NULL,
    "personHash" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "suffix" TEXT,
    "district" TEXT NOT NULL,

    CONSTRAINT "savedSponsor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savedSponsor" ADD CONSTRAINT "savedSponsor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
