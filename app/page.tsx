import Link from "next/link";

export default function Page() {
  return (
    <section className="relative overflow-hidden rounded-2xl border">
      {/* subtle backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(40rem_20rem_at_50%_-10%,rgba(99,102,241,0.20),transparent_60%)]" />
      <div className="relative z-10 px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Connect Four — sleek, fast, accessible.
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground md:text-base">
            A modern take built with Next.js, TypeScript, and Tailwind. Local
            2-player today; AI & online play coming soon.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/game"
              className="inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium transition hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Play Now
            </Link>
            <a
              href="https://github.com/andrewavina/connect-4"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring"
            >
              View Code
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>No signup required</span>
            <span aria-hidden="true">•</span>
            <span>Light/Dark — toggle in header</span>
          </div>
        </div>
      </div>
    </section>
  );
}
