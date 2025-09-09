# Connect Four

A clean, modern Connect Four you can play in the browser — built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.  
It features **local 2-player**, **Human vs Computer** (alpha-beta minimax), **light/dark theme**, **ghost previews**, **drop animations**, and a **win celebration**.

- **Live Demo:** https://connect-4-ashen.vercel.app/
- **Source:** https://github.com/andrewavina/connect-4

---

## ✨ Features

- **Modes:** Local (same device) and **vs Computer** with Easy / Medium / Hard
- **AI:** Alpha-beta minimax with center bias + pattern heuristics
- **Polish:** Ghost preview of landing spot, chip drop animation, win glow + confetti
- **Design:** Sleek, responsive board that auto-fits laptop screens; light/dark theme toggle
- **Accessibility:** Keyboard focus highlight on columns; semantic grid roles and labels
- **Architecture:** Pure game engine separated from UI for testability and reuse

---

## 🧱 Tech Stack

- **Next.js 15** (App Router) • **TypeScript** • **Tailwind CSS**
- (Planned) **Supabase** for auth + game history (temporarily disabled in production)

---

## 🗂️ Project Structure

- app/
  -- game/page.tsx # UI (board, controls, animations)
  -- layout.tsx # App shell
  -- page.tsx # Landing page
- components/
  -- layout/AppHeader.tsx # Header with theme toggle (+ login/signout when enabled)
- ui/theme-toggle.tsx
- lib/
  -- game/engine.ts # Pure board + move logic (no UI state)
  -- game/ai.ts # Minimax + alpha-beta and heuristic scoring
- public/
  -- logo.png # Favicon / logo

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Supabase auth is wired but currently disabled in production. You can re-enable it later by removing the temporary redirect on `/login` and adjusting middleware/protected routes.

🧪 Testing the Engine

The game logic is pure and easy to test. Example test ideas:

`applyMove` drops to the lowest open row

`checkWin` detects horizontal / vertical / diagonal

Draw detection when board is full

🧭 Roadmap

✅ Human vs Computer (alpha-beta minimax)

✅ Ghost previews, drop animation, win celebration

⏳ Saved W/L/T history per user (Supabase + RLS)

⏳ Realtime PvP across devices (Supabase Realtime)

⏳ Replay viewer (step through moves)

🖼️ Screens / GIF

(Add a short GIF of gameplay here — ghost preview → drop → win confetti.)

🛠️ Deploy

Deployed on Vercel (one-click from GitHub). Environment variables are only required when enabling Supabase auth/history.

License

MIT © Andrew Avina

If you want, I can also generate a crisp **Open Graph image** (OG) for pretty link previews and add a couple of **engine unit tests** to kickstart the `/__tests__` folder.
