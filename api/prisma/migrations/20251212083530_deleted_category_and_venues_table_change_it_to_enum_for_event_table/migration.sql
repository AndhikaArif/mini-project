/*
  Warnings:

  - You are about to drop the column `categoryId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `venueId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vanues` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryOption" AS ENUM ('ENTERTAINMENT', 'SPORTS_AND_COMPETITION', 'EDUCATION_AND_WORKSHOP', 'BUSSINESS_AND_NETWORKING', 'ART_AND_CULTURE');

-- CreateEnum
CREATE TYPE "LocationOption" AS ENUM ('JAKARTA', 'SURABAYA', 'BANDUNG', 'MEDAN', 'SEMARANG', 'YOGYAKARTA', 'MAKASSAR', 'BALI', 'PALEMBANG', 'BALIKPAPAN');

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."events" DROP CONSTRAINT "events_venueId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "categoryId",
DROP COLUMN "venueId",
ADD COLUMN     "category" "CategoryOption" NOT NULL,
ADD COLUMN     "location" "LocationOption" NOT NULL;

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."Vanues";

-- DropEnum
DROP TYPE "public"."categoryOption";
