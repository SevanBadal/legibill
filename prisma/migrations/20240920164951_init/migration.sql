-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savedBill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "legiscanBillId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "sessionTitle" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "changeHash" TEXT NOT NULL,

    CONSTRAINT "savedBill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_email" ON "users"("email");

-- AddForeignKey
ALTER TABLE "savedBill" ADD CONSTRAINT "savedBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
