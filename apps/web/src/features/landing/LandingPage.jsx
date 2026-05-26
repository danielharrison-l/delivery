import { formatRestaurantOperatingSchedule } from "@repo/shared";
import { AtSign, CalendarCheck, CalendarDays, ChefHat, Clock3, Globe2, Share2, ShoppingBag, Star, Truck, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useAuthStore } from "../auth/store";

const landingImages = {
  hero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD48i0MtqSH8tS6baHlrDXNj-YlXmec9acL3jxjSBMsVYN0eJ3OQ1ylg5KLvWPiVfX1b6QUDjqBtTgHeYUHtMEzNZqOe0_sL6pV-XDTv37PrWXZFIvOW3BMly6KJX5SfgTuua8QM2oc53Y6t3c22P9Yp-R-3kuMCSUXEZJG1fWumt5Ol0LcptufGgo8Uh5IgwPtaZmZ8p49mAXFasMVbDz1dtYsoMMY2v23kW5BOS6iNNwkSMkVYqgkYoYPPifKJD8YwjJvGxg66lAN",
  plate:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCzSgxDu149z3H3tXEo1fNerMCHTr2QB_ee5tvtVGVpEUG8NCL_B1qh6fSGmT_z7WHm8zvFsJVfKYEBqilTkk4oj4tBv_G_-l1CdZvwkSHqHvbsKSncv1p4e2t6pl-U0p1KXWk2F8KrF2Vse6oYlOp_qc82R1qzL3qIL5ONP5ngc-fEtUGXbtsOUkIDXaJQID6EnOZIghvT89wknXXRP0YgkSNLsg5fiUh5QYDAFth7LRhHFXuJm2J5gAcbUPMxoVtkYuyX3EGLfEpe",
  rib:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAAoPmUax3WssHIfrG7WAdu3fEszjxx9lGEB_CAZ_OgsJcs6OE5xEdHv3UXU_GDGUhNl5fEruWSrKJ-67w6wAacAzG-4IOYhBnCPTR_Q3CCCK1tcdRuvB5AU_EfpuV__91NxfULo_vCMZQihtRD10nboWrVHEHSe6fybA5xAi77ZD8189T1l1oHgX3ka1wJm3bwzaTzQZZbM8qnFmJ4EKfMvtMlA0dTAapUocZXeAOlJziScwOi3LViZfzi2FEbdc5JKySI-GzKKKjG",
  pasta:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChR-xZilam_wDzeLvAwFCFEeZUpIvUdqShrFYaSGYTMzBINPA6KGwmBC52Y0vUqW9XQctyHggYKtLVHgE9Dtm4T6ISRxM4aJ8y7stsaZtwm3tELWOSI0jb7CMq44soOsKBB3bAoR50axxlNUzQwXsq6dYMBLNmN1WuFcQnh9fz2kpkClcP5fT6BnLkvlXOcb3OBVV1ZTOPzZJTr8Wg79TQv79IC1ibnxacCyZ5aBQqFjx4tks3FcU2uP281QiP81OXrcjrrwM3rEje",
  salmon:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAlAqg3PdaCKMuLa1yO5AJ_9N8R8YN7qCgtqcZeQKvwYVJjigM8cUR6SwZ7Sp-bsFv-SJB6uueS_UdaEakNCjj2sj5vZiS5ihMVrFBJS-hF8IaGZbFgeOYWeXS8tSlRFfNhd4HP4vd62TqerBMBMhT2UcytPuDuECfAZh9MMlrPyu8uODFwI3mKfhkD1qOG5K6bBLb2yQ1sP3raxm0d_0hJggQ3roOGAebqMoxhDMz2GYp17lPwDhpPFiqxrpYiLKr2FrC6YcCwL9gh"
};

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

const chefSuggestions = [
  {
    title: "Costela Urbana",
    detail: "Cozida por 48 horas",
    price: "R$ 124",
    image: landingImages.rib,
    alt: "Costela preparada em prato escuro com purê colorido e vegetais assados"
  },
  {
    title: "Pappardelle Bosco",
    detail: "Cogumelos silvestres",
    price: "R$ 89",
    image: landingImages.pasta,
    alt: "Massa artesanal com cogumelos em prato de restaurante"
  },
  {
    title: "Salmão Glacé",
    detail: "Com risoto de ervilha",
    price: "R$ 112",
    image: landingImages.salmon,
    alt: "Salmão grelhado com risoto verde e ervas frescas"
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

export function LandingPage() {
  const customer = useAuthStore((state) => state.customer);
  const accountLink = customer ? "/app" : "/login";

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#0a1421] font-[Manrope] text-[#dae3f5] selection:bg-[#ffb68d] selection:text-[#532200]">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[#2c3543]/80 bg-[#0a1421]/95 shadow-sm backdrop-blur md:h-20">
        <nav className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-5 py-4 md:px-16">
          <Link className="flex min-w-0 items-center gap-3 overflow-hidden" to="/">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#9a4602] text-[#ffceb5]">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="truncate font-['Libre_Caslon_Text'] text-base font-bold text-[#dae3f5] md:text-xl">Terraço Bistrô</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a className="border-b-2 border-[#ffb68d] pb-1 text-sm font-bold uppercase tracking-[0.05em] text-[#ffb68d]" href="#cardapio">
              Cardápio
            </a>
            <a className="text-sm font-semibold uppercase tracking-[0.05em] text-[#c6c6cc] transition-colors hover:text-[#ffb68d]" href="#reservas">
              Reservas
            </a>
            <a className="text-sm font-semibold uppercase tracking-[0.05em] text-[#c6c6cc] transition-colors hover:text-[#ffb68d]" href="#delivery">
              Delivery
            </a>
            <a className="text-sm font-semibold uppercase tracking-[0.05em] text-[#c6c6cc] transition-colors hover:text-[#ffb68d]" href="#experiencia">
              Experiência
            </a>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button asChild className="hidden bg-transparent text-[#c6c6cc] hover:bg-[#17202d] hover:text-[#ffb68d] sm:inline-flex" variant="ghost">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="h-9 rounded-lg bg-[#9a4602] px-4 text-sm font-bold text-[#ffceb5] shadow-md hover:bg-[#b95608] md:h-10 md:px-6">
              <Link to={accountLink}>Reservar</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative flex min-h-screen items-center overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img alt="Interior sofisticado do Terraço Bistrô com iluminação quente e ambiente urbano" className="h-full w-full object-cover" src={landingImages.hero} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,20,33,1)_18%,rgba(10,20,33,0.82)_48%,rgba(10,20,33,0.28)_100%)]" />
          <div className="absolute inset-0 bg-[#0a1421]/20 md:bg-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-12 md:px-16 md:py-16">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.18em] text-[#ffb68d]">Cozinha urbana</span>
            <h1 className="mb-6 max-w-full break-words font-['Libre_Caslon_Text'] text-[36px] font-bold leading-[44px] text-[#dae3f5] sm:text-6xl sm:leading-tight md:text-7xl">
              Terraço Bistrô
            </h1>
            <p className="mb-10 max-w-xl break-words text-base leading-8 text-[#c6c6cc] md:text-lg">
              Uma experiência completa para reservar mesa, consultar o cardápio e pedir delivery com praticidade e sofisticação.
            </p>

            <div className="mb-12 flex flex-wrap gap-4 md:mb-16">
              <Button asChild className="h-12 rounded-lg bg-[#9a4602] px-8 font-bold text-[#ffceb5] hover:bg-[#b95608]">
                <Link to={accountLink}>
                  Fazer reserva
                  <CalendarDays className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="h-12 rounded-lg border-[#8f9096] bg-transparent px-8 font-bold text-[#dae3f5] hover:bg-[#2c3543] hover:text-[#dae3f5]" variant="outline">
                <Link to="/cardapio">Ver cardápio</Link>
              </Button>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              {heroCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    className="group relative min-w-0 overflow-hidden rounded-xl border border-[#c6c6cc]/10 bg-[#17202d]/75 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb68d]/35 hover:bg-[#212a38]/80 md:p-6"
                    key={item.title}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb68d]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffb68d]/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <span className="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-[#ffb68d]/10 text-[#ffb68d] ring-1 ring-[#ffb68d]/15">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mb-2 font-['Libre_Caslon_Text'] text-2xl font-bold text-[#dae3f5]">{item.title}</h3>
                      <p className="break-words text-sm leading-6 text-[#c6c6cc]/75">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl overflow-hidden px-5 py-20 md:px-16" id="experiencia">
        <div className="grid min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="relative h-[500px] overflow-hidden rounded-xl shadow-2xl lg:col-span-7">
            <img alt="Prato autoral do Terraço Bistrô com apresentação sofisticada" className="h-full w-full object-cover" src={landingImages.plate} />
            <div className="absolute bottom-8 left-6 right-6 max-w-sm rounded-xl border border-[#45474c] bg-[#2c3543]/80 p-5 backdrop-blur md:left-8 md:right-auto md:p-6">
              <div className="mb-2 flex gap-1 text-[#ffb68d]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star className="h-4 w-4 fill-current" key={index} />
                ))}
              </div>
              <p className="text-sm italic leading-6 text-[#dae3f5] md:text-base">"Uma explosão de sabores urbanos em um ambiente que respira sofisticação."</p>
            </div>
          </div>

          <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-xl bg-[#9a4602] p-7 text-[#ffceb5] md:p-12 lg:col-span-5" id="reservas">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#331200]/10 blur-3xl md:-right-12 md:-top-12 md:h-48 md:w-48" />
            <span className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#763300]">Atendimento online</span>
            <h2 className="mb-6 font-['Libre_Caslon_Text'] text-3xl font-bold leading-tight text-[#ffceb5] md:text-4xl">
              Reserve, escolha e acompanhe no seu ritmo.
            </h2>
            <p className="mb-8 break-words text-base leading-7 text-[#ffd9c6]/90">
              Da mesa ao delivery, o Terraço Bistrô reúne o que você precisa para ser atendido sem espera e com conforto digital.
            </p>
            <div className="space-y-6 border-t border-[#ffceb5]/15 pt-6" id="delivery">
              {serviceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="flex min-w-0 items-start gap-4" key={item.title}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#331200]/10">
                      <Icon className="h-5 w-5 text-[#ffceb5]" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="mb-1 text-sm font-bold uppercase tracking-[0.05em] text-[#ffceb5]">{item.title}</h4>
                      <p className="break-words text-sm leading-6 text-[#ffd9c6]/80">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#131c29] py-16 md:py-20" id="cardapio">
        <div className="mx-auto mb-12 max-w-7xl px-5 text-center md:mb-16 md:px-16">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.18em] text-[#ffb68d]">Destaques</span>
          <h2 className="font-['Libre_Caslon_Text'] text-3xl font-bold text-[#dae3f5] md:text-4xl">Sugestões do chef</h2>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 md:grid-cols-3 md:gap-6 md:px-16">
          {chefSuggestions.map((item) => (
            <article className="group min-w-0 cursor-pointer" key={item.title}>
              <div className="mb-5 aspect-[4/5] overflow-hidden rounded-xl shadow-lg md:mb-6">
                <img alt={item.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.image} />
              </div>
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="break-words font-['Libre_Caslon_Text'] text-2xl font-bold text-[#dae3f5] transition-colors group-hover:text-[#ffb68d]">{item.title}</h3>
                  <p className="mt-1 break-words text-xs font-semibold uppercase tracking-[0.08em] text-[#c6c6cc]">{item.detail}</p>
                </div>
                <span className="shrink-0 text-base font-bold text-[#ffb68d]">{item.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#45474c] bg-[#060f1b] py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:grid-cols-4 md:gap-6 md:px-16">
          <div>
            <h2 className="mb-6 font-['Libre_Caslon_Text'] text-2xl font-bold text-[#c0c6d8]">Terraço Bistrô</h2>
            <p className="mb-8 max-w-sm text-sm leading-7 text-[#c6c6cc]/70">
              Culinária contemporânea inspirada no ritmo vibrante das grandes cidades.
            </p>
            <div className="flex gap-4 text-[#c6c6cc]">
              <a className="transition-colors hover:text-[#ffb68d]" href="/" aria-label="Site">
                <Globe2 className="h-5 w-5" />
              </a>
              <a className="transition-colors hover:text-[#ffb68d]" href="/" aria-label="Compartilhar">
                <Share2 className="h-5 w-5" />
              </a>
              <a className="transition-colors hover:text-[#ffb68d]" href="/" aria-label="E-mail">
                <AtSign className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.05em] text-[#dae3f5]">{group.title}</h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link}>
                    <a className="text-sm text-[#c6c6cc] transition-colors hover:text-[#ffb68d]" href="/">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.05em] text-[#dae3f5]">Horários</h3>
            <p className="text-sm leading-7 text-[#c6c6cc]/70">{formatRestaurantOperatingSchedule()}</p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-[#45474c]/40 px-5 pt-8 text-center md:px-16">
          <p className="text-xs text-[#c6c6cc]/50">© 2026 Terraço Bistrô. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
