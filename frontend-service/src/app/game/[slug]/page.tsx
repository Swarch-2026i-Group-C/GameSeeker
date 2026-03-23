/**
 * Game detail page — server component.
 *
 * Fetches compareGame(slug) to get full price comparison data.
 * The add-to-wishlist button is a client island within this server page.
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Heart,
  ExternalLink,
  ChevronRight,
  Tag,
  Building2,
} from 'lucide-react';

import { compareGame, type GameDetails } from '@/lib/api';
import { PriceTable } from '@/components/price-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { AddToWishlistButton } from './add-to-wishlist-button';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ');
  return {
    title: name.charAt(0).toUpperCase() + name.slice(1),
    description: `Compare prices for ${name} on Steam, Epic Games, GOG, and Xbox. Find the cheapest deal.`,
  };
}

// ---------------------------------------------------------------------------
// Placeholder game — used when API is not yet available
// ---------------------------------------------------------------------------

function buildPlaceholderGame(slug: string): GameDetails {
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    name,
    slug,
    description:
      'TODO: Fetch real game description from the API. This placeholder text is shown when the scrapper service is not reachable.',
    releaseDate: '2024-01-01',
    genres: ['Action', 'RPG'],
    developer: 'Unknown Studio',
    publisher: 'Unknown Publisher',
    stores: [
      {
        store: 'steam',
        price: 39.99,
        originalPrice: 59.99,
        currency: 'USD',
        url: '#',
        inStock: true,
      },
      {
        store: 'epic',
        price: 44.99,
        originalPrice: 59.99,
        currency: 'USD',
        url: '#',
        inStock: true,
      },
      {
        store: 'gog',
        price: 34.99,
        originalPrice: 59.99,
        currency: 'USD',
        url: '#',
        inStock: false,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

function Breadcrumb({ gameName }: { gameName: string }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-on-surface-variant mb-6">
      <Link href="/" className="hover:text-primary-fixed-dim transition-colors">
        Home
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      <Link href="/search?q=" className="hover:text-primary-fixed-dim transition-colors">
        Games
      </Link>
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      <span className="text-on-surface truncate max-w-[200px]">{gameName}</span>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Game header
// ---------------------------------------------------------------------------

interface GameHeaderProps {
  game: GameDetails;
}

function GameHeader({ game }: GameHeaderProps) {
  const lowestStore = [...game.stores]
    .filter((s) => s.inStock && s.price != null)
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))[0];

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
      {/* Cover art */}
      <div className="relative shrink-0 w-full md:w-48 lg:w-56 aspect-[3/4] md:aspect-auto md:h-64 lg:h-72 rounded-xl overflow-hidden bg-surface-container-low ghost-border">
        {game.coverImage ? (
          <Image
            src={game.coverImage}
            alt={`${game.name} cover art`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 224px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-headline text-5xl font-bold text-on-surface-variant/20 select-none">
              {game.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-3">
        <h1 className="font-headline text-3xl font-bold text-on-surface leading-tight">
          {game.name}
        </h1>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          {game.genres?.map((g) => (
            <Badge key={g} variant="outline">{g}</Badge>
          ))}
          {game.releaseDate && (
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <Clock className="h-3 w-3" />
              {new Date(game.releaseDate).getFullYear()}
            </div>
          )}
        </div>

        {/* Developer / publisher */}
        {(game.developer ?? game.publisher) && (
          <div className="flex flex-wrap gap-4">
            {game.developer && (
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <Building2 className="h-3.5 w-3.5" />
                <span>
                  <span className="text-on-surface-variant/60">Dev: </span>
                  {game.developer}
                </span>
              </div>
            )}
            {game.publisher && (
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <Tag className="h-3.5 w-3.5" />
                <span>
                  <span className="text-on-surface-variant/60">Pub: </span>
                  {game.publisher}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {game.description && (
          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
            {game.description}
          </p>
        )}

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
          {lowestStore && (
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant">Best price</span>
              <span className="font-headline text-2xl font-bold text-primary-fixed-dim">
                {formatPrice(lowestStore.price, lowestStore.currency)}
              </span>
            </div>
          )}

          {lowestStore && (
            <Button size="lg" asChild className="glow-primary">
              <Link
                href={lowestStore.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Buy Now
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* Add to wishlist — client island */}
          <AddToWishlistButton game={game} />

          <Button variant="tactical" size="lg" asChild>
            <Link href={`/game/${game.slug}/history`} className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Price History
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton (used in Suspense boundaries if needed)
// ---------------------------------------------------------------------------

function GameDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
      <Skeleton className="w-full md:w-48 h-64 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  let game: GameDetails;

  try {
    /**
     * TODO: The scrapper service exposes /api/v1/games/compare?name=<name>.
     * The slug here is URL-encoded, e.g. "elden-ring".
     * Convert it back to a human title before calling compareGame().
     *
     * Example:
     *   const title = slug.replace(/-/g, ' ');
     *   game = await compareGame(title);
     */
    const title = slug.replace(/-/g, ' ');
    game = await compareGame(title);
  } catch {
    // Gateway or scrapper not reachable — show placeholder with correct name
    game = buildPlaceholderGame(slug);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb gameName={game.name} />

      <GameHeader game={game} />

      {/* Price comparison table */}
      <section aria-labelledby="price-comparison-heading">
        <h2
          id="price-comparison-heading"
          className="sr-only"
        >
          Price Comparison
        </h2>
        <PriceTable stores={game.stores} />
      </section>

      {/* History nudge */}
      <div className="mt-6 rounded-xl bg-surface-container ghost-border p-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-medium text-on-surface">
            Want to see how prices change over time?
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Check the full price history and set a target price alert.
          </p>
        </div>
        <Button variant="tactical" asChild>
          <Link href={`/game/${slug}/history`}>
            View Price History
          </Link>
        </Button>
      </div>
    </div>
  );
}
