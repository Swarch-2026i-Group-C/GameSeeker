import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { wishlistController } from "../controllers/wishlist.controller.js";
import { ErrorResponse, SuccessResponse } from "../schemas/common.schema.js";
import {
  AddGameSchema,
  GameSchema,
  WishlistSchema,
} from "../schemas/wishlist.schema.js";

const wishlistRoutes = new OpenAPIHono();

const getWishlistRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Wishlist"],
  summary: "Get user wishlist",
  request: {
    query: z.object({
      userId: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Wishlist fetched",
      content: {
        "application/json": {
          schema: SuccessResponse(WishlistSchema.nullable()),
        },
      },
    },
    400: {
      description: "Missing userId",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
  },
});

wishlistRoutes.openapi(getWishlistRoute, (c) =>
  wishlistController.getWishlist(c),
);

const addGameRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Wishlist"],
  summary: "Add game to wishlist",
  request: {
    body: {
      content: {
        "application/json": {
          schema: AddGameSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Game added",
      content: {
        "application/json": {
          schema: SuccessResponse(GameSchema),
        },
      },
    },
    400: {
      description: "Invalid input",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
  },
});

wishlistRoutes.openapi(addGameRoute, (c) => wishlistController.addGame(c));

const deleteGameRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Wishlist"],
  summary: "Delete game",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Game deleted",
      content: {
        "application/json": {
          schema: z.object({
            success: z.literal(true),
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: "Missing id",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
  },
});

wishlistRoutes.openapi(deleteGameRoute, (c) =>
  wishlistController.deleteGame(c),
);

export default wishlistRoutes;
