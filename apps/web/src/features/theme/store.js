import { create } from "zustand";

const storageKey = "terraco-theme";
const themes = ["light", "dark"];

function isTheme(value) {
  return themes.includes(value);
}

function getStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    if (!isTheme(theme)) {
      return;
    }

    applyTheme(theme);

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
    }

    set({ theme });
  },
  toggleTheme: () => {
    get().setTheme(get().theme === "dark" ? "light" : "dark");
  }
}));

applyTheme(getInitialTheme());
