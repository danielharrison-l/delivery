import {
  createCustomerSchema,
  healthSchema,
  type CreateCustomerInput,
  type HealthResponse,
  type CustomerResponse,
  customerSchema,
  customersSchema
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

export function listCustomers(): Promise<CustomerResponse[]> {
  return request("/customers", customersSchema);
}

export function createCustomer(input: CreateCustomerInput): Promise<CustomerResponse> {
  const data = createCustomerSchema.parse(input);

  return request("/customers", customerSchema, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  await request(`/customers/${id}`, { parse: () => ({ id }) }, { method: "DELETE" });
}
