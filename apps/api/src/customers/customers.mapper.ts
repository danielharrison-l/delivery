import { Prisma } from "@prisma/client";
import type { CustomerCreateData, CustomerDto, CustomerRecord, CustomerUpdateData } from "./customers.types";

function toDto(customer: CustomerRecord): CustomerDto {
  return {
    ...customer,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString()
  };
}

function toCreateData(data: CustomerCreateData): Prisma.CustomerCreateInput {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    address: data.address || undefined
  };
}

function toUpdateData(data: CustomerUpdateData): Prisma.CustomerUpdateInput {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    address: data.address || undefined
  };
}

export const customersMapper = {
  toDto,
  toCreateData,
  toUpdateData
} as const;
