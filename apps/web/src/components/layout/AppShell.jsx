import { ChefHat, ClipboardList, Home, LogOut, Menu, ShoppingBag, UserRound, UsersRound, Utensils } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../features/auth/store";
import { logout } from "../../lib/api";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";

const baseNavigationItems = [
  { to: "/app", label: "Principal", icon: Home },
  { to: "/cardapio", label: "Cardápio", icon: Utensils },
  { to: "/delivery", label: "Delivery", icon: ShoppingBag },
  { to: "/reservas", label: "Reservas", icon: ClipboardList },
  { to: "/perfil", label: "Perfil", icon: UserRound }
];

const adminNavigationItems = [{ to: "/clientes", label: "Clientes", icon: UsersRound }];

function NavigationLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        [
          "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        ].join(" ")
      }
      onClick={onNavigate}
      to={item.to}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );
}

export function AppShell() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const customer = useAuthStore((state) => state.customer);
  const navigationItems = customer?.role === "ADMIN" ? [...baseNavigationItems, ...adminNavigationItems] : baseNavigationItems;

  async function handleLogout() {
    await logout();
    toast.success("Sessão encerrada");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card px-4 py-5 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Terraço Bistrô</p>
          </div>
        </div>

        <nav className="mt-8 grid gap-1">
          {navigationItems.map((item) => (
            <NavigationLink item={item} key={item.to} />
          ))}
        </nav>

        <div className="mt-auto grid gap-4">
          <Separator />
          <div className="px-2">
            <p className="truncate text-sm font-medium">{customer?.name ?? "Visitante"}</p>
            <p className="truncate text-xs text-muted-foreground">{customer?.email ?? "Sem sessão"}</p>
          </div>
          <Button className="justify-start" onClick={handleLogout} type="button" variant="outline">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-2">
            <ChefHat className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate text-sm font-semibold">Terraço Bistrô</span>
          </div>
          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogTrigger asChild>
              <Button aria-label="Abrir menu" size="icon" type="button" variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="top-4 w-[calc(100%-1.5rem)] translate-y-0 gap-5 sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Menu</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="rounded-lg border bg-background p-3">
                  <p className="truncate text-sm font-medium">{customer?.name ?? "Visitante"}</p>
                  <p className="truncate text-xs text-muted-foreground">{customer?.email ?? "Sem sessão"}</p>
                </div>
                <nav className="grid gap-1">
                  {navigationItems.map((item) => (
                    <NavigationLink item={item} key={item.to} onNavigate={() => setMobileMenuOpen(false)} />
                  ))}
                </nav>
                <Button className="justify-start" onClick={handleLogout} type="button" variant="outline">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:gap-8 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
