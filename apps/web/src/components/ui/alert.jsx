import { cn } from "../../lib/utils";

export function Alert({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "rounded-md border p-4 text-sm",
        variant === "destructive" ? "border-destructive/30 bg-destructive/10 text-destructive" : "bg-card",
        className
      )}
      {...props}
    />
  );
}
