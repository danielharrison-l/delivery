import { Prisma } from "@prisma/client";

export const authConstants = {
  accessTokenExpiresInSeconds: Number(process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS ?? 900),
  refreshTokenExpiresInSeconds: Number(process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN_SECONDS ?? 604800),
  accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET ?? "development-access-token-secret",
  refreshTokenCookieName: "refreshToken",
  refreshTokenCookiePath: "/api/auth",
  refreshTokenByteLength: 64,
  passwordSaltByteLength: 16,
  passwordKeyLength: 64
} as const;

export const authRefreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || process.env.AUTH_REFRESH_TOKEN_COOKIE_SECURE === "true",
  sameSite: "lax",
  path: authConstants.refreshTokenCookiePath,
  maxAge: authConstants.refreshTokenExpiresInSeconds * 1000
} as const;

export const authClearRefreshTokenCookieOptions = {
  httpOnly: authRefreshTokenCookieOptions.httpOnly,
  secure: authRefreshTokenCookieOptions.secure,
  sameSite: authRefreshTokenCookieOptions.sameSite,
  path: authRefreshTokenCookieOptions.path
} as const;

export const authCustomerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  address: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.CustomerSelect;

export const authCustomerWithPasswordSelect = {
  ...authCustomerSelect,
  passwordHash: true
} satisfies Prisma.CustomerSelect;

export const refreshTokenSelect = {
  id: true,
  tokenHash: true,
  expiresAt: true,
  revokedAt: true,
  replacedByTokenId: true,
  createdAt: true,
  customerId: true
} satisfies Prisma.RefreshTokenSelect;
