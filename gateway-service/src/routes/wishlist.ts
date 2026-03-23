import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { idempotency } from "../middleware/idempotency.js";
import { env } from "../lib/env.js";
import { proxyRequest } from "../lib/proxy.js";

const wishlist = new Hono();

// All wishlist routes require a valid session.
wishlist.use("/*", requireAuth);

// Prevent duplicate "add to wishlist" requests within 24 h.
// Runs after requireAuth so userId is available in context.
wishlist.use("/games", idempotency);

/**
 * Wildcard proxy: /api/wishlist/* -> user-service /wishlist/*
 * All routes are protected by requireAuth above.
 */
wishlist.all("/*", async (c) => {
  const path = c.req.path.replace(/^\/api\/wishlist/, "/wishlist");
  const queryString = c.req.url.includes("?")
    ? c.req.url.slice(c.req.url.indexOf("?"))
    : "";
  const upstream = `${env.USER_SERVICE_URL}${path}${queryString}`;
  return proxyRequest(upstream, c);
});

export default wishlist;
