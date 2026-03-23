import { Hono } from "hono";
import { env } from "../lib/env.js";
import { proxyRequest } from "../lib/proxy.js";

const games = new Hono();

/**
 * Wildcard proxy: /api/games/* -> scrapper-service /api/v1/games/*
 *
 * Covers all scrapper routes:
 *   GET /api/games/search          -> /api/v1/games/search?name=
 *   GET /api/games/compare         -> /api/v1/games/compare?name=
 *   GET /api/games/compare/bulk    -> /api/v1/games/compare/bulk
 *   GET /api/games/search/:store   -> /api/v1/games/search/:store
 *   GET /api/games/trending/:store -> /api/v1/games/trending/:store
 */
games.all("/*", async (c) => {
  const path = c.req.path.replace(/^\/api\/games/, "/api/v1/games");
  const queryString = c.req.url.includes("?")
    ? c.req.url.slice(c.req.url.indexOf("?"))
    : "";
  const upstream = `${env.SCRAPPER_SERVICE_URL}${path}${queryString}`;
  return proxyRequest(upstream, c);
});

export default games;
