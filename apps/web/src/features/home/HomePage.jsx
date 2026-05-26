import { useQuery } from "@tanstack/react-query";
import { CalendarClock, ChefHat, ShoppingBag, UserRound, UsersRound, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorState } from "../../components/layout/ErrorState";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { listDeliveryOrders, listMenuItems, listReservations } from "../../lib/api";
import { formatCurrency } from "../../lib/formatters";
import { useAuthStore } from "../auth/store";

const customerQuickActions = [
  { to: "/cardapio", label: "Ver cardápio", icon: Utensils },
  { to: "/reservas", label: "Nova reserva", icon: CalendarClock },
  { to: "/delivery", label: "Novo pedido", icon: ShoppingBag },
  { to: "/perfil", label: "Meu perfil", icon: UserRound }
];

const adminQuickActions = [
  { to: "/cardapio", label: "Gerenciar cardápio", icon: Utensils },
  { to: "/reservas", label: "Ver reservas", icon: CalendarClock },
  { to: "/delivery", label: "Ver pedidos", icon: ShoppingBag },
  { to: "/clientes", label: "Clientes", icon: UsersRound }
];

export function HomePage() {
  const customer = useAuthStore((state) => state.customer);
  const isAdmin = customer?.role === "ADMIN";
  const menuQuery = useQuery({ queryKey: ["menu-items", "dashboard"], queryFn: () => listMenuItems({ available: true }) });
  const reservationsQuery = useQuery({
    queryKey: ["reservations", "dashboard"],
    queryFn: () => listReservations({ page: 1, limit: 4 })
  });
  const ordersQuery = useQuery({
    queryKey: ["delivery-orders", "dashboard"],
    queryFn: () => listDeliveryOrders({ page: 1, limit: 4 })
  });

  const menuItems = menuQuery.data ?? [];
  const orders = ordersQuery.data?.data ?? [];
  const reservations = reservationsQuery.data?.data ?? [];
  const revenue = orders.reduce((total, order) => total + Number(order.totalAmount), 0);
  const quickActions = isAdmin ? adminQuickActions : customerQuickActions;
  const hasPanelError = menuQuery.isError || reservationsQuery.isError || ordersQuery.isError;

  function retryPanel() {
    menuQuery.refetch();
    reservationsQuery.refetch();
    ordersQuery.refetch();
  }

  return (
    <>
      <PageHeader
        description={isAdmin ? "Resumo rápido da operação, pedidos e reservas." : "Acesse o cardápio, faça pedidos e acompanhe suas reservas."}
        eyebrow="Painel"
        title="Principal"
      />

      {hasPanelError ? <ErrorState onRetry={retryPanel} /> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Itens disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-semibold">{menuQuery.isError ? "—" : menuItems.length}</span>
            <Utensils className="h-5 w-5 text-accent" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{isAdmin ? "Reservas recentes" : "Minhas reservas"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-semibold">{reservationsQuery.isError ? "—" : reservations.length}</span>
            <CalendarClock className="h-5 w-5 text-accent" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{isAdmin ? "Pedidos recentes" : "Meus pedidos"}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-semibold">{ordersQuery.isError ? "—" : orders.length}</span>
            <ShoppingBag className="h-5 w-5 text-accent" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total recente</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-semibold">{ordersQuery.isError ? "—" : formatCurrency(revenue)}</span>
            <ChefHat className="h-5 w-5 text-accent" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button asChild className="h-16 justify-start bg-card text-foreground shadow-sm hover:bg-muted" key={action.to} variant="outline">
              <Link to={action.to}>
                <Icon className="h-5 w-5 text-primary" />
                {action.label}
              </Link>
            </Button>
          );
        })}
      </section>
    </>
  );
}
