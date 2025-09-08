'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { signOut } from '@/app/auth/actions';
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
  // const router = useRouter();
  // const [user, setUser] = useState<null | { id: string; email?: string }>(null);

  // useEffect(() => {
  //   const supabase = createClient();
  //   // initial fetch
  //   supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null));
  //   // subscribe to changes
  //   const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null);
  //   });
  //   return () => sub.subscription.unsubscribe();
  // }, []);

  // console.log('AppHeader - render: ', user);

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

        <div className="flex items-center gap-2">
          {rightSlot}
          {/* {user ? (
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut(); // scope: "global" by default
                router.push('/'); // or "/login"
                router.refresh(); // re-render RSC/middleware state
              }}
              className="rounded-full border px-3 py-1.5 text-sm hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Log in
            </Link>
          )} */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
