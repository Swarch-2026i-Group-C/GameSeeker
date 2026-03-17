import { auth } from "../lib/better-auth.js";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async registerUser(data: RegisterInput) {
    const { email, password, name } = data;

    if (!email || !password || !name) {
      throw new Error("Missing required fields");
    }

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

  async loginUser(data: LoginInput) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

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
};
