import { Prisma } from "@prisma/client";

export const customerAddressSelect = {
  id: true,
  label: true,
  street: true,
  number: true,
  neighborhood: true,
  city: true,
  state: true,
  zipCode: true,
  complement: true,
  isDefault: true,
  customerId: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.CustomerAddressSelect;
