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

## 🧪 Testing the Engine

The game logic is pure and easy to test. Example test ideas:

`applyMove` drops to the lowest open row

`checkWin` detects horizontal / vertical / diagonal

Draw detection when board is full

### Why not use an LLM for the computer player?

This project uses a classic game-AI approach—[`lib/game/engine.ts`](lib/game/engine.ts) + [`lib/game/ai.ts`](lib/game/ai.ts) with alpha-beta minimax—rather than calling OpenAI/Claude to pick moves. That’s intentional:

- **Correct tool for the job**: Connect Four is deterministic, perfect-information, and small enough to solve well with search. A rules-based engine evaluates positions precisely; an LLM can “hallucinate” illegal or weak moves unless heavily constrained.
- **Latency & UX**: Search runs locally in a few milliseconds; no network round-trips. The UI stays responsive and moves feel instant.
- **Cost & reliability**: No API costs, quotas, or external outages. Works offline and in CI.
- **Determinism & testability**: Pure functions are easy to unit test (e.g., win detection, applyMove). Same input → same output.
- **Strength that scales**: We can raise difficulty by depth, heuristics, and (later) transposition tables/iterative deepening without changing the UI.

**When an LLM _would_ make sense here:** explaining a move (“why the AI chose column 3”), generating coaching tips, or picking among the top N engine moves for variety—always with validation and a fast local fallback.

## 🧭 Roadmap

⏳ Saved W/L/T history per user (Supabase + RLS)

⏳ Realtime PvP across devices (Supabase Realtime)

⏳ Replay viewer (step through moves)

## 🖼️ Screens / GIF

- TODO - (Add a short GIF of gameplay here — ghost preview → drop → win confetti.)

## 🛠️ Deploy

Deployed on Vercel (one-click from GitHub). Environment variables are only required when enabling Supabase auth/history.

---

License

MIT © Andrew Avina
