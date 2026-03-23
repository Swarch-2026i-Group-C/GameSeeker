import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./lib/env.js";
import games from "./routes/games.js";
import auth from "./routes/auth.js";
import wishlist from "./routes/wishlist.js";

const app = new Hono();

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  }),
);

app.use("*", logger());

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/health", (c) => {
  return c.json({ status: "ok", service: "gateway" });
});

// ---------------------------------------------------------------------------
// Upstream routes
// ---------------------------------------------------------------------------

app.route("/api/games", games);
app.route("/api/auth", auth);
app.route("/api/wishlist", wishlist);

// ---------------------------------------------------------------------------
// 404 fallthrough
// ---------------------------------------------------------------------------

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`gateway-service listening on http://localhost:${info.port}`);
  },
);
