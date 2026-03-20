import { Hono } from "hono";
import { wishlistController } from "../controllers/wishlist.controller.js";

const wishlistRoutes = new Hono();

wishlistRoutes.get("/", (c) => wishlistController.getWishlist(c));
wishlistRoutes.post("/", (c) => wishlistController.addGame(c));
wishlistRoutes.delete("/:id", (c) => wishlistController.deleteGame(c));

export default wishlistRoutes;
