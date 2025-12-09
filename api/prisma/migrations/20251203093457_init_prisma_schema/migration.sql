-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('CUSTOMER', 'EVENT_ORGANIZER');

-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'REJECTED', 'CANCELLED', 'EXPIRED', 'DONE');

-- CreateEnum
CREATE TYPE "categoryOption" AS ENUM ('FESTIVAL', 'MUSIC', 'CONCERT', 'THEATER', 'COMEDY_SHOW', 'MOVIE_SCREENING', 'DANCE', 'SEMINAR', 'WORKSHOP', 'CONFERENCE', 'WEBINAR', 'TRAINING', 'EXPO', 'TRADE_SHOW', 'NETWORKING_EVENT', 'PRODUCT_LAUNCH', 'SPORTS_EVENT', 'MARATHON', 'TOURNAMENT', 'FITNESS_CLASS', 'COMMUNITY_MEETUP', 'CHARITY', 'VOLUNTEER', 'SOCIAL_EVENT', 'CULTURAL_EVENT', 'FASHION_SHOW', 'FOOD_FEST', 'ART_EXHIBITION', 'BIRTHDAY', 'FAMILY_GATHERING', 'KIDS_EVENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "bio" VARCHAR(500),
    "role" "RoleType" NOT NULL DEFAULT 'CUSTOMER',
    "referralCode" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "eventOrganizerId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "StatusOrder" NOT NULL DEFAULT 'WAITING_PAYMENT',
    "paymentProof" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" "categoryOption" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vanues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vanues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventOrganizerId_fkey" FOREIGN KEY ("eventOrganizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Vanues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
