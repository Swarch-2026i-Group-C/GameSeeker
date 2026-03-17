import { Hono } from "hono";
import { authController } from "../controllers/auth.controller.js";

const auth = new Hono();

auth.post("/signup", (c) => authController.signup(c));
auth.post("/login", (c) => authController.login(c));

export default auth;
