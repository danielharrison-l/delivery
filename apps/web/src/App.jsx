import { useEffect } from "react";
import { AppRoutes } from "./app/routes";
import { useAuthStore } from "./features/auth/store";
import { refreshSession } from "./lib/api";

export function App() {
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);

  useEffect(() => {
    let active = true;

    void refreshSession()
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setBootstrapped();
        }
      });

    return () => {
      active = false;
    };
  }, [setBootstrapped]);

  return <AppRoutes />;
}
