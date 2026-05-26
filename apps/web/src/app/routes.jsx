import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute } from "../components/layout/AdminRoute";
import { AppErrorBoundary } from "../components/layout/AppErrorBoundary";
import { AppShell } from "../components/layout/AppShell";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { Skeleton } from "../components/ui/skeleton";

const LoginPage = lazy(() => import("../features/auth/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("../features/auth/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const CustomersPage = lazy(() => import("../features/customers/CustomersPage").then((module) => ({ default: module.CustomersPage })));
const DeliveryPage = lazy(() => import("../features/delivery/DeliveryPage").then((module) => ({ default: module.DeliveryPage })));
const HomePage = lazy(() => import("../features/home/HomePage").then((module) => ({ default: module.HomePage })));
const LandingPage = lazy(() => import("../features/landing/LandingPage").then((module) => ({ default: module.LandingPage })));
const MenuPage = lazy(() => import("../features/menu/MenuPage").then((module) => ({ default: module.MenuPage })));
const ProfilePage = lazy(() => import("../features/profile/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const ReservationsPage = lazy(() =>
  import("../features/reservations/ReservationsPage").then((module) => ({ default: module.ReservationsPage }))
);

function RouteFallback() {
  return (
    <div className="grid min-h-80 gap-4">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <AppErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/cadastro" />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route element={<HomePage />} path="app" />
              <Route element={<MenuPage />} path="cardapio" />
              <Route element={<DeliveryPage />} path="delivery" />
              <Route element={<ReservationsPage />} path="reservas" />
              <Route element={<ProfilePage />} path="perfil" />
              <Route element={<AdminRoute />}>
                <Route element={<CustomersPage />} path="clientes" />
              </Route>
            </Route>
          </Route>
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  );
}
