/*
  Warnings:

  - You are about to drop the column `couponId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `pointId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `totalPaid` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `voucherId` on the `order` table. All the data in the column will be lost.
  - Added the required column `totalPaid` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_couponId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_pointId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_voucherId_fkey";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "couponId",
DROP COLUMN "pointId",
DROP COLUMN "totalPaid",
DROP COLUMN "voucherId";

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "couponId" TEXT,
ADD COLUMN     "pointId" TEXT,
ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "voucherId" TEXT;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "points"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
