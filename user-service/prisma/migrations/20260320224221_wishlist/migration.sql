/*
  Warnings:

  - The primary key for the `wishlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gameName` on the `wishlist` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `wishlist` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "wishlist_userId_idx";

-- AlterTable
ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_pkey",
DROP COLUMN "gameName",
DROP COLUMN "id",
ADD CONSTRAINT "wishlist_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_wishlistId_idx" ON "game"("wishlistId");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "wishlist"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
