-- CreateTable
CREATE TABLE "savedBill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "legiscanBillId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "sessionTitle" TEXT NOT NULL,
    "changeHash" TEXT NOT NULL,

    CONSTRAINT "savedBill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "savedBill" ADD CONSTRAINT "savedBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
