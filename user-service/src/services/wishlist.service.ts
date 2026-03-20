import { wishlistRepository } from "../repositories/wishlist.repository.js";

export const wishlistService = {
  getWishlist(userId: string) {
    return wishlistRepository.findByUserId(userId);
  },

  addGame(userId: string, gameName: string) {
    return wishlistRepository.create(userId, gameName);
  },

  deleteGame(id: string) {
    return wishlistRepository.deleteById(id);
  },
};
