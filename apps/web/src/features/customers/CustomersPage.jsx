import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerSchema, updateCustomerSchema } from "@repo/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmptyState } from "../../components/layout/EmptyState";
import { ErrorState } from "../../components/layout/ErrorState";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { PaginationControls } from "../../components/ui/pagination-controls";
import { Skeleton } from "../../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";
import { createCustomer, deleteCustomer, getApiErrorMessage, listCustomers, updateCustomer } from "../../lib/api";
import { paginationDefaults } from "../../lib/constants";
import { formatDate } from "../../lib/formatters";

const emptyValues = {
  name: "",
  email: "",
  phone: "",
  address: ""
};

function CustomerDialog({ open, onOpenChange, customer }) {
  const queryClient = useQueryClient();
  const schema = customer ? updateCustomerSchema : createCustomerSchema;
  const form = useForm({ resolver: zodResolver(schema), defaultValues: emptyValues });

  useEffect(() => {
    form.reset(
      customer
        ? {
            name: customer.name,
            email: customer.email,
            phone: customer.phone ?? "",
            address: customer.address ?? ""
          }
        : emptyValues
    );
  }, [customer, form, open]);

  const mutation = useMutation({
    mutationFn: (values) => (customer ? updateCustomer(customer.id, values) : createCustomer(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(customer ? "Cliente atualizado" : "Cliente criado");
      onOpenChange(false);
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  function handleSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? "Editar cliente" : "Novo cliente"}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField error={form.formState.errors.name?.message} id="customer-name" label="Nome">
            <Input id="customer-name" placeholder="Nome completo" {...form.register("name")} />
          </FormField>
          <FormField error={form.formState.errors.email?.message} id="customer-email" label="E-mail">
            <Input id="customer-email" placeholder="cliente@email.com" type="email" {...form.register("email")} />
          </FormField>
          <FormField error={form.formState.errors.phone?.message} id="customer-phone" label="Telefone">
            <Input id="customer-phone" placeholder="11999999999" {...form.register("phone")} />
          </FormField>
          <FormField error={form.formState.errors.address?.message} id="customer-address" label="Endereço">
            <Textarea id="customer-address" placeholder="Rua, número e bairro" {...form.register("address")} />
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

export function CustomersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(paginationDefaults.page);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const query = useQuery({
    queryKey: ["customers", { page, search }],
    queryFn: () => listCustomers({ page, limit: paginationDefaults.limit, search: search || undefined })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente removido");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  function openCreateDialog() {
    setSelectedCustomer(null);
    setDialogOpen(true);
  }

  function openEditDialog(customer) {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function confirmDelete(customer) {
    if (window.confirm(`Remover o cliente "${customer.name}"?`)) {
      deleteMutation.mutate(customer.id);
    }
  }

  const customers = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <PageHeader
        actions={
          <Button onClick={openCreateDialog} type="button">
            <Plus className="h-4 w-4" />
            Novo cliente
          </Button>
        }
        description="Área administrativa para consultar e manter clientes. Clientes criados aqui não recebem senha de acesso."
        eyebrow="Clientes"
        title="Clientes"
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" onChange={handleSearch} placeholder="Buscar por nome ou e-mail" value={search} />
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
          ) : customers.length === 0 ? (
            <div className="p-4">
              <EmptyState description="Nenhum cliente encontrado para os filtros atuais." title="Sem clientes" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="w-28 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone ?? "Não informado"}</TableCell>
                      <TableCell>{customer.role === "ADMIN" ? "Admin" : "Cliente"}</TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button onClick={() => openEditDialog(customer)} size="icon" type="button" variant="ghost">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            disabled={deleteMutation.isPending}
                            onClick={() => confirmDelete(customer)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
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

      <CustomerDialog customer={selectedCustomer} onOpenChange={setDialogOpen} open={dialogOpen} />
    </>
  );
}
