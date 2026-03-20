import prisma from "../lib/prisma.js";

export const wishlistRepository = {
  findByUserId(userId: string) {
    return prisma.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  create(userId: string, gameName: string) {
    return prisma.wishlist.create({
      data: { userId, gameName },
    });
  },

  deleteById(id: string) {
    return prisma.wishlist.delete({
      where: { id },
    });
  },
};
