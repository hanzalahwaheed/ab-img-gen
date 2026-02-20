export type Theme = "light" | "dark" | "system";

export const DEFAULT_THEME: Theme = "system";
export const THEME_STORAGE_KEY = "ab-img-gen:theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const VALID_THEMES = new Set<Theme>(["light", "dark", "system"]);

function isTheme(value: string | null): value is Theme {
  return value !== null && VALID_THEMES.has(value as Theme);
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
  }

  return theme;
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const resolvedTheme = resolveTheme(theme);

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
  root.dataset.theme = theme;
}

export function readStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

export function writeStoredTheme(theme: Theme): void {
  try {
    if (theme === DEFAULT_THEME) {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors (private mode, disabled storage, quota).
  }
}

export const themeInitializationScript = `
(() => {
  const storageKey = "${THEME_STORAGE_KEY}";
  const mediaQuery = "${THEME_MEDIA_QUERY}";
  const root = document.documentElement;
  const validThemes = new Set(["light", "dark", "system"]);

  let theme = "${DEFAULT_THEME}";

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme && validThemes.has(storedTheme)) {
      theme = storedTheme;
    }
  } catch {}

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia(mediaQuery).matches
        ? "dark"
        : "light"
      : theme;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
  root.dataset.theme = theme;
})();
`;
