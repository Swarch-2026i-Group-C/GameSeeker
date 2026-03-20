import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";

const app = new Hono();

app.route("/auth", authRoutes);
app.route("/wishlist", wishlistRoutes);

serve({
  fetch: app.fetch,
  port: 3000,
});
