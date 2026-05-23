import { Injectable } from "@nestjs/common";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { authConstants } from "./auth.constants";
import type { AuthAccessTokenPayload, AuthCustomerRecord } from "./auth.types";

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

type UnknownRecord = Record<string, unknown>;

@Injectable()
export class AuthTokenService {
  createAccessToken(customer: AuthCustomerRecord): string {
    const issuedAt = this.getNowInSeconds();
    const payload: AuthAccessTokenPayload = {
      sub: customer.id,
      email: customer.email,
      type: "access",
      iat: issuedAt,
      exp: issuedAt + authConstants.accessTokenExpiresInSeconds
    };
    const header: JwtHeader = { alg: "HS256", typ: "JWT" };
    const encodedHeader = this.encodeJson(header);
    const encodedPayload = this.encodeJson(payload);
    const signature = this.sign(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verifyAccessToken(token: string): AuthAccessTokenPayload | null {
    const [encodedHeader, encodedPayload, signature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);

    if (!this.safeCompare(signature, expectedSignature)) {
      return null;
    }

    const header = this.decodeJson(encodedHeader);
    const payload = this.decodeJson(encodedPayload);

    if (!this.isJwtHeader(header) || !this.isAccessTokenPayload(payload)) {
      return null;
    }

    if (payload.exp <= this.getNowInSeconds()) {
      return null;
    }

    return payload;
  }

  createRefreshToken(): string {
    return randomBytes(authConstants.refreshTokenByteLength).toString("base64url");
  }

  hashRefreshToken(refreshToken: string): string {
    return createHash("sha256").update(refreshToken).digest("hex");
  }

  createRefreshTokenExpiresAt(): Date {
    return new Date(Date.now() + authConstants.refreshTokenExpiresInSeconds * 1000);
  }

  private encodeJson(value: JwtHeader | AuthAccessTokenPayload): string {
    return Buffer.from(JSON.stringify(value)).toString("base64url");
  }

  private decodeJson(value: string): unknown {
    try {
      return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as unknown;
    } catch {
      return null;
    }
  }

  private sign(value: string): string {
    return createHmac("sha256", authConstants.accessTokenSecret).update(value).digest("base64url");
  }

  private safeCompare(value: string, expected: string): boolean {
    const valueBuffer = Buffer.from(value);
    const expectedBuffer = Buffer.from(expected);

    if (valueBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(valueBuffer, expectedBuffer);
  }

  private getNowInSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  private isJwtHeader(value: unknown): value is JwtHeader {
    return this.isRecord(value) && value.alg === "HS256" && value.typ === "JWT";
  }

  private isAccessTokenPayload(value: unknown): value is AuthAccessTokenPayload {
    return (
      this.isRecord(value) &&
      typeof value.sub === "string" &&
      typeof value.email === "string" &&
      value.type === "access" &&
      typeof value.iat === "number" &&
      typeof value.exp === "number"
    );
  }

  private isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null;
  }
}
