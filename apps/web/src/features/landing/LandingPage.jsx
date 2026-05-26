import { formatRestaurantOperatingSchedule } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import { AtSign, CalendarCheck, CalendarDays, ChefHat, Clock3, Globe2, Share2, ShoppingBag, Star, Truck, Utensils } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../../components/layout/ThemeToggle";
import { Button } from "../../components/ui/button";
import { listMenuItems } from "../../lib/api";
import { formatCurrency } from "../../lib/formatters";
import { useAuthStore } from "../auth/store";

const landingImages = {
  hero:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80",
  plate:
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80"
};

const featuredMenuItemNames = ["Costela Urbana", "Pappardelle Bosco", "Salmão Glacé"];

const heroCards = [
  {
    title: "Mesa",
    description: "Reserve em poucos passos",
    icon: Utensils
  },
  {
    title: "Pedido",
    description: "Acompanhe o delivery",
    icon: Truck
  },
  {
    title: "Horários",
    description: "Escolha o melhor momento",
    icon: Clock3
  }
];

const serviceItems = [
  {
    title: "Reserva",
    description: "Escolha data, horário e quantidade de pessoas em poucos passos.",
    icon: CalendarCheck
  },
  {
    title: "Delivery",
    description: "Consulte o cardápio, monte seu pedido e acompanhe a entrega.",
    icon: ShoppingBag
  }
];

const footerLinks = [
  {
    title: "Explorar",
    links: ["Cardápio", "Reservas", "Pedidos", "Conta"]
  },
  {
    title: "Informações",
    links: ["Sobre", "Atendimento", "Contato", "Privacidade"]
  }
];

const navItems = [
  {
    id: "cardapio",
    label: "CARDÁPIO",
    targetId: "cardapio"
  },
  {
    id: "reservas",
    label: "RESERVAS",
    targetId: "reservas"
  },
  {
    id: "delivery",
    label: "DELIVERY",
    targetId: "delivery"
  }
];

const activeSectionOrder = ["reservas", "delivery", "cardapio"];

function getNavLinkClass(isActive) {
  return [
    "border-b-2 pb-1 text-sm font-bold uppercase tracking-[0.05em] transition-colors",
    isActive
      ? "border-[hsl(var(--landing-primary))] text-[hsl(var(--landing-primary))]"
      : "border-transparent text-[hsl(var(--landing-muted))] hover:border-[hsl(var(--landing-primary))]/60 hover:text-[hsl(var(--landing-primary))]"
  ].join(" ");
}

function getFeaturedMenuItems(items) {
  const itemByName = new Map(items.filter((item) => item.imageUrl).map((item) => [item.name, item]));
  const preferredItems = featuredMenuItemNames.map((name) => itemByName.get(name)).filter(Boolean);

  if (preferredItems.length >= 3) {
    return preferredItems.slice(0, 3);
  }

  const remainingItems = items.filter((item) => item.imageUrl && !featuredMenuItemNames.includes(item.name));
  return [...preferredItems, ...remainingItems].slice(0, 3);
}

export function LandingPage() {
  const customer = useAuthStore((state) => state.customer);
  const accountLink = customer ? "/app" : "/login";
  const [activeSection, setActiveSection] = useState("");
  const suppressScrollActiveUntilRef = useRef(0);
  const menuQuery = useQuery({
    queryKey: ["landing-menu-items"],
    queryFn: () => listMenuItems({ available: true }),
    staleTime: 1000 * 60 * 10
  });
  const chefSuggestions = getFeaturedMenuItems(menuQuery.data ?? []);

  useEffect(() => {
    function updateActiveSection() {
      if (Date.now() < suppressScrollActiveUntilRef.current) {
        return;
      }

      const marker = window.scrollY + 140;

      if (window.scrollY < window.innerHeight * 0.45) {
        setActiveSection("");
        return;
      }

      const currentSection = activeSectionOrder.reduce((current, sectionId) => {
        const element = document.getElementById(sectionId);

        if (!element) {
          return current;
        }

        const top = element.getBoundingClientRect().top + window.scrollY;
        return top <= marker ? sectionId : current;
      }, "");

      setActiveSection(currentSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  function handleNavClick(event, item) {
    event.preventDefault();
    const target = document.getElementById(item.targetId);

    if (!target) {
      return;
    }

    setActiveSection(item.id);
    suppressScrollActiveUntilRef.current = Date.now() + 1200;
    window.history.pushState(null, "", `#${item.id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[hsl(var(--landing-background))] font-[Manrope] text-[hsl(var(--landing-foreground))] selection:bg-[hsl(var(--landing-primary))] selection:text-[hsl(var(--landing-primary-foreground))]">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[hsl(var(--landing-border))]/80 bg-[hsl(var(--landing-background))]/95 shadow-sm backdrop-blur md:h-20">
        <nav className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-5 py-4 md:px-16">
          <Link className="flex min-w-0 items-center gap-3 overflow-hidden" to="/">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[hsl(var(--landing-primary))] text-[hsl(var(--landing-primary-foreground))]">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="truncate font-['Libre_Caslon_Text'] text-base font-bold text-[hsl(var(--landing-foreground))] md:text-xl">Terraço Bistrô</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a className={getNavLinkClass(activeSection === item.id)} href={`#${item.id}`} key={item.id} onClick={(event) => handleNavClick(event, item)}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ThemeToggle className="text-[hsl(var(--landing-muted))] hover:bg-[hsl(var(--landing-surface))] hover:text-[hsl(var(--landing-primary))]" />
            <Button asChild className="hidden bg-transparent text-[hsl(var(--landing-muted))] hover:bg-[hsl(var(--landing-surface))] hover:text-[hsl(var(--landing-primary))] sm:inline-flex" variant="ghost">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="h-9 rounded-lg bg-[hsl(var(--landing-primary))] px-4 text-sm font-bold text-[hsl(var(--landing-primary-foreground))] shadow-md hover:bg-[hsl(var(--landing-primary))]/90 md:h-10 md:px-6">
              <Link to={accountLink}>Reservar</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative flex min-h-screen items-center overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img alt="Interior sofisticado do Terraço Bistrô com iluminação quente e ambiente urbano" className="h-full w-full object-cover" src={landingImages.hero} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--landing-overlay-start)/1)_18%,hsl(var(--landing-overlay-middle)/0.84)_48%,hsl(var(--landing-overlay-end)/0.28)_100%)]" />
          <div className="absolute inset-0 bg-[hsl(var(--landing-background))]/20 md:bg-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 md:px-16 md:py-16">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[hsl(var(--landing-primary))]">Cozinha urbana</span>
            <h1 className="mb-6 max-w-full break-words font-['Libre_Caslon_Text'] text-[36px] font-bold leading-[44px] text-[hsl(var(--landing-foreground))] sm:text-6xl sm:leading-tight md:text-7xl">
              Terraço Bistrô
            </h1>
            <p className="mb-10 max-w-xl break-words text-base leading-8 text-[hsl(var(--landing-muted))] md:text-lg">
              Uma experiência completa para reservar mesa, consultar o cardápio e pedir delivery com praticidade e sofisticação.
            </p>

            <div className="mb-12 flex flex-wrap gap-4 md:mb-16">
              <Button asChild className="h-12 rounded-lg bg-[hsl(var(--landing-primary))] px-8 font-bold text-[hsl(var(--landing-primary-foreground))] hover:bg-[hsl(var(--landing-primary))]/90">
                <Link to={accountLink}>
                  Fazer reserva
                  <CalendarDays className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="h-12 rounded-lg border-[hsl(var(--landing-border))] bg-transparent px-8 font-bold text-[hsl(var(--landing-foreground))] hover:bg-[hsl(var(--landing-surface))] hover:text-[hsl(var(--landing-foreground))]" variant="outline">
                <Link to="/cardapio">Ver cardápio</Link>
              </Button>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              {heroCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    className="group relative min-w-0 overflow-hidden rounded-xl border border-[hsl(var(--landing-border))]/70 bg-[hsl(var(--landing-surface))]/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.20)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--landing-primary))]/45 hover:bg-[hsl(var(--landing-surface-strong))]/85 md:p-6"
                    key={item.title}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--landing-primary))]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[hsl(var(--landing-primary))]/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <span className="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-[hsl(var(--landing-primary))]/10 text-[hsl(var(--landing-primary))] ring-1 ring-[hsl(var(--landing-primary))]/15">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mb-2 font-['Libre_Caslon_Text'] text-2xl font-bold text-[hsl(var(--landing-foreground))]">{item.title}</h3>
                      <p className="break-words text-sm leading-6 text-[hsl(var(--landing-muted))]">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-24 mx-auto w-full max-w-7xl overflow-hidden px-5 py-20 md:scroll-mt-28 md:px-16" id="experiencia">
        <div className="grid min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="relative h-[500px] overflow-hidden rounded-xl shadow-2xl lg:col-span-7">
            <img alt="Prato autoral do Terraço Bistrô com apresentação sofisticada" className="h-full w-full object-cover" src={landingImages.plate} />
            <div className="absolute bottom-8 left-6 right-6 max-w-sm rounded-xl border border-[hsl(var(--landing-border))] bg-[hsl(var(--landing-surface-strong))]/85 p-5 backdrop-blur md:left-8 md:right-auto md:p-6">
              <div className="mb-2 flex gap-1 text-[hsl(var(--landing-primary))]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star className="h-4 w-4 fill-current" key={index} />
                ))}
              </div>
              <p className="text-sm italic leading-6 text-[hsl(var(--landing-foreground))] md:text-base">"Uma explosão de sabores urbanos em um ambiente que respira sofisticação."</p>
            </div>
          </div>

          <div className="scroll-mt-24 relative flex h-full flex-col justify-center overflow-hidden rounded-xl bg-[hsl(var(--landing-primary))] p-7 text-[hsl(var(--landing-primary-foreground))] md:scroll-mt-28 md:p-12 lg:col-span-5" id="reservas">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-black/10 blur-3xl md:-right-12 md:-top-12 md:h-48 md:w-48" />
            <span className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[hsl(var(--landing-primary-foreground))]/70">Atendimento online</span>
            <h2 className="mb-6 font-['Libre_Caslon_Text'] text-3xl font-bold leading-tight text-[hsl(var(--landing-primary-foreground))] md:text-4xl">
              Reserve, escolha e acompanhe no seu ritmo.
            </h2>
            <p className="mb-8 break-words text-base leading-7 text-[hsl(var(--landing-primary-foreground))]/85">
              Da mesa ao delivery, o Terraço Bistrô reúne o que você precisa para ser atendido sem espera e com conforto digital.
            </p>
            <div className="scroll-mt-28 space-y-6 border-t border-[hsl(var(--landing-primary-foreground))]/20 pt-6" id="delivery">
              {serviceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="flex min-w-0 items-start gap-4" key={item.title}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-black/10">
                      <Icon className="h-5 w-5 text-[hsl(var(--landing-primary-foreground))]" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="mb-1 text-sm font-bold uppercase tracking-[0.05em] text-[hsl(var(--landing-primary-foreground))]">{item.title}</h4>
                      <p className="break-words text-sm leading-6 text-[hsl(var(--landing-primary-foreground))]/80">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-mt-24 bg-[hsl(var(--landing-surface-low))] py-16 md:scroll-mt-28 md:py-20" id="cardapio">
        <div className="mx-auto mb-12 max-w-7xl px-5 text-center md:mb-16 md:px-16">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.18em] text-[hsl(var(--landing-primary))]">Destaques</span>
          <h2 className="font-['Libre_Caslon_Text'] text-3xl font-bold text-[hsl(var(--landing-foreground))] md:text-4xl">Sugestões do chef</h2>
        </div>

        {menuQuery.isLoading ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 md:grid-cols-3 md:gap-6 md:px-16">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="min-w-0" key={index}>
                <div className="mb-5 aspect-[4/5] animate-pulse rounded-xl bg-[hsl(var(--landing-surface))] md:mb-6" />
                <div className="h-7 w-2/3 animate-pulse rounded bg-[hsl(var(--landing-surface))]" />
                <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-[hsl(var(--landing-surface))]" />
              </div>
            ))}
          </div>
        ) : chefSuggestions.length === 0 ? (
          <div className="mx-auto max-w-7xl px-5 text-center md:px-16">
            <p className="text-sm text-[hsl(var(--landing-muted))]">Sugestões indisponíveis no momento.</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 md:grid-cols-3 md:gap-6 md:px-16">
            {chefSuggestions.map((item) => (
              <article className="group min-w-0 cursor-pointer" key={item.id}>
                <div className="mb-5 aspect-[4/5] overflow-hidden rounded-xl shadow-lg md:mb-6">
                  <img alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" src={item.imageUrl} />
                </div>
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="break-words font-['Libre_Caslon_Text'] text-2xl font-bold text-[hsl(var(--landing-foreground))] transition-colors group-hover:text-[hsl(var(--landing-primary))]">{item.name}</h3>
                    <p className="mt-1 break-words text-xs font-semibold uppercase tracking-[0.08em] text-[hsl(var(--landing-muted))]">{item.description}</p>
                  </div>
                  <span className="shrink-0 text-base font-bold text-[hsl(var(--landing-primary))]">{formatCurrency(item.price)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-[hsl(var(--landing-border))] bg-[hsl(var(--landing-background))] py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:grid-cols-4 md:gap-6 md:px-16">
          <div>
            <h2 className="mb-6 font-['Libre_Caslon_Text'] text-2xl font-bold text-[hsl(var(--landing-foreground))]">Terraço Bistrô</h2>
            <p className="mb-8 max-w-sm text-sm leading-7 text-[hsl(var(--landing-muted))]">
              Culinária contemporânea inspirada no ritmo vibrante das grandes cidades.
            </p>
            <div className="flex gap-4 text-[hsl(var(--landing-muted))]">
              <a className="transition-colors hover:text-[hsl(var(--landing-primary))]" href="/" aria-label="Site">
                <Globe2 className="h-5 w-5" />
              </a>
              <a className="transition-colors hover:text-[hsl(var(--landing-primary))]" href="/" aria-label="Compartilhar">
                <Share2 className="h-5 w-5" />
              </a>
              <a className="transition-colors hover:text-[hsl(var(--landing-primary))]" href="/" aria-label="E-mail">
                <AtSign className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.05em] text-[hsl(var(--landing-foreground))]">{group.title}</h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link}>
                    <a className="text-sm text-[hsl(var(--landing-muted))] transition-colors hover:text-[hsl(var(--landing-primary))]" href="/">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.05em] text-[hsl(var(--landing-foreground))]">Horários</h3>
            <p className="text-sm leading-7 text-[hsl(var(--landing-muted))]">{formatRestaurantOperatingSchedule()}</p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-[hsl(var(--landing-border))]/70 px-5 pt-8 text-center md:px-16">
          <p className="text-xs text-[hsl(var(--landing-muted))]">© 2026 Terraço Bistrô. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
