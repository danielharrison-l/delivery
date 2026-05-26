import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";

export function AdminRoute() {
  const customer = useAuthStore((state) => state.customer);

  if (customer?.role !== "ADMIN") {
    return <Navigate replace to="/app" />;
  }

  return <Outlet />;
}
