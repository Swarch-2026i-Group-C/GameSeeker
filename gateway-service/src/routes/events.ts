import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { requireAuth } from "../middleware/auth.js";
import { priceUpdateBus, type PriceUpdate } from "../lib/rabbitmq.js";
import { env } from "../lib/env.js";

const events = new Hono();

/**
 * GET /api/events/stream
 *
 * Server-Sent Events endpoint. Streams price updates for games that are
 * in the authenticated user's wishlist.
 *
 * Flow:
 *   1. Validate session via requireAuth (sets userId in context).
 *   2. Fetch the user's wishlist to build a set of watched slugs.
 *   3. Subscribe to the in-process priceUpdateBus (fed by RabbitMQ consumer).
 *   4. Forward only events whose slug is in the watched set.
 *   5. Send a keepalive ping every 30 s to prevent proxy timeouts.
 */
events.get("/stream", requireAuth, async (c) => {
  // Build the set of slugs this user cares about
  const watchedSlugs = new Set<string>();
  try {
    const res = await fetch(`${env.USER_SERVICE_URL}/wishlist`, {
      headers: { cookie: c.req.header("cookie") ?? "" },
    });
    if (res.ok) {
      const wl = (await res.json()) as { games?: Array<{ slug: string }> };
      wl.games?.forEach((g) => watchedSlugs.add(g.slug));
    }
  } catch {
    // If we can't fetch the wishlist, stream proceeds with empty filter
    // (no events will match, which is safe)
  }

  return streamSSE(c, async (stream) => {
    const pending: PriceUpdate[] = [];
    let notifyNext: (() => void) | undefined;

    const listener = (update: PriceUpdate) => {
      if (watchedSlugs.has(update.slug)) {
        pending.push(update);
        notifyNext?.();
      }
    };

    priceUpdateBus.on("price_update", listener);

    /**
     * Returns a promise that resolves either when a new event arrives
     * (via notifyNext) or after `ms` milliseconds — whichever comes first.
     */
    const waitForEvent = (ms: number): Promise<void> =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, ms);
        notifyNext = () => {
          clearTimeout(timer);
          resolve();
          notifyNext = undefined;
        };
      });

    try {
      while (!c.req.raw.signal.aborted) {
        if (pending.length === 0) {
          await waitForEvent(30_000);
        }

        if (pending.length === 0) {
          // Timeout elapsed with no events — send keepalive ping
          await stream.writeSSE({ event: "ping", data: String(Date.now()) });
        } else {
          while (pending.length > 0) {
            await stream.writeSSE({
              event: "price_update",
              data: JSON.stringify(pending.shift()!),
            });
          }
        }
      }
    } finally {
      priceUpdateBus.off("price_update", listener);
    }
  });
});

export default events;
