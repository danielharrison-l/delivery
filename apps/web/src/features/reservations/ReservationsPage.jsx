import {
  createAuthenticatedReservationSchema,
  formatRestaurantOperatingSchedule,
  getReservationDateValidationMessage
} from "@repo/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, Clock, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { EmptyState } from "../../components/layout/EmptyState";
import { ErrorState } from "../../components/layout/ErrorState";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { PaginationControls } from "../../components/ui/pagination-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";
import { createReservation, deleteReservation, getApiErrorMessage, listReservations, updateReservationStatus } from "../../lib/api";
import { paginationDefaults, reservationStatusOptions, statusLabels } from "../../lib/constants";
import { formatDateTime } from "../../lib/formatters";
import { useAuthStore } from "../auth/store";

const emptyValues = {
  reservationDate: "",
  peopleCount: "2",
  notes: ""
};

const reservationFormSchema = z
  .object({
    reservationDate: z.string().min(1, "Informe a data e o horário da reserva."),
    peopleCount: z.coerce.number().int().min(1, "Informe pelo menos 1 pessoa.").max(20, "O limite é de 20 pessoas."),
    notes: z.string().trim().max(500, "Use no máximo 500 caracteres.").optional().or(z.literal(""))
  })
  .superRefine((value, context) => {
    if (!value.reservationDate) {
      return;
    }

    const message = getReservationDateValidationMessage(new Date(value.reservationDate));

    if (message) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reservationDate"],
        message
      });
    }
  });

function toIsoDateTime(value) {
  return new Date(value).toISOString();
}

function getDateTimeLocalMinimum() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function ReservationDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: createReservation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva criada");
      setValues(emptyValues);
      setErrors({});
      onOpenChange(false);
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const parsed = reservationFormSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])));
      return;
    }

    const payload = createAuthenticatedReservationSchema.safeParse({
      ...parsed.data,
      reservationDate: toIsoDateTime(parsed.data.reservationDate)
    });

    if (!payload.success) {
      toast.error("Confira os dados da reserva.");
      return;
    }

    mutation.mutate(payload.data);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova reserva</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex gap-3 rounded-lg border bg-background p-3 text-sm text-muted-foreground">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>{formatRestaurantOperatingSchedule()}</p>
          </div>
          <FormField error={errors.reservationDate} id="reservation-date" label="Data e horário">
            <Input
              id="reservation-date"
              min={getDateTimeLocalMinimum()}
              onChange={(event) => updateValue("reservationDate", event.target.value)}
              step="1800"
              type="datetime-local"
              value={values.reservationDate}
            />
          </FormField>
          <FormField error={errors.peopleCount} id="people-count" label="Quantidade de pessoas">
            <Input
              id="people-count"
              max="20"
              min="1"
              onChange={(event) => updateValue("peopleCount", event.target.value)}
              type="number"
              value={values.peopleCount}
            />
          </FormField>
          <FormField error={errors.notes} id="reservation-notes" label="Observações">
            <Textarea
              id="reservation-notes"
              onChange={(event) => updateValue("notes", event.target.value)}
              placeholder="Preferência de mesa, restrições ou detalhes"
              value={values.notes}
            />
          </FormField>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={mutation.isPending} type="submit">
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ReservationsPage() {
  const queryClient = useQueryClient();
  const customer = useAuthStore((state) => state.customer);
  const isAdmin = customer?.role === "ADMIN";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(paginationDefaults.page);
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const query = useQuery({
    queryKey: ["reservations", { page, status, date }],
    queryFn: () => listReservations({ page, limit: paginationDefaults.limit, status, date: date || undefined })
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }) => updateReservationStatus(id, { status: nextStatus }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Status atualizado");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva removida");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  function confirmDelete(reservation) {
    if (window.confirm(`Remover a reserva de ${formatDateTime(reservation.reservationDate)}?`)) {
      deleteMutation.mutate(reservation.id);
    }
  }

  const reservations = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <PageHeader
        actions={
          <Button onClick={() => setDialogOpen(true)} type="button">
            <CalendarPlus className="h-4 w-4" />
            Nova reserva
          </Button>
        }
        description={isAdmin ? "Acompanhe todas as reservas por data e status." : "Acompanhe suas reservas por data e status."}
        eyebrow="Reservas"
        title={isAdmin ? "Reservas" : "Minhas reservas"}
      />

      <Card>
        <CardContent className="p-0">
          <div className="grid gap-3 border-b p-4 md:grid-cols-[220px_220px_1fr]">
            <Select
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              value={status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {reservationStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              onChange={(event) => {
                setDate(event.target.value);
                setPage(1);
              }}
              type="date"
              value={date}
            />
            <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
              <Search className="h-4 w-4" />
              {meta ? `${meta.total} ${meta.total === 1 ? "reserva encontrada" : "reservas encontradas"}` : "Buscando reservas"}
            </div>
          </div>

          {query.isLoading ? (
            <div className="grid gap-3 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton className="h-14 w-full" key={index} />
              ))}
            </div>
          ) : query.isError ? (
            <div className="p-4">
              <ErrorState onRetry={() => query.refetch()} />
            </div>
          ) : reservations.length === 0 ? (
            <div className="p-4">
              <EmptyState description="Nenhuma reserva encontrada para os filtros atuais." title="Sem reservas" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAdmin ? <TableHead>Cliente</TableHead> : null}
                    <TableHead>Data</TableHead>
                    <TableHead>Pessoas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="w-20 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      {isAdmin ? <TableCell className="font-medium">{reservation.customer?.name ?? "Cliente"}</TableCell> : null}
                      <TableCell>{formatDateTime(reservation.reservationDate)}</TableCell>
                      <TableCell>{reservation.peopleCount}</TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <Select onValueChange={(nextStatus) => statusMutation.mutate({ id: reservation.id, nextStatus })} value={reservation.status}>
                            <SelectTrigger className="h-9 min-w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {reservationStatusOptions
                                .filter((option) => option.value !== "all")
                                .map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary">{statusLabels[reservation.status]}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-2 text-sm text-muted-foreground">{reservation.notes ?? "Sem observações"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button onClick={() => confirmDelete(reservation)} size="icon" type="button" variant="ghost">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {meta ? <PaginationControls meta={meta} onPageChange={setPage} /> : null}
        </CardContent>
      </Card>

      <ReservationDialog onOpenChange={setDialogOpen} open={dialogOpen} />
    </>
  );
}
