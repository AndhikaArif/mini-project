/*
  Warnings:

  - The values [CANCELLED] on the enum `StatusOrder` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paidAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProof` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Voucher` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusPayment" AS ENUM ('WAITING_PAYMENT', 'CANCELLED', 'EXPIRED', 'REJECTED', 'DONE');

-- AlterEnum
BEGIN;
CREATE TYPE "StatusOrder_new" AS ENUM ('WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'REJECTED', 'EXPIRED', 'DONE');
ALTER TABLE "public"."order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "status" TYPE "StatusOrder_new" USING ("status"::text::"StatusOrder_new");
ALTER TYPE "StatusOrder" RENAME TO "StatusOrder_old";
ALTER TYPE "StatusOrder_new" RENAME TO "StatusOrder";
DROP TYPE "public"."StatusOrder_old";
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'WAITING_PAYMENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Voucher" DROP CONSTRAINT "Voucher_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Voucher" DROP CONSTRAINT "Voucher_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_voucherId_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "paidAt",
DROP COLUMN "paymentProof";

-- DropTable
DROP TABLE "public"."Ticket";

-- DropTable
DROP TABLE "public"."Voucher";

-- CreateTable
CREATE TABLE "ticket" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voucher" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "customerId" TEXT,
    "code" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "totalPaid" TEXT NOT NULL,
    "status" "StatusPayment" NOT NULL DEFAULT 'WAITING_PAYMENT',
    "paymentProof" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
