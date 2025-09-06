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
  w-full max-w-md rounded-2xl border border-border p-7 shadow-lg
  bg-card text-card-foreground backdrop-blur-sm
"
      >
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Connect Four
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to save games & track wins
          </p>
        </header>

        <form className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
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
  border border-border shadow-sm
  placeholder:text-muted-foreground
  focus:ring-2 focus:ring-ring
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
  border border-border shadow-sm
  placeholder:text-muted-foreground
  focus:ring-2 focus:ring-ring
"
            />
          </div>

          <div className="flex gap-3">
            <button
              formAction={login}
              className="
  inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium
  bg-primary text-primary-foreground hover:opacity-95
  focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60
"
            >
              Log in
            </button>

            <button
              formAction={signup}
              className="
  inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium
  bg-card text-card-foreground border border-border shadow-sm
  hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring
"
            >
              Sign up
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
