import prisma from "../lib/prisma.js";

export const wishlistRepository = {
  // Returns the user's single Wishlist with all Games nested inside
  async findByUserId(userId: string) {
    return prisma.wishlist.findUnique({
      where: { userId },
      include: {
        games: {
          orderBy: { addedAt: "desc" },
        },
      },
    });
  },

  // Creates the Wishlist if it doesn't exist yet, then adds the Game to it
  async addGame(userId: string, gameId: string, gameName: string) {
    // upsert guarantees there is always exactly one Wishlist per user
    await prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    return prisma.game.create({
      data: {
        wishlistId: userId, // wishlist PK is userId
        gameId,
        gameName,
      },
    });
  },

  // Deletes a specific Game entry by its own id
  deleteGameById(id: string) {
    return prisma.game.delete({
      where: { id },
    });
  },
};
