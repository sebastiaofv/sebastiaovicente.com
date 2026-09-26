"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

const OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="8" cy="8" r="3.25" />
        <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13M12.95 12.95l-1.13-1.13M4.18 4.18L3.05 3.05" />
      </>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <>
        <rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.25" />
        <path d="M5.5 14h5" />
      </>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: <path d="M13.4 9.6A5.9 5.9 0 0 1 6.4 2.6a5.9 5.9 0 1 0 7 7Z" />,
  },
];

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  // Render "system" on the server so markup matches; correct after mount.
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") setTheme(stored);
    } catch {
      // Storage may be blocked. The native controls still work for this visit.
    }
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    apply(next);
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode — the choice still applies for this page view.
    }
  }

  return (
    <fieldset
      aria-label="Theme"
      className="fixed top-6 right-6 z-30 flex items-center gap-0.5 rounded-full border border-faint bg-bg/80 p-0.5 backdrop-blur-sm"
    >
      <legend className="sr-only">Theme</legend>
      {OPTIONS.map((option) => {
        const active = theme === option.value;

        return (
          <label
            key={option.value}
            title={option.label}
            className="relative cursor-pointer rounded-full"
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={active}
              aria-label={option.label}
              onChange={() => choose(option.value)}
              className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-fg ${active ? "bg-faint text-fg" : "text-muted hover:text-fg"}`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {option.icon}
            </svg>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
