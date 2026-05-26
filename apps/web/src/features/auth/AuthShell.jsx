import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthShell({ title, description, children, footer }) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_520px]">
      <section className="hidden min-h-screen bg-foreground text-background lg:flex lg:flex-col lg:justify-between lg:px-10 lg:py-8">
        <Link className="flex items-center gap-3 text-sm font-semibold" to="/">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat className="h-5 w-5" />
          </span>
          Terraço Bistrô
        </Link>
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-background/60">Restaurante</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight tracking-normal">Reservas, cardápio e delivery em um só lugar.</h1>
          <p className="mt-5 text-base leading-7 text-background/70">
            Entre para fazer pedidos, acompanhar reservas e acessar o restaurante com rapidez.
          </p>
        </div>
        <p className="text-sm text-background/55">Projeto web fullstack</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold">Terraço Bistrô</span>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-soft sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
          {footer ? <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
