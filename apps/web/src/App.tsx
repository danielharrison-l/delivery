import { createUserSchema, type UserResponse } from "@repo/shared";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, getHealth, listUsers } from "./lib/api";

type FormState = {
  name: string;
  email: string;
};

const initialForm: FormState = {
  name: "",
  email: ""
};

export function App() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const initials = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        initials: user.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join("")
      })),
    [users]
  );

  async function refreshUsers() {
    setIsLoadingUsers(true);
    const nextUsers = await listUsers();
    setUsers(nextUsers);
    setIsLoadingUsers(false);
  }

  useEffect(() => {
    void getHealth()
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));

    void refreshUsers().catch(() => setIsLoadingUsers(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = createUserSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Dados inválidos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await createUser(parsed.data);
      setUsers((current) => [user, ...current]);
      setForm(initialForm);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Não foi possível criar o usuário.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteUser(id);
    setUsers((current) => current.filter((user) => user.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8">
        <header className="flex flex-col gap-5 border-b border-[#d8ddd2] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mint">Fullstack Monorepo</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Usuários</h1>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-md border border-[#c8d6cf] bg-white px-3 py-2 text-sm shadow-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                apiStatus === "online"
                  ? "bg-mint"
                  : apiStatus === "offline"
                    ? "bg-coral"
                    : "bg-[#c6b966]"
              }`}
            />
            <span className="font-medium">
              {apiStatus === "online" ? "API online" : apiStatus === "offline" ? "API offline" : "Verificando API"}
            </span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form className="h-fit rounded-md border border-[#d8ddd2] bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Novo usuário</h2>
            </div>

            <label className="grid gap-2 text-sm font-medium text-steel">
              Nome
              <input
                className="h-11 rounded-md border border-[#cbd5cd] px-3 text-base text-ink outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Ana Silva"
              />
            </label>

            <label className="mt-4 grid gap-2 text-sm font-medium text-steel">
              E-mail
              <input
                className="h-11 rounded-md border border-[#cbd5cd] px-3 text-base text-ink outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="ana@empresa.com"
                type="email"
              />
            </label>

            {formError ? (
              <p className="mt-4 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-[#9d3928]">
                {formError}
              </p>
            ) : null}

            <button
              className="mt-5 h-11 w-full rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-[#24314b] disabled:cursor-not-allowed disabled:bg-[#87909e]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Salvando..." : "Salvar usuário"}
            </button>
          </form>

          <div className="rounded-md border border-[#d8ddd2] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e2e6df] px-5 py-4">
              <h2 className="text-lg font-semibold">Lista</h2>
              <span className="rounded-md bg-[#edf4f1] px-2.5 py-1 text-sm font-medium text-mint">
                {users.length} registros
              </span>
            </div>

            <div className="divide-y divide-[#edf0ea]">
              {isLoadingUsers ? (
                <p className="px-5 py-6 text-sm text-steel">Carregando...</p>
              ) : initials.length === 0 ? (
                <p className="px-5 py-6 text-sm text-steel">Nenhum usuário cadastrado.</p>
              ) : (
                initials.map((user) => (
                  <article className="flex items-center gap-4 px-5 py-4" key={user.id}>
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#e7eee9] text-sm font-bold text-mint">
                      {user.initials || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{user.name}</h3>
                      <p className="truncate text-sm text-steel">{user.email}</p>
                    </div>
                    <button
                      className="h-9 rounded-md border border-[#d5dcd4] px-3 text-sm font-medium text-steel transition hover:border-coral hover:text-coral"
                      onClick={() => void handleDelete(user.id)}
                      type="button"
                    >
                      Remover
                    </button>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
