import { Prisma } from "@prisma/client";

export const customerSearchMode = Prisma.QueryMode.insensitive;

export const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  address: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.CustomerSelect;
