import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarClock,
  ChefHat,
  Clock3,
  MapPin,
  Repeat2,
  ShoppingBag,
  Sparkles,
  Utensils,
  UsersRound
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { EmptyState } from "../../components/layout/EmptyState";
import { ErrorState } from "../../components/layout/ErrorState";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { getCustomerHome, listDeliveryOrders, listMenuItems, listReservations } from "../../lib/api";
import { statusLabels } from "../../lib/constants";
import { formatCurrency, formatDateTime } from "../../lib/formatters";
import { useAuthStore } from "../auth/store";
import { useCartStore } from "../delivery/cart-store";

const adminQuickActions = [
  { to: "/cardapio", label: "Gerenciar cardápio", icon: Utensils },
  { to: "/reservas", label: "Ver reservas", icon: CalendarClock },
  { to: "/delivery", label: "Ver pedidos", icon: ShoppingBag },
  { to: "/clientes", label: "Clientes", icon: UsersRound }
];

function formatAddress(address) {
  if (!address) {
    return "Adicione um endereço para agilizar seus pedidos.";
  }

  return `${address.street}, ${address.number} - ${address.neighborhood}`;
}

function getFirstName(name) {
  return name?.split(" ").filter(Boolean)[0] ?? "cliente";
}

function MenuImage({ item }) {
  if (item.imageUrl) {
    return <img alt={item.name} className="h-full w-full object-cover" loading="lazy" src={item.imageUrl} />;
  }

  return (
    <div className="grid h-full w-full place-items-center bg-muted">
      <ChefHat className="h-6 w-6 text-muted-foreground" />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="grid gap-5">
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <Badge className={status.isOpen ? "bg-emerald-600 text-white" : ""} variant={status.isOpen ? "default" : "muted"}>
      <Clock3 className="mr-1 h-3 w-3" />
      {status.currentLabel}
    </Badge>
  );
}

function ContinuityCard({ icon: Icon, title, description, actionLabel, to, children }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-4">
        {children}
        {to ? (
          <Button asChild className="justify-between" variant="outline">
            <Link to={to}>
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function CustomerHome() {
  const navigate = useNavigate();
  const customer = useAuthStore((state) => state.customer);
  const addItem = useCartStore((state) => state.addItem);
  const query = useQuery({
    queryKey: ["customer-home"],
    queryFn: getCustomerHome
  });

  if (query.isLoading) {
    return <HomeSkeleton />;
  }

  if (query.isError) {
    return <ErrorState onRetry={() => query.refetch()} />;
  }

  const home = query.data;
  const status = home.restaurantStatus;
  const featuredItems = home.featuredItems.length ? home.featuredItems : home.popularItems;
  const lastOrderItems = home.lastOrder?.items ?? [];
  const canRepeatOrder = lastOrderItems.length > 0;

  function repeatLastOrder() {
    lastOrderItems.forEach((item) => {
      if (item.menuItem) {
        addItem({
          menuItemId: item.menuItemId,
          name: item.menuItem.name,
          price: item.unitPrice,
          quantity: item.quantity
        });
      }
    });
    navigate("/delivery");
  }

  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <div className="grid content-center gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={status} />
              <Badge variant={status.deliveryAvailable ? "secondary" : "muted"}>Delivery {status.deliveryAvailable ? "disponível" : "indisponível"}</Badge>
            </div>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Bem-vindo</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Boa experiência, {getFirstName(customer?.name)}
              </h1>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Peça seus pratos favoritos, acompanhe o delivery ou reserve uma mesa em poucos passos.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild className="h-12 justify-between text-base" size="lg">
                <Link to="/delivery">
                  Pedir agora
                  <ShoppingBag className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild className="h-12 justify-between text-base" size="lg" variant="outline">
                <Link to="/reservas">
                  Reservar mesa
                  <CalendarClock className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 rounded-lg border bg-background/70 p-4">
            <div className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">Entregar em</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{formatAddress(home.defaultAddress)}</p>
              </div>
            </div>
            <div className="grid gap-2 rounded-md bg-muted/70 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Estimativa</span>
                <strong>
                  {status.deliveryEstimateMinutes.min}-{status.deliveryEstimateMinutes.max} min
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Reservas</span>
                <strong>{status.reservationsAvailable ? "Disponíveis" : "Fora do horário"}</strong>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/perfil">{home.defaultAddress ? "Alterar endereço" : "Adicionar endereço"}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ContinuityCard actionLabel="Acompanhar pedido" description="Continue de onde parou." icon={ShoppingBag} title="Pedido em andamento" to="/delivery">
          {home.activeOrder ? (
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{formatCurrency(home.activeOrder.totalAmount)}</span>
                <Badge variant="secondary">{statusLabels[home.activeOrder.status]}</Badge>
              </div>
              <p className="line-clamp-2 text-muted-foreground">{home.activeOrder.deliveryAddress}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum pedido em andamento agora.</p>
          )}
        </ContinuityCard>

        <ContinuityCard icon={Repeat2} title="Último pedido">
          {home.lastOrder ? (
            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium">{lastOrderItems[0]?.menuItem?.name ?? "Pedido recente"}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(home.lastOrder.createdAt)}</p>
              </div>
              <Button disabled={!canRepeatOrder} onClick={repeatLastOrder} type="button">
                Pedir novamente
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <p className="text-sm text-muted-foreground">Seu primeiro pedido pode começar pelo cardápio.</p>
              <Button asChild variant="outline">
                <Link to="/cardapio">Ver cardápio</Link>
              </Button>
            </div>
          )}
        </ContinuityCard>

        <ContinuityCard actionLabel="Ver reservas" description="Planeje sua próxima visita." icon={CalendarClock} title="Próxima reserva" to="/reservas">
          {home.nextReservation ? (
            <div className="grid gap-2 text-sm">
              <p className="font-medium">{formatDateTime(home.nextReservation.reservationDate)}</p>
              <p className="text-muted-foreground">Mesa para {home.nextReservation.peopleCount} pessoa(s)</p>
              <Badge className="w-fit" variant="secondary">
                {statusLabels[home.nextReservation.status]}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Você ainda não tem reserva futura.</p>
          )}
        </ContinuityCard>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Destaques</p>
            <h2 className="mt-2 text-2xl font-semibold">Sugestões para hoje</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/cardapio">Ver cardápio completo</Link>
          </Button>
        </div>

        {featuredItems.length === 0 ? (
          <EmptyState description="Assim que o cardápio for atualizado, os destaques aparecem aqui." title="Sem sugestões no momento" />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {featuredItems.slice(0, 3).map((item) => (
              <Card className="overflow-hidden" key={item.id}>
                <div className="aspect-[4/3] bg-muted">
                  <MenuImage item={item} />
                </div>
                <CardContent className="grid gap-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 font-semibold">{item.name}</h3>
                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">{item.description ?? "Prato disponível no cardápio."}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
                    <Button asChild size="sm">
                      <Link to="/delivery">Pedir</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Cardápio</p>
          <h2 className="mt-2 text-2xl font-semibold">Escolha por categoria</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {home.categories.map((category) => (
            <Button asChild className="h-auto min-h-20 justify-start rounded-lg bg-card p-4 text-left text-foreground shadow-sm" key={category.id} variant="outline">
              <Link to="/cardapio">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>
                  <span className="block font-semibold">{category.name}</span>
                  <span className="mt-1 line-clamp-1 block text-xs text-muted-foreground">{category.description ?? "Veja as opções disponíveis"}</span>
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}

function AdminHome() {
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
  const hasPanelError = menuQuery.isError || reservationsQuery.isError || ordersQuery.isError;

  function retryPanel() {
    menuQuery.refetch();
    reservationsQuery.refetch();
    ordersQuery.refetch();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Painel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Principal</h1>
        <p className="mt-2 text-muted-foreground">Resumo rápido da operação, pedidos e reservas.</p>
      </div>

      {hasPanelError ? <ErrorState onRetry={retryPanel} /> : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Itens disponíveis</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-semibold">{menuQuery.isError ? "-" : menuItems.length}</span>
            <Utensils className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas recentes</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-semibold">{reservationsQuery.isError ? "-" : reservations.length}</span>
            <CalendarClock className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos recentes</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-3xl font-semibold">{ordersQuery.isError ? "-" : orders.length}</span>
            <ShoppingBag className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminQuickActions.map((action) => {
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
    </div>
  );
}

export function HomePage() {
  const customer = useAuthStore((state) => state.customer);

  if (customer?.role === "ADMIN") {
    return <AdminHome />;
  }

  return <CustomerHome />;
}
