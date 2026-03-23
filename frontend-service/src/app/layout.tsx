import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/navbar';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    default: 'GameSeeker — Find the Best Game Prices',
    template: '%s | GameSeeker',
  },
  description:
    'Compare game prices across Steam, Epic Games, GOG, and Xbox in real-time. Track your wishlist and never overpay.',
  keywords: [
    'game price comparison',
    'steam deals',
    'epic games sale',
    'gog prices',
    'xbox game deals',
    'cheapest games',
    'game wishlist',
  ],
  authors: [{ name: 'GameSeeker' }],
  creator: 'GameSeeker',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gameseeker.app',
    siteName: 'GameSeeker',
    title: 'GameSeeker — Find the Best Game Prices',
    description:
      'Compare game prices across Steam, Epic Games, GOG, and Xbox in real-time.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameSeeker — Find the Best Game Prices',
    description: 'Compare game prices across Steam, Epic, GOG, and Xbox.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#111316',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

// ---------------------------------------------------------------------------
// Root layout
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn('dark', inter.variable, spaceGrotesk.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-on-surface antialiased">
        {/* Subtle tactical grid overlay on the entire app */}
        <div
          className="pointer-events-none fixed inset-0 tactical-grid opacity-100 z-0"
          aria-hidden="true"
        />

        {/* Content layer sits above grid */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <footer className="mt-auto border-t border-outline-variant/10 py-6">
            <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-on-surface-variant">
                &copy; {new Date().getFullYear()} GameSeeker. Prices scraped in
                real-time — verify at checkout.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-on-surface-variant/40 font-mono">
                  SIGNAL INTELLIGENCE v0.1.0
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
