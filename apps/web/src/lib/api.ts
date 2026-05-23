import {
  authSessionSchema,
  createCustomerSchema,
  healthSchema,
  loginSchema,
  registerSchema,
  type AuthSessionResponse,
  type CreateCustomerInput,
  type HealthResponse,
  type CustomerResponse,
  type LoginInput,
  type RegisterInput,
  customerSchema,
  paginatedCustomersSchema
} from "@repo/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

async function request<T>(path: string, schema: { parse: (value: unknown) => T }, init?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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

export async function register(input: RegisterInput): Promise<AuthSessionResponse> {
  const data = registerSchema.parse(input);
  const session = await request("/auth/register", authSessionSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });

  setAccessToken(session.accessToken);

  return session;
}

export async function login(input: LoginInput): Promise<AuthSessionResponse> {
  const data = loginSchema.parse(input);
  const session = await request("/auth/login", authSessionSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });

  setAccessToken(session.accessToken);

  return session;
}

export async function refreshSession(): Promise<AuthSessionResponse> {
  const session = await request("/auth/refresh", authSessionSchema, {
    method: "POST"
  });

  setAccessToken(session.accessToken);

  return session;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    }
  });

  setAccessToken(null);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? "Request failed");
  }
}

export function getHealth(): Promise<HealthResponse> {
  return request("/health", healthSchema);
}

export function listCustomers(): Promise<CustomerResponse[]> {
  return request("/customers", paginatedCustomersSchema).then((response) => response.data);
}

export function createCustomer(input: CreateCustomerInput): Promise<CustomerResponse> {
  const data = createCustomerSchema.parse(input);

  return request("/customers", customerSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message ?? "Request failed");
  }
}
