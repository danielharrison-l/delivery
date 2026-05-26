import {
  authSessionSchema,
  customerSchema,
  deliveryOrderSchema,
  healthSchema,
  menuCategoriesSchema,
  menuCategorySchema,
  menuItemSchema,
  menuItemsSchema,
  paginatedCustomersSchema,
  paginatedDeliveryOrdersSchema,
  paginatedReservationsSchema,
  reservationSchema
} from "@repo/shared";
import { useAuthStore } from "../features/auth/store";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

const GENERIC_ERROR_MESSAGE = "Não foi possível completar a solicitação agora. Tente novamente em instantes.";
const CONNECTION_ERROR_MESSAGE = "Não foi possível conectar ao servidor. Tente novamente em instantes.";

const errorMessagesByCode = {
  VALIDATION_ERROR: "Confira os dados informados.",
  BAD_REQUEST: "Não foi possível processar a solicitação.",
  UNAUTHORIZED: "Faça login para continuar.",
  FORBIDDEN: "Você não tem permissão para realizar esta ação.",
  NOT_FOUND: "Registro não encontrado.",
  CONFLICT: "Já existe um registro com estes dados.",
  INTERNAL_SERVER_ERROR: GENERIC_ERROR_MESSAGE,
  AUTH_INVALID_CREDENTIALS: "E-mail ou senha inválidos.",
  AUTH_INVALID_SESSION: "Sua sessão expirou. Faça login novamente.",
  AUTH_MISSING_ACCESS_TOKEN: "Faça login para continuar.",
  AUTH_CUSTOMER_NOT_FOUND: "Não foi possível localizar sua conta.",
  AUTH_ADMIN_ONLY: "Você não tem permissão para acessar esta área.",
  CUSTOMER_NOT_FOUND: "Cliente não encontrado.",
  CUSTOMER_EMAIL_ALREADY_EXISTS: "Já existe um cliente com este e-mail.",
  MENU_CATEGORY_NOT_FOUND: "Categoria não encontrada.",
  MENU_CATEGORY_ALREADY_EXISTS: "Já existe uma categoria com este nome.",
  MENU_ITEM_NOT_FOUND: "Item do cardápio não encontrado.",
  RESERVATION_NOT_FOUND: "Reserva não encontrada.",
  RESERVATION_CUSTOMER_NOT_FOUND: "Cliente não encontrado.",
  DELIVERY_NOT_FOUND: "Pedido não encontrado.",
  DELIVERY_CUSTOMER_NOT_FOUND: "Cliente não encontrado.",
  DELIVERY_UNAVAILABLE_ITEMS: "Um ou mais itens estão indisponíveis."
};

const fallbackMessagesByStatus = {
  400: "Confira os dados informados.",
  401: "Faça login para continuar.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "Registro não encontrado.",
  409: "Já existe um registro com estes dados."
};

const legacyMessages = {
  "Invalid email or password.": "E-mail ou senha inválidos.",
  "Too small: expected string to have >=1 characters": "Preencha este campo.",
  "Invalid input: expected string, received undefined": "Preencha todos os campos obrigatórios.",
  "Validation failed": "Confira os dados informados."
};

function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

async function parseError(response) {
  if (response.status >= 500) {
    return GENERIC_ERROR_MESSAGE;
  }

  const error = await response.json().catch(() => ({}));
  const fieldErrors = error.errors?.fieldErrors;

  if (fieldErrors && typeof fieldErrors === "object") {
    const firstError = Object.values(fieldErrors).flat().find(Boolean);

    if (firstError) {
      return translateError(String(firstError));
    }
  }

  if (typeof error.code === "string" && errorMessagesByCode[error.code]) {
    return errorMessagesByCode[error.code];
  }

  const message = Array.isArray(error.message) ? error.message.find(Boolean) : error.message;

  if (typeof message === "string" && legacyMessages[message]) {
    return legacyMessages[message];
  }

  return fallbackMessagesByStatus[response.status] ?? GENERIC_ERROR_MESSAGE;
}

async function request(path, { schema, method = "GET", body, auth = false, retry = true } = {}) {
  const accessToken = getAccessToken();
  const headers = {
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
  };
  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined
  }).catch(() => {
    throw new Error(CONNECTION_ERROR_MESSAGE);
  });

  if (response.status === 401 && auth && retry) {
    const refreshed = await refreshSession().catch(() => null);

    if (refreshed) {
      return request(path, { schema, method, body, auth, retry: false });
    }
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined;
  }

  const data = await response.json();
  return schema ? schema.parse(data) : data;
}

export function getHealth() {
  return request("/health", { schema: healthSchema });
}

export async function register(data) {
  const session = await request("/auth/register", { schema: authSessionSchema, method: "POST", body: data });
  useAuthStore.getState().setSession(session);
  return session;
}

export async function login(data) {
  const session = await request("/auth/login", { schema: authSessionSchema, method: "POST", body: data });
  useAuthStore.getState().setSession(session);
  return session;
}

export async function refreshSession() {
  const session = await request("/auth/refresh", { schema: authSessionSchema, method: "POST", retry: false });
  useAuthStore.getState().setSession(session);
  return session;
}

export async function logout() {
  await request("/auth/logout", { method: "POST", auth: true, retry: false }).catch(() => undefined);
  useAuthStore.getState().clearSession();
}

export function getMe() {
  return request("/auth/me", { schema: customerSchema, auth: true });
}

export async function updateProfile(data) {
  const customer = await request("/auth/me", { schema: customerSchema, method: "PATCH", body: data, auth: true });
  useAuthStore.getState().setCustomer(customer);
  return customer;
}

export function listCustomers(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/customers${suffix}`, { schema: paginatedCustomersSchema, auth: true });
}

export function createCustomer(data) {
  return request("/customers", { schema: customerSchema, method: "POST", body: data, auth: true });
}

export function updateCustomer(id, data) {
  return request(`/customers/${id}`, { schema: customerSchema, method: "PATCH", body: data, auth: true });
}

export function deleteCustomer(id) {
  return request(`/customers/${id}`, { method: "DELETE", auth: true });
}

export function listMenuCategories() {
  return request("/menu/categories", { schema: menuCategoriesSchema });
}

export function createMenuCategory(data) {
  return request("/menu/categories", { schema: menuCategorySchema, method: "POST", body: data, auth: true });
}

export function updateMenuCategory(id, data) {
  return request(`/menu/categories/${id}`, { schema: menuCategorySchema, method: "PATCH", body: data, auth: true });
}

export function deleteMenuCategory(id) {
  return request(`/menu/categories/${id}`, { method: "DELETE", auth: true });
}

export function listMenuItems(params = {}) {
  const query = new URLSearchParams();
  if (params.categoryId && params.categoryId !== "all") query.set("categoryId", params.categoryId);
  if (params.available !== undefined && params.available !== "all") query.set("available", String(params.available));
  if (params.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/menu/items${suffix}`, { schema: menuItemsSchema });
}

export function createMenuItem(data) {
  return request("/menu/items", { schema: menuItemSchema, method: "POST", body: data, auth: true });
}

export function updateMenuItem(id, data) {
  return request(`/menu/items/${id}`, { schema: menuItemSchema, method: "PATCH", body: data, auth: true });
}

export function deleteMenuItem(id) {
  return request(`/menu/items/${id}`, { method: "DELETE", auth: true });
}

export function listReservations(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.date) query.set("date", params.date);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/reservations${suffix}`, { schema: paginatedReservationsSchema, auth: true });
}

export function createReservation(data) {
  return request("/reservations", { schema: reservationSchema, method: "POST", body: data, auth: true });
}

export function updateReservationStatus(id, data) {
  return request(`/reservations/${id}/status`, { schema: reservationSchema, method: "PATCH", body: data, auth: true });
}

export function deleteReservation(id) {
  return request(`/reservations/${id}`, { method: "DELETE", auth: true });
}

export function listDeliveryOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status && params.status !== "all") query.set("status", params.status);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/delivery/orders${suffix}`, { schema: paginatedDeliveryOrdersSchema, auth: true });
}

export function createDeliveryOrder(data) {
  return request("/delivery/orders", { schema: deliveryOrderSchema, method: "POST", body: data, auth: true });
}

export function updateDeliveryOrderStatus(id, data) {
  return request(`/delivery/orders/${id}/status`, { schema: deliveryOrderSchema, method: "PATCH", body: data, auth: true });
}

export function deleteDeliveryOrder(id) {
  return request(`/delivery/orders/${id}`, { method: "DELETE", auth: true });
}
