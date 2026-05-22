import {
  createUserSchema,
  healthSchema,
  type CreateUserInput,
  type HealthResponse,
  type UserResponse,
  userSchema,
  usersSchema
} from "@repo/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

async function request<T>(path: string, schema: { parse: (value: unknown) => T }, init?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    ...init
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? "Request failed");
  }

  return schema.parse(await response.json());
}

export function getHealth(): Promise<HealthResponse> {
  return request("/health", healthSchema);
}

export function listUsers(): Promise<UserResponse[]> {
  return request("/users", usersSchema);
}

export function createUser(input: CreateUserInput): Promise<UserResponse> {
  const data = createUserSchema.parse(input);

  return request("/users", userSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function deleteUser(id: string): Promise<void> {
  await request(`/users/${id}`, { parse: () => ({ id }) }, { method: "DELETE" });
}
