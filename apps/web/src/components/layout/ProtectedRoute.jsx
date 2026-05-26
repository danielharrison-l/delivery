import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";
import { Skeleton } from "../ui/skeleton";

export function ProtectedRoute() {
  const location = useLocation();
  const customer = useAuthStore((state) => state.customer);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);

  if (!isBootstrapped) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="grid w-full max-w-sm gap-3">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
