import prisma from "../lib/prisma.js";

export const wishlistRepository = {
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

  async addGame(userId: string, gameId: string, gameName: string) {
    await prisma.wishlist.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    return prisma.game.create({
      data: {
        wishlistId: userId,
        gameId,
        gameName,
      },
    });
  },

  deleteGameById(id: string) {
    return prisma.game.delete({
      where: { id },
    });
  },

  async getAllDistinctGames() {
    const games = await prisma.game.findMany({
      select: { gameName: true },
      distinct: ['gameName'],
    });
    return games.map((g) => g.gameName);
  },

  async updateGamePrices(
    gameName: string,
    priceCents: number | null,
    originalPriceCents: number | null,
    currency: string | null,
    store: string | null
  ) {
    return prisma.game.updateMany({
      where: { gameName },
      data: {
        priceCents,
        originalPriceCents,
        currency,
        store
      },
    });
  },
};
