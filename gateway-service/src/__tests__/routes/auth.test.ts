import { describe, it, expect, vi, afterEach } from "vitest";

// Prevent RabbitMQ / amqplib from being imported and attempting a connection
vi.mock("../../lib/rabbitmq.js", () => ({
  startConsumer: vi.fn().mockResolvedValue(undefined),
  priceUpdateBus: { on: vi.fn(), emit: vi.fn(), setMaxListeners: vi.fn() },
}));

import app from "../../index.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockUpstreamOk(body: unknown = { success: true }): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
}

describe("Auth proxy routes", () => {
  it("POST /api/auth/sign-up/email proxies to /auth/signup", async () => {
    mockUpstreamOk({ success: true, data: { id: "user-1" } });

    const res = await app.request("/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      }),
    });

    expect(res.status).toBe(200);
    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("/auth/signup");
  });

  it("POST /api/auth/sign-in/email proxies to /auth/login", async () => {
    mockUpstreamOk({ success: true, token: "abc" });

    const res = await app.request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    expect(res.status).toBe(200);
    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("/auth/login");
  });

  it("POST /api/auth/sign-out proxies to /auth/sign-out", async () => {
    mockUpstreamOk({ success: true, message: "Signed out" });

    const res = await app.request("/api/auth/sign-out", {
      method: "POST",
    });

    expect(res.status).toBe(200);
    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("/auth/sign-out");
  });

  it("GET /api/auth/session proxies to /auth/session via wildcard", async () => {
    mockUpstreamOk({ success: true, data: { user: { id: "user-1" } } });

    const res = await app.request("/api/auth/session", {
      method: "GET",
      headers: { Cookie: "better-auth.session_token=abc" },
    });

    expect(res.status).toBe(200);
    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const calledUrl = fetchMock.mock.calls[0]?.[0] as string;
    expect(calledUrl).toContain("/auth/session");
  });
});
