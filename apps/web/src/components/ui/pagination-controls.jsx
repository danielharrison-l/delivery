import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export function PaginationControls({ meta, onPageChange }) {
  const canGoBack = meta.page > 1;
  const canGoNext = meta.page < meta.totalPages;

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Página {meta.page} de {Math.max(meta.totalPages, 1)} · {meta.total} registros
      </p>
      <div className="flex items-center gap-2">
        <Button disabled={!canGoBack} onClick={() => onPageChange(meta.page - 1)} size="sm" type="button" variant="outline">
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button disabled={!canGoNext} onClick={() => onPageChange(meta.page + 1)} size="sm" type="button" variant="outline">
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
