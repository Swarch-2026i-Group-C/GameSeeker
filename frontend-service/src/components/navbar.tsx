'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, LogIn, UserPlus, LogOut, Menu } from 'lucide-react';

import { getSession, logout, type Session } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Logo mark
// ---------------------------------------------------------------------------

function GameSeekerLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
        className,
      )}
    >
      {/* Simple SVG crosshair mark */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="transition-transform group-hover:rotate-45 duration-300"
      >
        <circle cx="14" cy="14" r="10" stroke="#00ff41" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="4" fill="#00ff41" />
        <line x1="14" y1="2" x2="14" y2="8" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="14" y1="20" x2="14" y2="26" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="14" x2="8" y2="14" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="14" x2="26" y2="14" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-headline font-bold text-lg text-on-surface tracking-tight">
        Game<span className="text-primary-container">Seeker</span>
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Search bar
// ---------------------------------------------------------------------------

interface SearchBarProps {
  className?: string;
  onSubmit?: () => void;
}

function SearchBar({ className, onSubmit }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onSubmit?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex items-center', className)}
    >
      <Search
        className="absolute left-3 h-4 w-4 text-on-surface-variant pointer-events-none"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder="Search games..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 w-full bg-surface-container-low"
        aria-label="Search games"
      />
    </form>
  );
}

// ---------------------------------------------------------------------------
// Auth section (right side of navbar)
// ---------------------------------------------------------------------------

interface AuthSectionProps {
  session: Session | null;
  onLogout: () => void;
}

function AuthSection({ session, onLogout }: AuthSectionProps) {
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/login" className="flex items-center gap-1.5">
            <LogIn className="h-4 w-4" />
            <span>Log in</span>
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href="/auth/signup" className="flex items-center gap-1.5">
            <UserPlus className="h-4 w-4" />
            <span>Sign up</span>
          </Link>
        </Button>
      </div>
    );
  }

  const initials = session.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <Button variant="tactical" size="sm" asChild>
        <Link href="/wishlist" className="flex items-center gap-1.5">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Wishlist</span>
        </Link>
      </Button>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 ring-2 ring-primary-container/30">
          {session.user.image && (
            <AvatarImage src={session.user.image} alt={session.user.name} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden md:block text-sm text-on-surface-variant truncate max-w-[120px]">
          {session.user.name}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onLogout}
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile nav drawer content
// ---------------------------------------------------------------------------

interface MobileNavProps {
  session: Session | null;
  onLogout: () => void;
  onSearch: () => void;
}

function MobileNavContent({ session, onLogout, onSearch }: MobileNavProps) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <SearchBar className="w-full" onSubmit={onSearch} />

      <nav className="flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface hover:bg-surface-container-high transition-colors"
        >
          Home
        </Link>
        {session && (
          <Link
            href="/wishlist"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <Heart className="h-4 w-4 text-primary-container" />
            Wishlist
          </Link>
        )}
      </nav>

      <div className="border-t border-outline-variant/20 pt-4">
        {session ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-3">
              <Avatar className="h-9 w-9 ring-2 ring-primary-container/30">
                {session.user.image && (
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                )}
                <AvatarFallback>
                  {session.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-on-surface">
                  {session.user.name}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {session.user.email}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button className="w-full" asChild>
              <Link href="/auth/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Navbar export
// ---------------------------------------------------------------------------

export function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getSession()
      .then(setSession)
      .catch(() => setSession(null));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      setSession(null);
      router.push('/');
      router.refresh();
    }
  }, [router]);

  return (
    <header className="sticky top-0 z-40 w-full glass ghost-border border-t-0 border-x-0">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <GameSeekerLogo className="shrink-0" />

        {/* Desktop search — centered, grows */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto">
          <SearchBar className="w-full" />
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 md:hidden" />

        {/* Desktop auth */}
        <div className="hidden md:flex items-center">
          <AuthSection session={session} onLogout={handleLogout} />
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>
                <GameSeekerLogo />
              </SheetTitle>
            </SheetHeader>
            <MobileNavContent
              session={session}
              onLogout={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              onSearch={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
