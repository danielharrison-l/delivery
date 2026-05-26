import { zodResolver } from "@hookform/resolvers/zod";
import { createMenuCategorySchema, createMenuItemSchema, updateMenuCategorySchema, updateMenuItemSchema } from "@repo/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmptyState } from "../../components/layout/EmptyState";
import { ErrorState } from "../../components/layout/ErrorState";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { useAuthStore } from "../auth/store";
import {
  createMenuCategory,
  createMenuItem,
  deleteMenuCategory,
  deleteMenuItem,
  getApiErrorMessage,
  listMenuCategories,
  listMenuItems,
  updateMenuCategory,
  updateMenuItem
} from "../../lib/api";
import { formatCurrency } from "../../lib/formatters";

const emptyCategory = {
  name: "",
  description: ""
};

const emptyItem = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  available: true,
  categoryId: ""
};

function MenuImage({ item }) {
  if (item.imageUrl) {
    return <img alt={item.name} className="h-full w-full object-cover" loading="lazy" src={item.imageUrl} />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary via-muted to-background text-muted-foreground">
      <ImageOff className="h-7 w-7" />
    </div>
  );
}

function CategoryDialog({ open, onOpenChange, category, onSaved }) {
  const queryClient = useQueryClient();
  const schema = category ? updateMenuCategorySchema : createMenuCategorySchema;
  const form = useForm({ resolver: zodResolver(schema), defaultValues: emptyCategory });

  useEffect(() => {
    form.reset(category ? { name: category.name, description: category.description ?? "" } : emptyCategory);
  }, [category, form, open]);

  const mutation = useMutation({
    mutationFn: (values) => (category ? updateMenuCategory(category.id, values) : createMenuCategory(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
      toast.success(category ? "Categoria atualizada" : "Categoria criada");
      onSaved();
      onOpenChange(false);
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <FormField error={form.formState.errors.name?.message} id="category-name" label="Nome">
            <Input id="category-name" placeholder="Pratos principais" {...form.register("name")} />
          </FormField>
          <FormField error={form.formState.errors.description?.message} id="category-description" label="Descrição">
            <Textarea id="category-description" placeholder="Descrição curta da categoria" {...form.register("description")} />
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

function ItemDialog({ open, onOpenChange, item, categories }) {
  const queryClient = useQueryClient();
  const schema = item ? updateMenuItemSchema : createMenuItemSchema;
  const form = useForm({ resolver: zodResolver(schema), defaultValues: emptyItem });
  const selectedCategoryId = form.watch("categoryId");
  const available = form.watch("available");

  useEffect(() => {
    form.reset(
      item
        ? {
            name: item.name,
            description: item.description ?? "",
            price: String(item.price),
            imageUrl: item.imageUrl ?? "",
            available: item.available,
            categoryId: item.categoryId
          }
        : {
            ...emptyItem,
            categoryId: categories[0]?.id ?? ""
          }
    );
  }, [categories, form, item, open]);

  const mutation = useMutation({
    mutationFn: (values) => (item ? updateMenuItem(item.id, values) : createMenuItem(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(item ? "Item atualizado" : "Item criado");
      onOpenChange(false);
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Editar item" : "Novo item"}</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField error={form.formState.errors.name?.message} id="item-name" label="Nome">
              <Input id="item-name" placeholder="Risoto da casa" {...form.register("name")} />
            </FormField>
            <FormField error={form.formState.errors.price?.message} id="item-price" label="Preço">
              <Input id="item-price" min="0" placeholder="49.90" step="0.01" type="number" {...form.register("price")} />
            </FormField>
          </div>
          <FormField error={form.formState.errors.categoryId?.message} id="item-category" label="Categoria">
            <Select onValueChange={(value) => form.setValue("categoryId", value, { shouldValidate: true })} value={selectedCategoryId}>
              <SelectTrigger id="item-category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField error={form.formState.errors.imageUrl?.message} id="item-image-url" label="URL da imagem">
            <Input id="item-image-url" placeholder="https://..." {...form.register("imageUrl")} />
          </FormField>
          <FormField error={form.formState.errors.description?.message} id="item-description" label="Descrição">
            <Textarea id="item-description" placeholder="Ingredientes e detalhes do item" {...form.register("description")} />
          </FormField>
          <label className="flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm">
            <input
              checked={Boolean(available)}
              className="h-4 w-4 accent-primary"
              onChange={(event) => form.setValue("available", event.target.checked, { shouldValidate: true })}
              type="checkbox"
            />
            <span>Disponível para venda</span>
          </label>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              Cancelar
            </Button>
            <Button disabled={mutation.isPending || categories.length === 0} type="submit">
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MenuPage() {
  const queryClient = useQueryClient();
  const customer = useAuthStore((state) => state.customer);
  const isAdmin = customer?.role === "ADMIN";
  const [activeTab, setActiveTab] = useState("items");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState(isAdmin ? "all" : "true");
  const [search, setSearch] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const categoriesQuery = useQuery({ queryKey: ["menu-categories"], queryFn: listMenuCategories });
  const itemsQuery = useQuery({
    queryKey: ["menu-items", { categoryFilter, availabilityFilter, search }],
    queryFn: () =>
      listMenuItems({
        categoryId: categoryFilter,
        available: availabilityFilter === "all" ? "all" : availabilityFilter === "true",
        search: search || undefined
      })
  });

  const categories = categoriesQuery.data ?? [];
  const items = itemsQuery.data ?? [];
  const categoryById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteMenuCategory,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["menu-categories"] }),
        queryClient.invalidateQueries({ queryKey: ["menu-items"] })
      ]);
      toast.success("Categoria removida");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const deleteItemMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Item removido");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  function openCategoryDialog(category) {
    setSelectedCategory(category ?? null);
    setCategoryDialogOpen(true);
  }

  function openItemDialog(item) {
    setSelectedItem(item ?? null);
    setItemDialogOpen(true);
  }

  function confirmDeleteCategory(category) {
    if (window.confirm(`Remover a categoria "${category.name}"?`)) {
      deleteCategoryMutation.mutate(category.id);
    }
  }

  function confirmDeleteItem(item) {
    if (window.confirm(`Remover o item "${item.name}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  }

  return (
    <>
      <PageHeader
        actions={
          isAdmin ? (
            <>
              <Button onClick={() => openCategoryDialog()} type="button" variant="outline">
                <Plus className="h-4 w-4" />
                Categoria
              </Button>
              <Button onClick={() => openItemDialog()} type="button">
                <Plus className="h-4 w-4" />
                Item
              </Button>
            </>
          ) : null
        }
        description={isAdmin ? "Organize categorias, preços, disponibilidade e URLs de imagem dos pratos." : "Escolha seus pratos favoritos para pedir no delivery."}
        eyebrow="Cardápio"
        title="Cardápio"
      />

      <Tabs onValueChange={setActiveTab} value={activeTab}>
        {isAdmin ? (
          <TabsList>
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
          </TabsList>
        ) : null}

        <TabsContent className="mt-5" value="items">
          <Card>
            <CardContent className="p-0">
              <div className={["grid gap-3 border-b p-4", isAdmin ? "md:grid-cols-[1fr_220px_180px]" : "md:grid-cols-[1fr_220px]"].join(" ")}>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar item" value={search} />
                </div>
                <Select onValueChange={setCategoryFilter} value={categoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isAdmin ? (
                  <Select onValueChange={setAvailabilityFilter} value={availabilityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Disponibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Disponíveis</SelectItem>
                      <SelectItem value="false">Indisponíveis</SelectItem>
                    </SelectContent>
                  </Select>
                ) : null}
              </div>

              {itemsQuery.isLoading ? (
                <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton className="h-64 w-full" key={index} />
                  ))}
                </div>
              ) : itemsQuery.isError ? (
                <div className="p-4">
                  <ErrorState onRetry={() => itemsQuery.refetch()} />
                </div>
              ) : items.length === 0 ? (
                <div className="p-4">
                  <EmptyState description="Nenhum item encontrado para os filtros atuais." title="Cardápio vazio" />
                </div>
              ) : (
                <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <article className="overflow-hidden rounded-lg border bg-card" key={item.id}>
                      <div className="aspect-[4/3] bg-muted">
                        <MenuImage item={item} />
                      </div>
                      <div className="grid gap-4 p-4">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="line-clamp-2 font-semibold">{item.name}</h3>
                            <span className="shrink-0 font-semibold text-primary">{formatCurrency(item.price)}</span>
                          </div>
                          <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted-foreground">{item.description ?? "Sem descrição"}</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{categoryById.get(item.categoryId)?.name ?? "Categoria"}</Badge>
                            {isAdmin ? <Badge variant={item.available ? "default" : "muted"}>{item.available ? "Disponível" : "Indisponível"}</Badge> : null}
                          </div>
                          {isAdmin ? (
                            <div className="flex gap-1">
                              <Button onClick={() => openItemDialog(item)} size="icon" type="button" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => confirmDeleteItem(item)} size="icon" type="button" variant="ghost">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin ? (
          <TabsContent className="mt-5" value="categories">
            <Card>
              <CardContent className="p-0">
                {categoriesQuery.isLoading ? (
                  <div className="grid gap-3 p-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton className="h-20 w-full" key={index} />
                    ))}
                  </div>
                ) : categoriesQuery.isError ? (
                  <div className="p-4">
                    <ErrorState onRetry={() => categoriesQuery.refetch()} />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-4">
                    <EmptyState
                      action={
                        <Button onClick={() => openCategoryDialog()} type="button">
                          <Plus className="h-4 w-4" />
                          Criar categoria
                        </Button>
                      }
                      description="As categorias ajudam a organizar o cardápio."
                      title="Sem categorias"
                    />
                  </div>
                ) : (
                  <div className="divide-y">
                    {categories.map((category) => (
                      <article className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between" key={category.id}>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{category.description ?? "Sem descrição"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => openCategoryDialog(category)} size="sm" type="button" variant="outline">
                            <Pencil className="h-4 w-4" />
                            Editar
                          </Button>
                          <Button onClick={() => confirmDeleteCategory(category)} size="sm" type="button" variant="outline">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            Remover
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ) : null}
      </Tabs>

      {isAdmin ? (
        <>
          <CategoryDialog category={selectedCategory} onOpenChange={setCategoryDialogOpen} onSaved={() => setActiveTab("categories")} open={categoryDialogOpen} />
          <ItemDialog categories={categories} item={selectedItem} onOpenChange={setItemDialogOpen} open={itemDialogOpen} />
        </>
      ) : null}
    </>
  );
}
