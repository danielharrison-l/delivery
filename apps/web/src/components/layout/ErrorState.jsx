import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { EmptyState } from "./EmptyState";

export function ErrorState({
  title = "Não foi possível carregar os dados",
  description = "Tente novamente em instantes.",
  onRetry
}) {
  return (
    <EmptyState
      action={
        onRetry ? (
          <Button onClick={onRetry} type="button" variant="outline">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        ) : null
      }
      description={description}
      title={title}
    />
  );
}
