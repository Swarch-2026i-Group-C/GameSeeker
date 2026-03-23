import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { authController } from "../controllers/auth.controller.js";
import {
  ErrorResponse,
  LoginSchema,
  LoginSuccess,
  SessionSuccess,
  SignOutSuccess,
  SignupSchema,
  SignupSuccess,
  ZodErrorSchema,
} from "../schemas/auth.schema.js";

const auth = new OpenAPIHono();

const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  tags: ["Auth"],
  summary: "Register a new user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignupSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created",
      content: {
        "application/json": {
          schema: SignupSuccess,
        },
      },
    },
    400: {
      description: "Validation error or user already exists",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
  },
});

auth.openapi(signupRoute, (c) => authController.signup(c));

const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary: "Login user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": {
          schema: LoginSuccess,
        },
      },
    },
    401: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ZodErrorSchema,
        },
      },
    },
  },
});

auth.openapi(loginRoute, (c) => authController.login(c));

const sessionRoute = createRoute({
  method: "get",
  path: "/session",
  tags: ["Auth"],
  summary: "Get current session",
  responses: {
    200: {
      description: "Active session",
      content: {
        "application/json": {
          schema: SessionSuccess,
        },
      },
    },
    401: {
      description: "No active session",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
  },
});

auth.openapi(sessionRoute, (c) => authController.session(c));

const signOutRoute = createRoute({
  method: "post",
  path: "/sign-out",
  tags: ["Auth"],
  summary: "Sign out current user",
  responses: {
    200: {
      description: "Signed out successfully",
      content: {
        "application/json": {
          schema: SignOutSuccess,
        },
      },
    },
    400: {
      description: "Sign out failed",
      content: {
        "application/json": {
          schema: ErrorResponse,
        },
      },
    },
  },
});

auth.openapi(signOutRoute, (c) => authController.signOut(c));

export default auth;
