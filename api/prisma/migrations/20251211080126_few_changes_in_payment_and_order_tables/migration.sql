/*
  Warnings:

  - The values [WAITING_CONFIRMATION,DONE] on the enum `StatusOrder` will be removed. If these variants are still used in the database, this will fail.
  - The values [WAITING_PAYMENT] on the enum `StatusPayment` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `totalPaid` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusOrder_new" AS ENUM ('WAITING_PAYMENT', 'REJECTED', 'EXPIRED', 'PAID');
ALTER TABLE "public"."order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "status" TYPE "StatusOrder_new" USING ("status"::text::"StatusOrder_new");
ALTER TYPE "StatusOrder" RENAME TO "StatusOrder_old";
ALTER TYPE "StatusOrder_new" RENAME TO "StatusOrder";
DROP TYPE "public"."StatusOrder_old";
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'WAITING_PAYMENT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StatusPayment_new" AS ENUM ('PENDING', 'WAITING_CONFIRMATION', 'CANCELLED', 'EXPIRED', 'REJECTED', 'DONE');
ALTER TABLE "public"."payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payment" ALTER COLUMN "status" TYPE "StatusPayment_new" USING ("status"::text::"StatusPayment_new");
ALTER TYPE "StatusPayment" RENAME TO "StatusPayment_old";
ALTER TYPE "StatusPayment_new" RENAME TO "StatusPayment";
DROP TYPE "public"."StatusPayment_old";
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "totalPaid",
ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
