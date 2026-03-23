import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { env } from "../lib/env.js";
import { proxyRequest } from "../lib/proxy.js";

const wishlist = new Hono();

// All wishlist routes require a valid session.
wishlist.use("/*", requireAuth);

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
