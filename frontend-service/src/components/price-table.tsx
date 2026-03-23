import React from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle2, XCircle, TrendingDown } from 'lucide-react';

import { type StorePriceSummary } from '@/lib/api';
import { cn, formatPrice, storeLabel, discountPercent } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PriceTableProps {
  stores: StorePriceSummary[];
  /** Highlight the row for this store key as the best deal */
  bestStore?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Store icon placeholder (coloured initial badge)
// ---------------------------------------------------------------------------

function StoreIcon({ store }: { store: string }) {
  const palette: Record<string, { bg: string; text: string }> = {
    steam: { bg: '#1b2838', text: '#c7d5e0' },
    epic: { bg: '#2a2a2a', text: '#ffffff' },
    gog: { bg: '#3d1a6e', text: '#c98eed' },
    microsoft: { bg: '#0a3d0a', text: '#5fba5f' },
  };

  const key = store.toLowerCase();
  const colors = palette[key] ?? { bg: '#282a2d', text: '#b9ccb2' };

  return (
    <span
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold font-headline"
      style={{ backgroundColor: colors.bg, color: colors.text }}
      aria-hidden="true"
    >
      {store.slice(0, 2).toUpperCase()}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Individual row
// ---------------------------------------------------------------------------

interface PriceRowProps {
  entry: StorePriceSummary;
  isBest: boolean;
  rank: number;
}

function PriceRow({ entry, isBest, rank }: PriceRowProps) {
  const discount =
    entry.originalPrice != null && entry.price != null
      ? discountPercent(entry.originalPrice, entry.price)
      : null;

  return (
    <tr
      className={cn(
        'group transition-colors duration-150',
        isBest
          ? 'bg-primary-container/5 hover:bg-primary-container/10'
          : 'hover:bg-surface-container-high',
      )}
    >
      {/* Rank */}
      <td className="w-10 pl-4 py-3 text-center">
        <span
          className={cn(
            'inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold font-headline',
            rank === 1
              ? 'bg-primary-container text-primary-on-container'
              : 'bg-surface-container-high text-on-surface-variant',
          )}
        >
          {rank}
        </span>
      </td>

      {/* Store */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <StoreIcon store={entry.store} />
          <div className="flex flex-col">
            <span className="text-sm font-medium font-headline text-on-surface">
              {storeLabel(entry.store)}
            </span>
            {isBest && (
              <span className="text-[10px] text-primary-fixed-dim font-semibold">
                Best price
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Availability */}
      <td className="py-3 pr-4 hidden sm:table-cell">
        {entry.inStock ? (
          <div className="flex items-center gap-1 text-primary-fixed-dim">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="text-xs">Available</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-error">
            <XCircle className="h-3.5 w-3.5" />
            <span className="text-xs">Unavailable</span>
          </div>
        )}
      </td>

      {/* Original price */}
      <td className="py-3 pr-4 text-right hidden md:table-cell">
        {entry.originalPrice != null && entry.originalPrice !== entry.price ? (
          <span className="text-sm text-on-surface-variant line-through">
            {formatPrice(entry.originalPrice, entry.currency)}
          </span>
        ) : (
          <span className="text-on-surface-variant/30">—</span>
        )}
      </td>

      {/* Discount badge */}
      <td className="py-3 pr-4 text-right hidden sm:table-cell">
        {discount != null && discount > 0 ? (
          <Badge variant="success" className="gap-0.5">
            <TrendingDown className="h-2.5 w-2.5" />
            -{discount}%
          </Badge>
        ) : (
          <span className="text-on-surface-variant/30 text-xs">—</span>
        )}
      </td>

      {/* Current price */}
      <td className="py-3 pr-4 text-right">
        <span
          className={cn(
            'font-headline font-semibold text-base',
            isBest ? 'text-primary-fixed-dim' : 'text-on-surface',
          )}
        >
          {entry.price != null
            ? formatPrice(entry.price, entry.currency)
            : 'N/A'}
        </span>
      </td>

      {/* CTA */}
      <td className="py-3 pr-4 text-right">
        {entry.inStock && entry.url ? (
          <Button
            variant={isBest ? 'default' : 'tactical'}
            size="sm"
            asChild
            className={cn(isBest && 'animate-pulse-glow')}
          >
            <Link
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              Buy
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled>
            Unavailable
          </Button>
        )}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function PriceTable({ stores, bestStore, className }: PriceTableProps) {
  // Sort: in-stock first, then by price ascending
  const sorted = [...stores].sort((a, b) => {
    if (a.inStock && !b.inStock) return -1;
    if (!a.inStock && b.inStock) return 1;
    const pa = a.price ?? Infinity;
    const pb = b.price ?? Infinity;
    return pa - pb;
  });

  // Determine best programmatically if not supplied
  const computedBest =
    bestStore ??
    sorted.find((s) => s.inStock && s.price != null)?.store;

  if (stores.length === 0) {
    return (
      <div className={cn('rounded-xl bg-surface-container ghost-border p-8 text-center', className)}>
        <p className="text-on-surface-variant text-sm">
          No price data available for this title yet.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl bg-surface-container ghost-border overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 bg-surface-container-high flex items-center justify-between">
        <h2 className="font-headline font-semibold text-on-surface text-sm tracking-wide uppercase">
          Price Comparison
        </h2>
        <span className="text-xs text-on-surface-variant">
          {stores.filter((s) => s.inStock).length} of {stores.length} stores available
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="w-10 pl-4 py-2 text-left" aria-label="Rank" />
              <th className="py-2 pr-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Store
              </th>
              <th className="py-2 pr-4 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">
                Status
              </th>
              <th className="py-2 pr-4 text-right text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">
                Original
              </th>
              <th className="py-2 pr-4 text-right text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">
                Sale
              </th>
              <th className="py-2 pr-4 text-right text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Price
              </th>
              <th className="py-2 pr-4 text-right text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {sorted.map((entry, idx) => (
              <PriceRow
                key={entry.store}
                entry={entry}
                isBest={entry.store === computedBest}
                rank={idx + 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="px-4 py-2.5 bg-surface-container-lowest">
        <p className="text-[10px] text-on-surface-variant/60">
          Prices are scraped in real-time and may differ at checkout. Always verify on the store page.
        </p>
      </div>
    </div>
  );
}
