import type { Context } from "hono";
import { authService } from "../services/auth.service.js";

export const authController = {
  async signup(c: Context) {
    try {
      const body = await c.req.json();
      const newUser = await authService.registerUser(body);
      return c.json({ success: true, data: newUser }, 201);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "SignUp failed";
      return c.json({ success: false, message }, 400);
    }
  },

  async login(c: Context) {
    try {
      const body = await c.req.json();
      const sessionData = await authService.loginUser(body);

      return c.json(
        {
          success: true,
          message: "Logged in successfully",
          data: sessionData,
        },
        200,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      return c.json({ success: false, message }, 401);
    }
  },
};
