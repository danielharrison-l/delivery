import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerAddressSchema, updateProfileSchema } from "@repo/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Home, MapPin, Save, Star, Trash2, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmptyState } from "../../components/layout/EmptyState";
import { ErrorState } from "../../components/layout/ErrorState";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { createAddress, deleteAddress, getApiErrorMessage, listAddresses, setDefaultAddress, updateProfile } from "../../lib/api";
import { useAuthStore } from "../auth/store";

function toProfileValues(customer) {
  return {
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? ""
  };
}

const addressDefaultValues = {
  label: "Casa",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  complement: "",
  isDefault: true
};

function formatAddress(address) {
  const complement = address.complement ? `, ${address.complement}` : "";
  const zipCode = address.zipCode ? ` - ${address.zipCode}` : "";
  return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city}/${address.state}${zipCode}`;
}

export function ProfilePage() {
  const queryClient = useQueryClient();
  const customer = useAuthStore((state) => state.customer);
  const profileForm = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: toProfileValues(customer)
  });
  const addressForm = useForm({
    resolver: zodResolver(createCustomerAddressSchema),
    defaultValues: addressDefaultValues
  });

  useEffect(() => {
    profileForm.reset(toProfileValues(customer));
  }, [customer, profileForm]);

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: listAddresses
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Perfil atualizado");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });

  const createAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-home"] });
      addressForm.reset(addressDefaultValues);
      toast.success("Endereço salvo");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const defaultAddressMutation = useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-home"] });
      toast.success("Endereço padrão atualizado");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-home"] });
      toast.success("Endereço removido");
    },
    onError: (error) => toast.error(getApiErrorMessage(error))
  });

  function handleProfileSubmit(values) {
    profileMutation.mutate(values);
  }

  function handleAddressSubmit(values) {
    createAddressMutation.mutate(values);
  }

  function confirmDelete(address) {
    if (window.confirm(`Remover o endereço ${address.label}?`)) {
      deleteAddressMutation.mutate(address.id);
    }
  }

  const addresses = addressesQuery.data ?? [];

  return (
    <>
      <PageHeader
        description="Atualize seus dados pessoais e mantenha endereços salvos para pedidos de delivery."
        eyebrow="Conta"
        title="Meu perfil"
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                Dados pessoais
              </CardTitle>
              <CardDescription>Essas informações identificam sua conta no Terraço Bistrô.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField error={profileForm.formState.errors.name?.message} id="profile-name" label="Nome">
                <Input autoComplete="name" id="profile-name" placeholder="Seu nome" {...profileForm.register("name")} />
              </FormField>
              <FormField error={profileForm.formState.errors.email?.message} id="profile-email" label="E-mail">
                <Input autoComplete="email" id="profile-email" placeholder="seu@email.com" type="email" {...profileForm.register("email")} />
              </FormField>
              <FormField error={profileForm.formState.errors.phone?.message} id="profile-phone" label="Telefone">
                <Input autoComplete="tel" id="profile-phone" placeholder="11999999999" {...profileForm.register("phone")} />
              </FormField>
              <Button className="w-fit" disabled={profileMutation.isPending} type="submit">
                <Save className="h-4 w-4" />
                {profileMutation.isPending ? "Salvando..." : "Salvar dados"}
              </Button>
            </CardContent>
          </Card>
        </form>

        <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Novo endereço
              </CardTitle>
              <CardDescription>Use um endereço completo para agilizar pedidos futuros.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField error={addressForm.formState.errors.label?.message} id="address-label" label="Apelido">
                  <Input id="address-label" placeholder="Casa" {...addressForm.register("label")} />
                </FormField>
                <FormField error={addressForm.formState.errors.zipCode?.message} id="address-zipcode" label="CEP">
                  <Input autoComplete="postal-code" id="address-zipcode" placeholder="00000-000" {...addressForm.register("zipCode")} />
                </FormField>
              </div>
              <FormField error={addressForm.formState.errors.street?.message} id="address-street" label="Rua">
                <Input autoComplete="address-line1" id="address-street" placeholder="Nome da rua" {...addressForm.register("street")} />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                <FormField error={addressForm.formState.errors.number?.message} id="address-number" label="Número">
                  <Input id="address-number" placeholder="123" {...addressForm.register("number")} />
                </FormField>
                <FormField error={addressForm.formState.errors.complement?.message} id="address-complement" label="Complemento">
                  <Input autoComplete="address-line2" id="address-complement" placeholder="Apto, bloco, referência" {...addressForm.register("complement")} />
                </FormField>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_80px]">
                <FormField error={addressForm.formState.errors.neighborhood?.message} id="address-neighborhood" label="Bairro">
                  <Input id="address-neighborhood" placeholder="Bairro" {...addressForm.register("neighborhood")} />
                </FormField>
                <FormField error={addressForm.formState.errors.city?.message} id="address-city" label="Cidade">
                  <Input autoComplete="address-level2" id="address-city" placeholder="Cidade" {...addressForm.register("city")} />
                </FormField>
                <FormField error={addressForm.formState.errors.state?.message} id="address-state" label="UF">
                  <Input autoComplete="address-level1" id="address-state" placeholder="SP" {...addressForm.register("state")} />
                </FormField>
              </div>
              <Button disabled={createAddressMutation.isPending} type="submit">
                <Home className="h-4 w-4" />
                {createAddressMutation.isPending ? "Salvando..." : "Salvar endereço"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Endereços salvos</CardTitle>
          <CardDescription>O endereço padrão aparece na home e é usado como sugestão no delivery.</CardDescription>
        </CardHeader>
        <CardContent>
          {addressesQuery.isLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="h-28 rounded-lg bg-muted" />
              <div className="h-28 rounded-lg bg-muted" />
            </div>
          ) : addressesQuery.isError ? (
            <ErrorState onRetry={() => addressesQuery.refetch()} />
          ) : addresses.length === 0 ? (
            <EmptyState description="Cadastre seu primeiro endereço para pedir delivery com menos etapas." title="Nenhum endereço salvo" />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {addresses.map((address) => (
                <article className="grid gap-4 rounded-lg border bg-background p-4" key={address.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{address.label}</h3>
                        {address.isDefault ? <Badge>Principal</Badge> : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{formatAddress(address)}</p>
                    </div>
                    <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button disabled={address.isDefault || defaultAddressMutation.isPending} onClick={() => defaultAddressMutation.mutate(address.id)} size="sm" type="button" variant="outline">
                      <Star className="h-4 w-4" />
                      Tornar padrão
                    </Button>
                    <Button disabled={deleteAddressMutation.isPending} onClick={() => confirmDelete(address)} size="sm" type="button" variant="ghost">
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
    </>
  );
}
