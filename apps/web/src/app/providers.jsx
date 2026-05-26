import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { applyTheme, useThemeStore } from "../features/theme/store";
import { queryClient } from "../lib/query-client";

export function Providers({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster richColors position="top-right" theme={theme} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
