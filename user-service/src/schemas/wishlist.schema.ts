import { z } from "@hono/zod-openapi";

export const AddGameSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
  gameName: z.string(),
});

export const GameSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  gameName: z.string(),
  addedAt: z.string(),
});

export const WishlistSchema = z.object({
  userId: z.string(),
  games: z.array(GameSchema),
});
