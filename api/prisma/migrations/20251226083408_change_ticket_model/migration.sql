/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `ticket` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "StatusOrder" ADD VALUE 'CANCELLED';

-- CreateIndex
CREATE UNIQUE INDEX "ticket_orderId_key" ON "ticket"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_code_key" ON "ticket"("code");
