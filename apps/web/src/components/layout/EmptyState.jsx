export function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-card px-6 py-10 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
