import { Prisma } from "@prisma/client";
import type {
  AuthCustomerRecord,
  AuthProfileUpdateData,
  AuthRegisterData,
  AuthSessionDto,
  AuthSessionWithRefreshToken,
  AuthenticatedCustomer
} from "./auth.types";

function toCustomerDto(customer: AuthCustomerRecord): AuthenticatedCustomer {
  return {
    ...customer,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString()
  };
}

function toCustomerCreateData(data: AuthRegisterData, passwordHash: string): Prisma.CustomerCreateInput {
  return {
    name: data.name,
    email: data.email,
    passwordHash,
    phone: data.phone || undefined
  };
}

function toCustomerUpdateData(data: AuthProfileUpdateData): Prisma.CustomerUpdateInput {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    address: data.address || null
  };
}

function toSessionDto(customer: AuthCustomerRecord, accessToken: string): AuthSessionDto {
  return {
    customer: toCustomerDto(customer),
    accessToken
  };
}

function toSessionWithRefreshTokenDto(
  customer: AuthCustomerRecord,
  accessToken: string,
  refreshToken: string
): AuthSessionWithRefreshToken {
  return {
    ...toSessionDto(customer, accessToken),
    refreshToken
  };
}

export const authMapper = {
  toCustomerDto,
  toCustomerCreateData,
  toCustomerUpdateData,
  toSessionDto,
  toSessionWithRefreshTokenDto
} as const;
