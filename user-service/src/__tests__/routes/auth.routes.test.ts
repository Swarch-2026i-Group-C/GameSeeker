import { describe, it, expect, vi, beforeEach } from "vitest";

// Break the module chain before vitest tries to resolve the generated Prisma client
// and better-auth internals that require a live DB connection.
vi.mock("../../lib/prisma.js", () => ({ default: {} }));
vi.mock("../../lib/better-auth.js", () => ({ auth: { api: {} } }));

// Mock the entire authService module so no real logic runs
vi.mock("../../services/auth.service.js", () => ({
  authService: {
    registerUser: vi.fn(),
    loginUser: vi.fn(),
    getSession: vi.fn(),
    signOut: vi.fn(),
  },
}));

import app from "../../app.js";
import { authService } from "../../services/auth.service.js";

const mockUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  emailVerified: false,
  image: null,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

const mockSessionData = {
  redirect: false,
  token: "session-token-abc",
  user: mockUser,
};

const mockSession = {
  user: mockUser,
  session: {
    id: "session-1",
    userId: "user-1",
    expiresAt: new Date("2025-01-01T00:00:00.000Z"),
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /auth/signup", () => {
  it("returns 201 with user data on success", async () => {
    vi.mocked(authService.registerUser).mockResolvedValue(mockUser);

    const res = await app.request("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.email).toBe("test@example.com");
    expect(body.data.createdAt).toBe("2024-01-01T00:00:00.000Z");
  });

  it("returns 400 when service throws", async () => {
    vi.mocked(authService.registerUser).mockRejectedValue(
      new Error("Email already in use"),
    );

    const res = await app.request("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "taken@example.com",
        password: "password123",
        name: "Test User",
      }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe("Email already in use");
  });
});

describe("POST /auth/login", () => {
  it("returns 200 with token and Set-Cookie header on success", async () => {
    vi.mocked(authService.loginUser).mockResolvedValue(mockSessionData);

    const res = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe("Logged in successfully");
    expect(body.data.token).toBe("session-token-abc");
    expect(res.headers.get("Set-Cookie")).toContain("session-token-abc");
  });

  it("returns 401 when service throws", async () => {
    vi.mocked(authService.loginUser).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    const res = await app.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe("Invalid credentials");
  });
});

describe("GET /auth/session", () => {
  it("returns 200 with session data on success", async () => {
    vi.mocked(authService.getSession).mockResolvedValue(mockSession);

    const res = await app.request("/auth/session", {
      method: "GET",
      headers: { Cookie: "better-auth.session_token=abc123" },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.user.id).toBe("user-1");
    expect(body.data.session.userId).toBe("user-1");
    expect(body.data.session.expiresAt).toBe("2025-01-01T00:00:00.000Z");
  });

  it("returns 401 when service throws No active session", async () => {
    vi.mocked(authService.getSession).mockRejectedValue(
      new Error("No active session"),
    );

    const res = await app.request("/auth/session", {
      method: "GET",
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe("No active session");
  });
});

describe("POST /auth/sign-out", () => {
  it("returns 200 on successful sign out", async () => {
    vi.mocked(authService.signOut).mockResolvedValue(undefined);

    const res = await app.request("/auth/sign-out", {
      method: "POST",
      headers: { Cookie: "better-auth.session_token=abc123" },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe("Signed out successfully");
  });
});
