import type { z } from "zod";
import { auth } from "../lib/better-auth.js";
import { LoginSchema, SignupSchema } from "../schemas/auth.schema.js";

type RegisterInput = z.infer<typeof SignupSchema>;
type LoginInput = z.infer<typeof LoginSchema>;

export const authService = {
  async registerUser(data: unknown) {
    const { email, password, name }: RegisterInput = SignupSchema.parse(data);

    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!response?.user) {
      throw new Error("User registration failed");
    }

    return response.user;
  },

  async loginUser(data: unknown) {
    const { email, password }: LoginInput = LoginSchema.parse(data);

    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    if (!response) {
      throw new Error("Invalid credentials");
    }

    return response;
  },

  async getSession(headers: Headers) {
    const response = await auth.api.getSession({
      headers,
    });

    if (!response) {
      throw new Error("No active session");
    }

    return response;
  },

  async signOut(headers: Headers) {
    await auth.api.signOut({
      headers,
    });
  },
};
