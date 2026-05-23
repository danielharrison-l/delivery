import type { Logger } from "@nestjs/common";
import type { Prisma } from "@prisma/client";

export type PrismaKnownErrorCode = "P2002" | "P2003" | "P2025";

export type PrismaExceptionFactory = (error: Prisma.PrismaClientKnownRequestError) => Error;

export type PrismaErrorMap = Partial<Record<PrismaKnownErrorCode, PrismaExceptionFactory>>;

export type PrismaErrorHandlerOptions = {
  context: string;
  logger: Logger;
  knownErrors: PrismaErrorMap;
};
