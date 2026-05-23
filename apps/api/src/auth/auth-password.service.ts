import { Injectable } from "@nestjs/common";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { authConstants } from "./auth.constants";

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthPasswordService {
  async hash(password: string): Promise<string> {
    const salt = randomBytes(authConstants.passwordSaltByteLength).toString("hex");
    const key = await this.deriveKey(password, salt);

    return `scrypt$${salt}$${key}`;
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    const [algorithm, salt, storedKey] = passwordHash.split("$");

    if (algorithm !== "scrypt" || !salt || !storedKey) {
      return false;
    }

    const key = await this.deriveKey(password, salt);
    const storedBuffer = Buffer.from(storedKey, "hex");
    const keyBuffer = Buffer.from(key, "hex");

    if (storedBuffer.length !== keyBuffer.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, keyBuffer);
  }

  private async deriveKey(password: string, salt: string): Promise<string> {
    const key = (await scryptAsync(password, salt, authConstants.passwordKeyLength)) as Buffer;

    return Buffer.from(key).toString("hex");
  }
}
