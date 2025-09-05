"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Theme = "system" | "light" | "dark";

const ICON_SIZE = 18;

export function ThemeToggle({
  className = "",
  cycle = ["system", "light", "dark"] as Theme[],
}: { className?: string; cycle?: Theme[] }) {
  const [stored, setStored] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  const mqlRef = useRef<MediaQueryList | null>(null);

  // Resolve the theme that should actually be applied to the DOM
  const resolvedTheme: Theme = useMemo(() => {
    if (stored === "system") {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return stored;
  }, [stored]);

  // Apply to <html data-theme="..."> and persist
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    localStorage.setItem("theme", stored);
  }, [resolvedTheme, stored]);

  // If on "system", update when the OS theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mqlRef.current) {
      mqlRef.current = window.matchMedia("(prefers-color-scheme: dark)");
    }
    const mql = mqlRef.current;
    const listener = () => {
      if (stored === "system") {
        const next = mql.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
      }
    };
    mql.addEventListener?.("change", listener);
    return () => mql.removeEventListener?.("change", listener);
  }, [stored]);

  const handleClick = () => {
    const idx = cycle.indexOf(stored);
    const next = cycle[(idx + 1) % cycle.length];
    setStored(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Theme: ${stored} (click to change)`}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition
                  hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    >
      <Icon theme={resolvedTheme} />
      <span className="capitalize">{stored}</span>
    </button>
  );
}

/* Simple inline icons — no deps */
function Icon({ theme }: { theme: "light" | "dark" | "system" }) {
  if (theme === "dark") return <Moon />;
  if (theme === "light") return <Sun />;
  return <System />;
}

function Sun() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 14.32l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 4V1h-0v3h0zm0 19v-3h0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zM19.16 6.76l1.42-1.42 1.8 1.79-1.41 1.41-1.81-1.78zM12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}

function Moon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3c.05 0 .1.02.14.05a.5.5 0 01.14.64A7 7 0 0020 13a7.08 7.08 0 01-.05.83.5.5 0 01-.64.41c-.1-.03-.2-.07-.31-.1z" />
    </svg>
  );
}

function System() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" role="img" aria-hidden="true">
      <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-6l2 3h4v2H6v-2h4l2-3H6a2 2 0 01-2-2V5zm2 0v9h12V5H6z" />
    </svg>
  );
}
