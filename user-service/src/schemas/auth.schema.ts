import { z } from "@hono/zod-openapi";

export const SignupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string(),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const LoginDataSchema = z.object({
  redirect: z.boolean(),
  token: z.string(),
  user: UserSchema,
});

export const SignupSuccess = z.object({
  success: z.literal(true),
  data: UserSchema,
});

export const LoginSuccess = z.object({
  success: z.literal(true),
  message: z.string(),
  data: LoginDataSchema,
});

export const ErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const ZodErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    name: z.literal("ZodError"),
    message: z.string(),
  }),
});
