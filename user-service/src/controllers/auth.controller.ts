import type { Context } from "hono";
import { authService } from "../services/auth.service.js";


export const authController = {
  async signup(c: Context) {
    try {
      const body = await c.req.json();
      const newUser = await authService.registerUser(body);
      return c.json(
        {
          success: true,
          data: {
            ...newUser,
            image: newUser.image ?? null,
            createdAt: newUser.createdAt.toISOString(),
            updatedAt: newUser.updatedAt.toISOString(),
          },
        },
        201,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "SignUp failed";
      return c.json({ success: false, message }, 400);
    }
  },

  async login(c: Context) {
    try {
      const body = await c.req.json();
      const sessionData = await authService.loginUser(body);

      // Set session cookie so browser-based clients can authenticate
      c.header(
        "Set-Cookie",
        `better-auth.session_token=${sessionData.token}; Path=/; HttpOnly; SameSite=Lax`,
      );

      return c.json(
        {
          success: true,
          message: "Logged in successfully",
          data: {
            ...sessionData,
            user: {
              ...sessionData.user,
              image: sessionData.user.image ?? null,
              createdAt: sessionData.user.createdAt.toISOString(),
              updatedAt: sessionData.user.updatedAt.toISOString(),
            },
          },
        },
        200,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      return c.json({ success: false, message }, 401);
    }
  },

  async session(c: Context) {
    try {
      const sessionData = await authService.getSession(
        new Headers(c.req.raw.headers),
      );
      return c.json(
        {
          success: true,
          data: {
            user: {
              ...sessionData.user,
              image: sessionData.user.image ?? null,
              createdAt: sessionData.user.createdAt.toISOString(),
              updatedAt: sessionData.user.updatedAt.toISOString(),
            },
            session: {
              id: sessionData.session.id,
              userId: sessionData.session.userId,
              expiresAt: sessionData.session.expiresAt.toISOString(),
            },
          },
        },
        200,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "No active session";
      return c.json({ success: false, message }, 401);
    }
  },

  async signOut(c: Context) {
    try {
      await authService.signOut(new Headers(c.req.raw.headers));
      return c.json({ success: true, message: "Signed out successfully" }, 200);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Sign out failed";
      return c.json({ success: false, message }, 400);
    }
  },
};
