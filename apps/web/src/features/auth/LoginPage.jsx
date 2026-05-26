import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@repo/shared";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { FormField } from "../../components/ui/form-field";
import { Input } from "../../components/ui/input";
import { getApiErrorMessage, login } from "../../lib/api";
import { AuthShell } from "./AuthShell";
import { useAuthStore } from "./store";

const defaultValues = {
  email: "",
  password: ""
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = useAuthStore((state) => state.customer);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const redirectTo = location.state?.from?.pathname ?? "/app";
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Login realizado");
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
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
      description="Entre com seu e-mail e senha para acessar reservas, pedidos e dados do perfil."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link className="font-medium text-primary hover:underline" to="/cadastro">
            Criar cadastro
          </Link>
        </>
      }
      title="Acessar conta"
    >
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField error={form.formState.errors.email?.message} id="email" label="E-mail">
          <Input autoComplete="email" id="email" placeholder="seu@email.com" type="email" {...form.register("email")} />
        </FormField>
        <FormField error={form.formState.errors.password?.message} id="password" label="Senha">
          <Input autoComplete="current-password" id="password" placeholder="Sua senha" type="password" {...form.register("password")} />
        </FormField>
        <Button className="mt-2 w-full" disabled={mutation.isPending} type="submit">
          <LogIn className="h-4 w-4" />
          {mutation.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  );
}
