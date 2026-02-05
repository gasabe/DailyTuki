import { useState, useEffect, useCallback } from "react";
import { storage } from "../services/storage";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return storage.get(storage.KEYS.THEME) ?? "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    storage.set(storage.KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}
