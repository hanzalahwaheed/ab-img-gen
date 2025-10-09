"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-1 shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md transition-all ${
          theme === "light"
            ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }`}
        title="Light mode"
        type="button"
      >
        <Sun size={18} />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md transition-all ${
          theme === "system"
            ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }`}
        title="System preference"
        type="button"
      >
        <Monitor size={18} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md transition-all ${
          theme === "dark"
            ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        }`}
        title="Dark mode"
        type="button"
      >
        <Moon size={18} />
      </button>
    </div>
  );
}
