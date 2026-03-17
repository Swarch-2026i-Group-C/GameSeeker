import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth.routes.js";

const app = new Hono();

app.route("/auth", authRoutes);

serve({
  fetch: app.fetch,
  port: 3000,
});
