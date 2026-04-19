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
      distinct: ["gameName"],
    });
    return games.map((g) => g.gameName);
  },

  async updateGamePrices(
    gameName: string,
    priceCents: number | null,
    originalPriceCents: number | null,
    currency: string | null,
    store: string | null,
  ) {
    return prisma.game.updateMany({
      where: { gameName },
      data: {
        priceCents,
        originalPriceCents,
        currency,
        store,
      },
    });
  },

  async getSubscribersForGames(gameNames: string[]) {
    const games = await prisma.game.findMany({
      where: { gameName: { in: gameNames } },
      include: {
        wishlist: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    const result: Record<
      string,
      { id: string; name: string; email: string }[]
    > = {};
    for (const name of gameNames) {
      result[name] = [];
    }

    for (const game of games) {
      if (game.wishlist && game.wishlist.user) {
        // Ensure no duplicate users for the same game
        if (
          !result[game.gameName].some((u) => u.id === game.wishlist.user.id)
        ) {
          result[game.gameName].push(game.wishlist.user);
        }
      }
    }

    return result;
  },
};
