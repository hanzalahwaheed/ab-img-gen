"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const THEMES = [
  { id: "light", label: "Light mode", icon: Sun },
  { id: "system", label: "System preference", icon: Monitor },
  { id: "dark", label: "Dark mode", icon: Moon },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-1 shadow-sm">
      {THEMES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`p-2 rounded-md transition-all ${
            theme === id
              ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
          title={label}
          type="button"
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}
