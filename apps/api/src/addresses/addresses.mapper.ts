import { Prisma } from "@prisma/client";
import type {
  CustomerAddressCreateData,
  CustomerAddressDto,
  CustomerAddressRecord,
  CustomerAddressUpdateData
} from "./addresses.types";

function toDto(address: CustomerAddressRecord): CustomerAddressDto {
  return {
    ...address,
    createdAt: address.createdAt.toISOString(),
    updatedAt: address.updatedAt.toISOString()
  };
}

function toCreateData(customerId: string, data: CustomerAddressCreateData): Prisma.CustomerAddressCreateInput {
  return {
    label: data.label,
    street: data.street,
    number: data.number,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state.toUpperCase(),
    zipCode: data.zipCode || undefined,
    complement: data.complement || undefined,
    isDefault: data.isDefault ?? false,
    customer: {
      connect: { id: customerId }
    }
  };
}

function toUpdateData(data: CustomerAddressUpdateData): Prisma.CustomerAddressUpdateInput {
  return {
    label: data.label,
    street: data.street,
    number: data.number,
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state?.toUpperCase(),
    zipCode: data.zipCode === undefined ? undefined : data.zipCode || null,
    complement: data.complement === undefined ? undefined : data.complement || null,
    isDefault: data.isDefault
  };
}

function toSingleLine(address: CustomerAddressRecord): string {
  const complement = address.complement ? `, ${address.complement}` : "";
  const zipCode = address.zipCode ? ` - ${address.zipCode}` : "";

  return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city}/${address.state}${zipCode}`;
}

export const addressesMapper = {
  toDto,
  toCreateData,
  toUpdateData,
  toSingleLine
} as const;
