import { useQuery } from "@tanstack/react-query";
import { formatRestaurantOperatingSchedule } from "@repo/shared";
import { CalendarClock, ChefHat, Clock, MapPin, ShoppingBag, Sparkles, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { listMenuItems } from "../../lib/api";
import { formatCurrency } from "../../lib/formatters";
import { useAuthStore } from "../auth/store";

const highlights = [
  { label: "Reservas rápidas", icon: CalendarClock },
  { label: "Delivery próprio", icon: ShoppingBag },
  { label: "Cardápio atualizado", icon: Utensils }
];

export function LandingPage() {
  const customer = useAuthStore((state) => state.customer);
  const menuQuery = useQuery({
    queryKey: ["menu-items", "landing"],
    queryFn: () => listMenuItems({ available: true }),
    staleTime: 1000 * 60 * 5
  });
  const menuItems = (menuQuery.data ?? []).slice(0, 3);
  const panelLink = customer ? "/app" : "/login";

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex min-w-0 items-center gap-3" to="/">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="truncate text-sm font-semibold">Terraço Bistrô</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a className="hover:text-foreground" href="#cardapio">
              Cardápio
            </a>
            <a className="hover:text-foreground" href="#experiencia">
              Experiência
            </a>
            <a className="hover:text-foreground" href="#localizacao">
              Localização
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild className="hidden sm:inline-flex" variant="ghost">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to={panelLink}>{customer ? "Ir para o painel" : "Reservar"}</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b bg-foreground text-background">
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-2xl">
            <Badge className="bg-background text-foreground hover:bg-background" variant="secondary">
              Cozinha autoral e delivery
            </Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">Terraço Bistrô</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-background/75 sm:text-lg">
              Um restaurante urbano para reservar mesa, consultar o cardápio e pedir seus pratos favoritos em poucos minutos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={panelLink}>Fazer reserva</Link>
              </Button>
              <Button asChild className="border-background/30 text-background hover:bg-background/10" size="lg" variant="outline">
                <a href="#cardapio">Ver cardápio</a>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="flex items-center gap-3 rounded-lg border border-background/15 bg-background/5 px-3 py-3" key={item.label}>
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-background/80">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-background/15 bg-background/8 p-4 shadow-soft backdrop-blur" id="cardapio">
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-md bg-background p-4 text-foreground">
                <div>
                  <p className="text-sm font-semibold">Hoje no Terraço</p>
                  <p className="mt-1 text-xs text-muted-foreground">Destaques do cardápio</p>
                </div>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <Card className="border-background/20 bg-background text-foreground" key={item.id}>
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{item.description ?? "Prato da casa"}</p>
                      </div>
                      <span className="shrink-0 font-semibold text-primary">{formatCurrency(item.price)}</span>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-background/20 bg-background text-foreground">
                  <CardContent className="grid gap-2 p-4">
                    <p className="font-medium">Cardápio em atualização</p>
                    <p className="text-sm text-muted-foreground">Entre no painel para conferir os itens disponíveis.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8" id="experiencia">
        <Card>
          <CardContent className="grid gap-3 p-6">
            <CalendarClock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Reserva organizada</h2>
            <p className="text-sm leading-6 text-muted-foreground">Escolha data, horário e quantidade de pessoas pelo painel.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-3 p-6">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Delivery direto</h2>
            <p className="text-sm leading-6 text-muted-foreground">Monte o carrinho com os itens disponíveis e acompanhe o pedido.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-3 p-6">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Atendimento ágil</h2>
            <p className="text-sm leading-6 text-muted-foreground">O painel centraliza os dados para facilitar a operação do restaurante.</p>
          </CardContent>
        </Card>
      </section>

      <section className="border-t bg-card" id="localizacao">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Localização</p>
            <h2 className="mt-2 text-2xl font-semibold">Rua das Flores, 120</h2>
            <p className="mt-2 text-sm text-muted-foreground">{formatRestaurantOperatingSchedule()}</p>
          </div>
          <Button asChild variant="outline">
            <Link to={panelLink}>
              <MapPin className="h-4 w-4" />
              Planejar visita
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
