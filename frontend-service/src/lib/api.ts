/**
 * GameSeeker API client
 *
 * Thin typed fetch wrapper around the API gateway.
 * Base URL is read from NEXT_PUBLIC_GATEWAY_URL at build/runtime.
 * All requests include credentials so session cookies are forwarded.
 */

// Server-side (SSR/RSC): use internal Docker hostname via GATEWAY_URL.
// Client-side (browser): GATEWAY_URL is undefined, fall back to NEXT_PUBLIC_GATEWAY_URL.
const BASE_URL =
  process.env.GATEWAY_URL ??
  process.env.NEXT_PUBLIC_GATEWAY_URL ??
  'http://localhost:8080';

// ---------------------------------------------------------------------------
// Raw scrapper response types (as returned by scrapper-service)
// ---------------------------------------------------------------------------

interface ScrapperResult {
  name: string;
  store: string;
  price_cents: number;
  original_price_cents: number;
  currency: string;
  url: string;
}

interface ScrapperSearchResponse {
  game: string;
  results: ScrapperResult[];
}

interface ScrapperCompareResponse {
  game: string;
  prices: ScrapperResult[];
  cheapest: ScrapperResult;
}

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

function normalizeStore(raw: ScrapperResult): StorePriceSummary {
  return {
    store: raw.store,
    price: raw.price_cents / 100,
    originalPrice: raw.original_price_cents / 100,
    currency: raw.currency,
    url: raw.url,
    inStock: true,
  };
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GameSummary {
  name: string;
  slug: string;
  coverImage?: string;
  /** Lowest price found across all stores */
  lowestPrice?: number;
  currency?: string;
  stores: StorePriceSummary[];
}

export interface StorePriceSummary {
  store: string;
  price: number | null;
  originalPrice?: number | null;
  currency: string;
  url: string;
  inStock: boolean;
}

export interface GameDetails extends GameSummary {
  description?: string;
  releaseDate?: string;
  genres?: string[];
  developer?: string;
  publisher?: string;
}

export interface TrendingGame {
  name: string;
  slug: string;
  coverImage?: string;
  price?: number;
  currency?: string;
  store: string;
  url: string;
}

export interface WishlistGame {
  id: string;
  name: string;
  slug: string;
  coverImage?: string;
  storeUrl: string;
  store: string;
  priceAtAdd?: number;
  currency?: string;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  games: WishlistGame[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Session {
  user: AuthUser;
  expiresAt: string;
}


export interface ApiError {
  message: string;
  status: number;
}

// ---------------------------------------------------------------------------
// Internal fetch helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error: ApiError = {
      message:
        (errorBody as { message?: string }).message ??
        `HTTP ${response.status}`,
      status: response.status,
    };
    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Scrapper / game data endpoints
// ---------------------------------------------------------------------------

/**
 * Search games by name across all stores.
 * Maps to: GET /api/v1/games/search?name=<name>
 */
export async function searchGames(name: string): Promise<GameSummary[]> {
  const params = new URLSearchParams({ name });
  const raw = await apiFetch<ScrapperSearchResponse>(`/api/games/search?${params}`);
  const stores = raw.results.map(normalizeStore);
  const lowest = stores.reduce<StorePriceSummary | undefined>(
    (min, s) => (s.price != null && (min == null || s.price < (min.price ?? Infinity)) ? s : min),
    undefined,
  );
  return [
    {
      name: raw.results[0]?.name ?? raw.game,
      slug: nameToSlug(raw.game),
      lowestPrice: lowest?.price ?? undefined,
      currency: lowest?.currency,
      stores,
    },
  ];
}

/**
 * Compare prices for a specific game across all stores.
 * Maps to: GET /api/v1/games/compare?name=<name>
 */
export async function compareGame(name: string): Promise<GameDetails> {
  const params = new URLSearchParams({ name });
  const raw = await apiFetch<ScrapperCompareResponse>(`/api/games/compare?${params}`);
  const stores = raw.prices.map(normalizeStore);
  const lowest = normalizeStore(raw.cheapest);
  return {
    name: raw.prices[0]?.name ?? raw.game,
    slug: nameToSlug(raw.game),
    lowestPrice: lowest.price ?? undefined,
    currency: lowest.currency,
    stores,
  };
}

/**
 * Get trending games from a specific store.
 * Maps to: GET /api/v1/games/trending/<store>
 * @param store - 'steam' | 'epic' | 'gog' | 'microsoft'
 */
export async function getTrending(store: string): Promise<TrendingGame[]> {
  return apiFetch<TrendingGame[]>(`/api/games/trending/${store}`);
}

// ---------------------------------------------------------------------------
// Auth endpoints (user-service via gateway)
// ---------------------------------------------------------------------------

/**
 * Sign in with email and password.
 * Maps to: POST /api/auth/sign-in/email
 */
export async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; session: Session }> {
  return apiFetch<{ user: AuthUser; session: Session }>(
    '/api/auth/sign-in/email',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
}

/**
 * Register a new account.
 * Maps to: POST /api/auth/sign-up/email
 */
export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<{ user: AuthUser; session: Session }> {
  return apiFetch<{ user: AuthUser; session: Session }>(
    '/api/auth/sign-up/email',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    },
  );
}

/**
 * Sign out the current session.
 * Maps to: POST /api/auth/sign-out
 */
export async function logout(): Promise<void> {
  return apiFetch<void>('/api/auth/sign-out', { method: 'POST' });
}

/**
 * Retrieve the current authenticated session.
 * Returns null when unauthenticated instead of throwing.
 * Maps to: GET /api/auth/get-session
 */
export async function getSession(): Promise<Session | null> {
  try {
    return await apiFetch<Session>('/api/auth/get-session');
  } catch (err) {
    const apiErr = err as ApiError;
    if (apiErr.status === 401 || apiErr.status === 403) return null;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Wishlist endpoints (user-service via gateway)
// ---------------------------------------------------------------------------

/**
 * Fetch the authenticated user's wishlist.
 * Maps to: GET /api/wishlist
 */
export async function getWishlist(): Promise<Wishlist> {
  return apiFetch<Wishlist>('/api/wishlist');
}

/**
 * Add a game to the wishlist.
 * Maps to: POST /api/wishlist/games
 */
export async function addToWishlist(gameData: {
  name: string;
  slug: string;
  coverImage?: string;
  storeUrl: string;
  store: string;
  priceAtAdd?: number;
  currency?: string;
}): Promise<WishlistGame> {
  return apiFetch<WishlistGame>('/api/wishlist/games', {
    method: 'POST',
    body: JSON.stringify(gameData),
  });
}

/**
 * Remove a game from the wishlist by its ID.
 * Maps to: DELETE /api/wishlist/games/<gameId>
 */
export async function removeFromWishlist(gameId: string): Promise<void> {
  return apiFetch<void>(`/api/wishlist/games/${gameId}`, {
    method: 'DELETE',
  });
}
