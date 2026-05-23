import { InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { prismaErrorLogMessages } from "./prisma-error.constants";
import type { PrismaErrorHandlerOptions, PrismaKnownErrorCode } from "./prisma-error.types";

const prismaKnownErrorCodes = new Set<string>(["P2002", "P2003", "P2025"]);

function isPrismaKnownErrorCode(code: string): code is PrismaKnownErrorCode {
  return prismaKnownErrorCodes.has(code);
}

export function handlePrismaError(error: unknown, options: PrismaErrorHandlerOptions): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && isPrismaKnownErrorCode(error.code)) {
    const exceptionFactory = options.knownErrors[error.code];

    if (exceptionFactory) {
      options.logger.warn(`${options.context}: ${prismaErrorLogMessages.known} ${error.code}`);
      throw exceptionFactory(error);
    }
  }

  if (error instanceof Error) {
    options.logger.error(`${options.context}: ${prismaErrorLogMessages.unexpected}`, error.stack);
    throw new InternalServerErrorException();
  }

  options.logger.error(`${options.context}: ${prismaErrorLogMessages.unexpected}`);
  throw new InternalServerErrorException();
}
