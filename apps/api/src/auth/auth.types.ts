import type {
  AuthenticatedCustomerResponse,
  AuthSessionResponse,
  LoginInput,
  RegisterInput
} from "@repo/shared";
import type { Prisma } from "@prisma/client";
import type { authCustomerSelect, authCustomerWithPasswordSelect, refreshTokenSelect } from "./auth.constants";

export type AuthRegisterData = RegisterInput;
export type AuthLoginData = LoginInput;
export type AuthenticatedCustomer = AuthenticatedCustomerResponse;
export type AuthSessionDto = AuthSessionResponse;
export type AuthSessionWithRefreshToken = AuthSessionDto & {
  refreshToken: string;
};

export type AuthCustomerRecord = Prisma.CustomerGetPayload<{
  select: typeof authCustomerSelect;
}>;

export type AuthCustomerWithPasswordRecord = Prisma.CustomerGetPayload<{
  select: typeof authCustomerWithPasswordSelect;
}>;

export type RefreshTokenRecord = Prisma.RefreshTokenGetPayload<{
  select: typeof refreshTokenSelect;
}>;

export type RefreshTokenCreateData = {
  customerId: string;
  tokenHash: string;
  expiresAt: Date;
};

export type AuthAccessTokenPayload = {
  sub: string;
  email: string;
  type: "access";
  iat: number;
  exp: number;
};
