import { createAuthenticatedDeliveryOrderSchema } from "@repo/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageOff, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../../components/layout/EmptyState";
import { ErrorState } from "../../components/layout/ErrorState";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { PaginationControls } from "../../components/ui/pagination-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { createDeliveryOrder, deleteDeliveryOrder, getApiErrorMessage, listAddresses, listDeliveryOrders, listMenuItems, updateDeliveryOrderStatus } from "../../lib/api";
import { deliveryStatusOptions, paginationDefaults, statusLabels } from "../../lib/constants";
import { formatCurrency, formatDateTime } from "../../lib/formatters";
import { useAuthStore } from "../auth/store";
import { useCartStore } from "./cart-store";

function MenuImage({ item }) {
  if (item.imageUrl) {
    return <img alt={item.name} className="h-full w-full object-cover" loading="lazy" src={item.imageUrl} />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
      <ImageOff className="h-6 w-6" />
    </div>
  );
}

export function DeliveryPage() {
  const queryClient = useQueryClient();
  const customer = useAuthStore((state) => state.customer);
  const isAdmin = customer?.role === "ADMIN";
  const [address, setAddress] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(paginationDefaults.page);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!address && customer?.address) {
      setAddress(customer.address);
    }
  }, [address, customer?.address]);

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: listAddresses
  });

  useEffect(() => {
    if (!selectedAddressId && addressesQuery.data?.length) {
      const defaultAddress = addressesQuery.data.find((item) => item.isDefault) ?? addressesQuery.data[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addressesQuery.data, selectedAddressId]);

  const menuQuery = useQuery({
    queryKey: ["menu-items", "delivery"],
    queryFn: () => listMenuItems({ available: true })
  });
  const ordersQuery = useQuery({
    queryKey: ["delivery-orders", { page, status }],
    queryFn: () => listDeliveryOrders({ page, limit: paginationDefaults.limit, status })
  });

  const total = useMemo(() => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [items]);

  const createMutation = useMutation({
    mutationFn: createDeliveryOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-home"] });
      clearCart();
      setAddress(customer?.address ?? "");
      toast.success("Pedido criado");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }) => updateDeliveryOrderStatus(id, { status: nextStatus }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      toast.success("Status atualizado");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeliveryOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      toast.success("Pedido removido");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  function handleAddItem(item) {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  }

  function handleCreateOrder() {
    const parsed = createAuthenticatedDeliveryOrderSchema.safeParse({
      addressId: selectedAddressId || undefined,
      deliveryAddress: selectedAddressId ? undefined : address,
      items: items.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity }))
    });

    if (!parsed.success) {
      toast.error(items.length === 0 ? "Adicione pelo menos um item ao carrinho." : "Informe o endereço de entrega.");
      return;
    }

    createMutation.mutate(parsed.data);
  }

  function confirmDelete(order) {
    if (window.confirm(`Remover o pedido de ${formatDateTime(order.createdAt)}?`)) {
      deleteMutation.mutate(order.id);
    }
  }

  const menuItems = menuQuery.data ?? [];
  const orders = ordersQuery.data?.data ?? [];
  const addresses = addressesQuery.data ?? [];
  const meta = ordersQuery.data?.meta;

  return (
    <>
      <PageHeader
        description={isAdmin ? "Acompanhe todos os pedidos e atualize o status das entregas." : "Monte pedidos a partir do cardápio disponível e acompanhe suas entregas."}
        eyebrow="Delivery"
        title={isAdmin ? "Delivery" : "Meus pedidos"}
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Cardápio disponível</CardTitle>
          </CardHeader>
          <CardContent>
            {menuQuery.isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton className="h-44 w-full" key={index} />
                ))}
              </div>
            ) : menuQuery.isError ? (
              <ErrorState onRetry={() => menuQuery.refetch()} />
            ) : menuItems.length === 0 ? (
              <EmptyState description="Nenhum item disponível para delivery no momento." title="Sem itens disponíveis" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {menuItems.map((item) => (
                  <article className="grid grid-cols-[88px_1fr] overflow-hidden rounded-lg border bg-card sm:grid-cols-[96px_1fr]" key={item.id}>
                    <div className="h-full min-h-32 bg-muted">
                      <MenuImage item={item} />
                    </div>
                    <div className="grid gap-3 p-4">
                      <div>
                        <h3 className="line-clamp-1 font-semibold">{item.name}</h3>
                        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-muted-foreground">{item.description ?? "Sem descrição"}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
                        <Button onClick={() => handleAddItem(item)} size="sm" type="button">
                          <Plus className="h-4 w-4" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit xl:sticky xl:top-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Carrinho
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {items.length === 0 ? (
              <p className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">Nenhum item no carrinho.</p>
            ) : (
              <div className="grid gap-3">
                {items.map((item) => (
                  <div className="grid gap-2 rounded-md border p-3" key={item.menuItemId}>
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                      </div>
                      <Button onClick={() => removeItem(item.menuItemId)} size="icon" type="button" variant="ghost">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} size="icon" type="button" variant="outline">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} size="icon" type="button" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-semibold">{formatCurrency(Number(item.price) * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {addresses.length > 0 ? (
              <FormField id="delivery-address-id" label="Endereço de entrega">
                <Select onValueChange={setSelectedAddressId} value={selectedAddressId}>
                  <SelectTrigger id="delivery-address-id">
                    <SelectValue placeholder="Selecione um endereço" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label} - {item.street}, {item.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            ) : (
              <FormField id="delivery-address" label="Endereço de entrega">
                <Input
                  id="delivery-address"
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Rua, número, bairro e complemento"
                  value={address}
                />
              </FormField>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-semibold">{formatCurrency(total)}</span>
            </div>

            <Button disabled={createMutation.isPending || items.length === 0} onClick={handleCreateOrder} type="button">
              {createMutation.isPending ? "Enviando..." : "Finalizar pedido"}
            </Button>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{isAdmin ? "Pedidos" : "Meus pedidos"}</CardTitle>
          <Select
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            value={status}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {deliveryStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          {ordersQuery.isLoading ? (
            <div className="grid gap-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="h-14 w-full" key={index} />
              ))}
            </div>
          ) : ordersQuery.isError ? (
            <div className="p-4">
              <ErrorState onRetry={() => ordersQuery.refetch()} />
            </div>
          ) : orders.length === 0 ? (
            <div className="p-4">
              <EmptyState description="Nenhum pedido encontrado para os filtros atuais." title="Sem pedidos" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAdmin ? <TableHead>Cliente</TableHead> : null}
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Endereço</TableHead>
                    {isAdmin ? <TableHead className="w-20 text-right">Ações</TableHead> : null}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      {isAdmin ? <TableCell className="font-medium">{order.customer?.name ?? "Cliente"}</TableCell> : null}
                      <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <Select onValueChange={(nextStatus) => statusMutation.mutate({ id: order.id, nextStatus })} value={order.status}>
                            <SelectTrigger className="h-9 min-w-44">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryStatusOptions
                                .filter((option) => option.value !== "all")
                                .map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary">{statusLabels[order.status]}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-2 text-sm text-muted-foreground">{order.deliveryAddress}</span>
                      </TableCell>
                      {isAdmin ? (
                        <TableCell>
                          <div className="flex justify-end">
                            <Button onClick={() => confirmDelete(order)} size="icon" type="button" variant="ghost">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {meta ? <PaginationControls meta={meta} onPageChange={setPage} /> : null}
        </CardContent>
      </Card>
    </>
  );
}
