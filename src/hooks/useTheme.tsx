"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  DEFAULT_THEME,
  THEME_MEDIA_QUERY,
  type Theme,
  readStoredTheme,
  writeStoredTheme,
} from "@/lib/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    const initialTheme = storedTheme ?? DEFAULT_THEME;

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    applyTheme(theme);
    writeStoredTheme(theme);
  }, [theme, isReady]);

  useEffect(() => {
    if (!isReady || theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);
    const handleChange = () => applyTheme("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, isReady]);

  return { theme, setTheme };
}
