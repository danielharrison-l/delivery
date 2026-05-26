import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@repo/shared";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { register } from "../../lib/api";
import { AuthShell } from "./AuthShell";
import { useAuthStore } from "./store";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  phone: ""
};

export function RegisterPage() {
  const navigate = useNavigate();
  const customer = useAuthStore((state) => state.customer);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const form = useForm({ resolver: zodResolver(registerSchema), defaultValues });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Cadastro criado");
      navigate("/app", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (isBootstrapped && customer) {
    return <Navigate replace to="/app" />;
  }

  function handleSubmit(values) {
    mutation.mutate(values);
  }

  return (
    <AuthShell
      description="Crie sua conta para fazer reservas, pedir delivery e acompanhar tudo pelo painel."
      footer={
        <>
          Já tem uma conta?{" "}
          <Link className="font-medium text-primary hover:underline" to="/login">
            Entrar
          </Link>
        </>
      }
      title="Criar cadastro"
    >
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField error={form.formState.errors.name?.message} id="name" label="Nome">
          <Input autoComplete="name" id="name" placeholder="Seu nome" {...form.register("name")} />
        </FormField>
        <FormField error={form.formState.errors.email?.message} id="email" label="E-mail">
          <Input autoComplete="email" id="email" placeholder="voce@email.com" type="email" {...form.register("email")} />
        </FormField>
        <FormField error={form.formState.errors.password?.message} id="password" label="Senha">
          <Input autoComplete="new-password" id="password" placeholder="Mínimo de 8 caracteres" type="password" {...form.register("password")} />
        </FormField>
        <FormField error={form.formState.errors.phone?.message} id="phone" label="Telefone">
          <Input autoComplete="tel" id="phone" placeholder="11999999999" {...form.register("phone")} />
        </FormField>
        <Button className="mt-2 w-full" disabled={mutation.isPending} type="submit">
          <UserPlus className="h-4 w-4" />
          {mutation.isPending ? "Criando..." : "Criar conta"}
        </Button>
      </form>
    </AuthShell>
  );
}
