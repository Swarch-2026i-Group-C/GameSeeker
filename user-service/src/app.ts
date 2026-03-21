import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import authRoutes from "./routes/auth.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";

const app = new OpenAPIHono();

app.route("/auth", authRoutes);
app.route("/wishlist", wishlistRoutes);

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Wishlist API",
    version: "1.0.0",
  },
});

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
    supportedSubmitMethods: [],
  }),
);

serve({
  fetch: app.fetch,
  port: 3000,
});
