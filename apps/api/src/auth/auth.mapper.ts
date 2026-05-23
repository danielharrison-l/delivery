import { Prisma } from "@prisma/client";
import type {
  AuthCustomerRecord,
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
    phone: data.phone || undefined,
    address: data.address || undefined
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
  toSessionDto,
  toSessionWithRefreshTokenDto
} as const;
