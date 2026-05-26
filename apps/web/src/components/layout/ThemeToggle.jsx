import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../features/theme/store";
import { Button } from "../ui/button";

export function ThemeToggle({ className, variant = "ghost" }) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <Button aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"} className={className} onClick={toggleTheme} size="icon" type="button" variant={variant}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
