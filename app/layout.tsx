import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { AppHeader } from '@/components/layout/AppHeader';
import { Providers } from './providers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Connect Four',
  description:
    'A polished Connect Four built with Next.js 15, Tailwind, and TypeScript.',
  other: { 'color-scheme': 'light dark' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-dvh`}
      >
        <Providers>
          <AppHeader />
          <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            Built with Next.js, Tailwind & TS
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
