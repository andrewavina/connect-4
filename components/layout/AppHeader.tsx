'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';

type Props = {
  logoSrc?: string; // default "/logo.png"
  title?: string; // default "Connect Four"
  rightSlot?: React.ReactNode; // e.g., auth/user menu later
};

export function AppHeader({
  logoSrc = '/logo.png',
  title = 'Connect Four',
  rightSlot,
}: Props) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt={`${title} logo`}
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span className="text-base font-semibold tracking-tight">
            {title}
          </span>
        </Link>

        {/* <Link href="/login">
          <button className="text-sm text-muted-foreground cursor-pointer">
            Log in
          </button>
        </Link> */}

        <div className="flex items-center gap-2">
          {rightSlot}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
