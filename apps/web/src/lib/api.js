import {
  authSessionSchema,
  createCustomerSchema,
  healthSchema,
  loginSchema,
  registerSchema,
  customerSchema,
  paginatedCustomersSchema
} from "@repo/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

async function request(path, schema, init) {
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

export async function register(input) {
  const data = registerSchema.parse(input);
  const session = await request("/auth/register", authSessionSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });

  setAccessToken(session.accessToken);

  return session;
}

export async function login(input) {
  const data = loginSchema.parse(input);
  const session = await request("/auth/login", authSessionSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });

  setAccessToken(session.accessToken);

  return session;
}

export async function refreshSession() {
  const session = await request("/auth/refresh", authSessionSchema, {
    method: "POST"
  });

  setAccessToken(session.accessToken);

  return session;
}

export async function logout() {
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

export function getHealth() {
  return request("/health", healthSchema);
}

export function listCustomers() {
  return request("/customers", paginatedCustomersSchema).then((response) => response.data);
}

export function createCustomer(input) {
  const data = createCustomerSchema.parse(input);

  return request("/customers", customerSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function deleteCustomer(id) {
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
