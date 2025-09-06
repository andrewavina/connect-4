// app/login/page.tsx
import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <main
      className="
        min-h-[calc(100vh-4rem)]
        flex items-center justify-center px-4
        bg-background text-foreground
      "
    >
      <div
        className="
          w-full max-w-md rounded-2xl border p-7 shadow-lg
          bg-white dark:bg-neutral-900/90
          border-[color:var(--border)]
          backdrop-blur-sm
        text-white
        "
      >
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Connect Four
          </h1>
          <p className="mt-1 text-sm text-white">
            Sign in to save games & track wins
          </p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="
                block w-full rounded-xl px-3 py-2 text-[15px] outline-none transition
                bg-background text-foreground
                border border-[color:var(--border)] shadow-sm
                placeholder:text-muted-foreground
                focus:ring-4 focus:ring-[color:var(--ring)]
                dark:bg-neutral-900
              "
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="
                block w-full rounded-xl px-3 py-2 text-[15px] outline-none transition
                bg-background text-foreground
                border border-[color:var(--border)] shadow-sm
                placeholder:text-muted-foreground
                focus:ring-4 focus:ring-[color:var(--ring)]
                dark:bg-neutral-900
              "
            />
          </div>

          <div className="flex gap-3">
            <button
              formAction={login}
              className="
                inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white
                bg-indigo-600 hover:bg-indigo-500
                focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]
                disabled:opacity-60
              "
            >
              Log in
            </button>

            <button
              formAction={signup}
              className="
                inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium
                bg-background text-foreground
                border border-[color:var(--border)] shadow-sm
                hover:bg-[color:var(--muted)]
                focus:outline-none focus:ring-4 focus:ring-[color:var(--ring)]
                dark:hover:bg-neutral-800
              "
            >
              Sign up
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[color:var(--border)]" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
