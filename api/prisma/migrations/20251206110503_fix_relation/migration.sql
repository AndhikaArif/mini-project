-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "used" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referredById" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
