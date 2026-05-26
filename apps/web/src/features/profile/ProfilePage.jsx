import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@repo/shared";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Save, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { getApiErrorMessage, updateProfile } from "../../lib/api";
import { useAuthStore } from "../auth/store";

function toProfileValues(customer) {
  return {
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    address: customer?.address ?? ""
  };
}

export function ProfilePage() {
  const customer = useAuthStore((state) => state.customer);
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: toProfileValues(customer)
  });

  useEffect(() => {
    form.reset(toProfileValues(customer));
  }, [customer, form]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Perfil atualizado");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });

  function handleSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <>
      <PageHeader
        description="Atualize seus dados pessoais e mantenha um endereço padrão para pedidos de delivery."
        eyebrow="Conta"
        title="Meu perfil"
      />

      <form className="grid gap-5 lg:grid-cols-[1fr_360px]" onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              Dados pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField error={form.formState.errors.name?.message} id="profile-name" label="Nome">
              <Input autoComplete="name" id="profile-name" placeholder="Seu nome" {...form.register("name")} />
            </FormField>
            <FormField error={form.formState.errors.email?.message} id="profile-email" label="E-mail">
              <Input autoComplete="email" id="profile-email" placeholder="seu@email.com" type="email" {...form.register("email")} />
            </FormField>
            <FormField error={form.formState.errors.phone?.message} id="profile-phone" label="Telefone">
              <Input autoComplete="tel" id="profile-phone" placeholder="11999999999" {...form.register("phone")} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Endereço padrão
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField error={form.formState.errors.address?.message} id="profile-address" label="Endereço para delivery">
              <Input
                autoComplete="street-address"
                id="profile-address"
                placeholder="Rua, número, bairro e complemento"
                {...form.register("address")}
              />
            </FormField>
            <Button disabled={mutation.isPending} type="submit">
              <Save className="h-4 w-4" />
              {mutation.isPending ? "Salvando..." : "Salvar perfil"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </>
  );
}
