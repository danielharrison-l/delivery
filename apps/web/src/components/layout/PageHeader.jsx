export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
