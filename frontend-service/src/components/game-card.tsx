import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, TrendingDown } from 'lucide-react';

import { type GameSummary } from '@/lib/api';
import { cn, formatPrice, toSlug, discountPercent } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GameCardProps {
  game: GameSummary;
  /** Render as a Next.js Link to the game detail page (default: true) */
  linkable?: boolean;
  className?: string;
  /** Layout variant */
  variant?: 'grid' | 'list';
}

// ---------------------------------------------------------------------------
// Store logo abbreviation badge
// ---------------------------------------------------------------------------

function StoreBadge({ store }: { store: string }) {
  const colors: Record<string, string> = {
    steam: 'bg-[#1b2838] text-[#c7d5e0]',
    epic: 'bg-[#2a2a2a] text-white',
    gog: 'bg-[#7b2fbe]/20 text-[#b95fe1]',
    microsoft: 'bg-[#107c10]/20 text-[#5fba5f]',
  };

  const labels: Record<string, string> = {
    steam: 'Steam',
    epic: 'Epic',
    gog: 'GOG',
    microsoft: 'Xbox',
  };

  const key = store.toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold font-headline',
        colors[key] ?? 'bg-surface-container-high text-on-surface-variant',
      )}
    >
      {labels[key] ?? store}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Price section
// ---------------------------------------------------------------------------

interface PriceSectionProps {
  game: GameSummary;
}

function PriceSection({ game }: PriceSectionProps) {
  const cheapest = game.stores.reduce<(typeof game.stores)[0] | null>(
    (acc, s) => {
      if (s.price == null) return acc;
      if (acc == null || s.price < (acc.price ?? Infinity)) return s;
      return acc;
    },
    null,
  );

  if (!cheapest) {
    return (
      <span className="text-sm text-on-surface-variant">No price data</span>
    );
  }

  const discount =
    cheapest.originalPrice != null
      ? discountPercent(cheapest.originalPrice, cheapest.price ?? 0)
      : null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-headline font-semibold text-primary-fixed-dim text-base">
        {formatPrice(cheapest.price, cheapest.currency)}
      </span>

      {cheapest.originalPrice != null && cheapest.originalPrice !== cheapest.price && (
        <span className="text-xs text-on-surface-variant line-through">
          {formatPrice(cheapest.originalPrice, cheapest.currency)}
        </span>
      )}

      {discount != null && discount > 0 && (
        <Badge variant="success" className="flex items-center gap-0.5 text-[10px]">
          <TrendingDown className="h-2.5 w-2.5" />
          -{discount}%
        </Badge>
      )}

      <StoreBadge store={cheapest.store} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grid variant
// ---------------------------------------------------------------------------

function GameCardGrid({ game, linkable = true, className }: Omit<GameCardProps, 'variant'>) {
  const slug = game.slug ?? toSlug(game.name);
  const storeCount = game.stores.filter((s) => s.price != null).length;

  const inner = (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl',
        'bg-surface-container ghost-border',
        'transition-all duration-200 hover:bg-surface-container-high hover:shadow-glow-primary',
        className,
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
        {game.coverImage ? (
          <Image
            src={game.coverImage}
            alt={`${game.name} cover`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
            <span className="font-headline text-3xl font-bold text-on-surface-variant/30 select-none">
              {game.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Store count overlay */}
        {storeCount > 0 && (
          <div className="absolute bottom-2 right-2 glass rounded px-1.5 py-0.5">
            <span className="text-[10px] font-semibold text-on-surface-variant">
              {storeCount} {storeCount === 1 ? 'store' : 'stores'}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3">
        <h3 className="font-headline text-sm font-semibold text-on-surface line-clamp-2 leading-snug">
          {game.name}
        </h3>
        <PriceSection game={game} />
      </div>
    </div>
  );

  if (!linkable) return inner;

  return (
    <Link href={`/game/${slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
      {inner}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// List variant
// ---------------------------------------------------------------------------

function GameCardList({ game, linkable = true, className }: Omit<GameCardProps, 'variant'>) {
  const slug = game.slug ?? toSlug(game.name);

  const inner = (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-xl p-3',
        'bg-surface-container ghost-border',
        'transition-all duration-150 hover:bg-surface-container-high',
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-surface-container-low">
        {game.coverImage ? (
          <Image
            src={game.coverImage}
            alt={`${game.name} cover`}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-headline text-lg font-bold text-on-surface-variant/30">
              {game.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-headline text-sm font-semibold text-on-surface truncate">
          {game.name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {game.stores.slice(0, 3).map((s) => (
            <StoreBadge key={s.store} store={s.store} />
          ))}
          {game.stores.length > 3 && (
            <span className="text-[10px] text-on-surface-variant">
              +{game.stores.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right">
        <PriceSection game={game} />
      </div>

      {/* Arrow hint */}
      <ExternalLink className="h-4 w-4 shrink-0 text-on-surface-variant/40 group-hover:text-primary-container transition-colors" />
    </div>
  );

  if (!linkable) return inner;

  return (
    <Link href={`/game/${slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl block">
      {inner}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Public export — switches on variant prop
// ---------------------------------------------------------------------------

export function GameCard({ variant = 'grid', ...props }: GameCardProps) {
  if (variant === 'list') return <GameCardList {...props} />;
  return <GameCardGrid {...props} />;
}
