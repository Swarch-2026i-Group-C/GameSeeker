/**
 * Landing page — server component.
 *
 * Sections:
 *   1. Hero with search bar
 *   2. Trending games carousel per store
 *   3. Feature pitch (signal intelligence)
 *
 * TODO: Replace placeholder data with real API calls once gateway is running.
 *       Call getTrending('steam'), getTrending('epic'), getTrending('gog')
 *       in parallel and pass results to the sections below.
 */

import React from 'react';
import Link from 'next/link';
import { Search, Zap, TrendingUp, Shield } from 'lucide-react';

import { GameCard } from '@/components/game-card';
import { type GameSummary } from '@/lib/api';

// ---------------------------------------------------------------------------
// Placeholder data — remove once API is wired
// ---------------------------------------------------------------------------

const PLACEHOLDER_GAMES: GameSummary[] = [
  {
    name: 'Elden Ring',
    slug: 'elden-ring',
    coverImage: undefined,
    stores: [
      { store: 'steam', price: 39.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
      { store: 'epic', price: 44.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
    ],
  },
  {
    name: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    coverImage: undefined,
    stores: [
      { store: 'gog', price: 29.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
      { store: 'steam', price: 35.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
    ],
  },
  {
    name: 'Baldur\'s Gate 3',
    slug: 'baldurs-gate-3',
    coverImage: undefined,
    stores: [
      { store: 'steam', price: 59.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
      { store: 'gog', price: 59.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
    ],
  },
  {
    name: 'Halo Infinite',
    slug: 'halo-infinite',
    coverImage: undefined,
    stores: [
      { store: 'microsoft', price: 0, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
      { store: 'steam', price: 39.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
    ],
  },
  {
    name: 'Alan Wake 2',
    slug: 'alan-wake-2',
    coverImage: undefined,
    stores: [
      { store: 'epic', price: 49.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
    ],
  },
  {
    name: 'Dead Space Remake',
    slug: 'dead-space-remake',
    coverImage: undefined,
    stores: [
      { store: 'steam', price: 34.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
      { store: 'epic', price: 39.99, originalPrice: 59.99, currency: 'USD', url: '#', inStock: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* Radial glow behind hero */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full opacity-10"
        style={{
          background:
            'radial-gradient(ellipse at center, #00ff41 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-container/25 bg-primary-container/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-container animate-pulse" />
          <span className="text-xs font-semibold font-headline text-primary-fixed-dim tracking-wider uppercase">
            Signal Intelligence Active
          </span>
        </div>

        <h1 className="font-headline text-4xl font-bold text-on-surface sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
          Hunt the Best
          <br />
          <span className="text-primary-container">Game Prices.</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base text-on-surface-variant sm:text-lg mb-10">
          Real-time price intelligence across Steam, Epic Games, GOG, and Xbox.
          Add to your wishlist, track deals, and never overpay.
        </p>

        {/* Search form — client interactivity handled by form submit */}
        <form
          action="/search"
          method="GET"
          className="mx-auto flex max-w-xl items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              placeholder="Search for a game..."
              className="w-full h-12 rounded-xl bg-surface-container pl-12 pr-4 text-base text-on-surface placeholder:text-on-surface-variant/50 border border-outline-variant/20 focus:border-primary-container/60 focus:outline-none focus:ring-2 focus:ring-primary-container/30 transition-all"
              aria-label="Search for a game"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-6 rounded-xl bg-primary-container text-primary-on-container font-headline font-semibold text-sm shadow-glow-primary hover:shadow-glow-primary-lg hover:bg-primary-fixed-dim transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Search
          </button>
        </form>

        {/* Quick store links */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <span className="text-xs text-on-surface-variant">Scan:</span>
          {['steam', 'epic', 'gog', 'microsoft'].map((store) => (
            <Link
              key={store}
              href={`/search?q=&store=${store}`}
              className="text-xs text-on-surface-variant hover:text-primary-fixed-dim transition-colors capitalize border border-outline-variant/20 hover:border-primary-container/30 rounded px-2 py-1"
            >
              {store === 'microsoft' ? 'Xbox' : store.charAt(0).toUpperCase() + store.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Trending section
// ---------------------------------------------------------------------------

interface TrendingSectionProps {
  title: string;
  games: GameSummary[];
}

function TrendingSection({ title, games }: TrendingSectionProps) {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-container" aria-hidden="true" />
            <h2 className="font-headline text-xl font-semibold text-on-surface">
              {title}
            </h2>
          </div>
          <Link
            href="/search?q="
            className="text-xs text-primary-fixed-dim hover:text-primary-container transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* TODO: Replace PLACEHOLDER_GAMES with data from getTrending(store) */}
          {games.map((game) => (
            <GameCard key={game.slug} game={game} variant="grid" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Feature cards
// ---------------------------------------------------------------------------

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Zap className="h-6 w-6 text-primary-container" />,
    title: 'Real-Time Scraping',
    description:
      'Prices are scraped live from store pages — no stale data, no missed deals.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-secondary-container" />,
    title: 'Price History',
    description:
      'Track how prices move over time and set alerts for when your target price is hit.',
  },
  {
    icon: <Shield className="h-6 w-6 text-tertiary-container" />,
    title: 'Wishlist Protection',
    description:
      'Save games to your wishlist and get notified when they drop to their lowest price.',
  },
];

function FeaturesSection() {
  return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="font-headline text-2xl font-bold text-on-surface text-center mb-10">
          Why GameSeeker?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="rounded-xl bg-surface-container ghost-border p-6 flex flex-col gap-3 hover:bg-surface-container-high transition-colors duration-150"
            >
              <div className="h-11 w-11 rounded-xl bg-surface-container-high flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="font-headline font-semibold text-on-surface">
                {feat.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page export (server component)
// ---------------------------------------------------------------------------

export default async function HomePage() {
  /**
   * TODO: Fetch real trending data from the API gateway:
   *
   * import { getTrending } from '@/lib/api';
   *
   * const [steamTrending, epicTrending] = await Promise.allSettled([
   *   getTrending('steam'),
   *   getTrending('epic'),
   * ]);
   *
   * const steamGames = steamTrending.status === 'fulfilled' ? steamTrending.value : [];
   * const epicGames  = epicTrending.status === 'fulfilled'  ? epicTrending.value  : [];
   *
   * Then map TrendingGame[] to GameSummary[] shape for <GameCard>.
   */

  // Using placeholder data split across two trending sections
  const steamGames = PLACEHOLDER_GAMES.slice(0, 6);

  return (
    <>
      <HeroSection />

      {/* Divider line — tonal, no border per design rules */}
      <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />

      <TrendingSection title="Trending on Steam" games={steamGames} />

      <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent" />

      <FeaturesSection />
    </>
  );
}
