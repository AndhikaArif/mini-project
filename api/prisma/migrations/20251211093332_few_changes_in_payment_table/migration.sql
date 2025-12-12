/*
  Warnings:

  - You are about to drop the column `customerId` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `totalPaid` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."payment" DROP CONSTRAINT "payment_customerId_fkey";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "customerId",
DROP COLUMN "totalPaid";
