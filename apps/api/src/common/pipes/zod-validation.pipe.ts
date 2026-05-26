import { BadRequestException, Injectable, type PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";
import { apiErrorCodes } from "../errors/api-error.constants";
import { mapZodIssueMessage } from "./zod-error.mapper";

@Injectable()
export class ZodValidationPipe<TInput, TOutput> implements PipeTransform<TInput, TOutput> {
  constructor(private readonly schema: ZodType<TOutput>) {}

  transform(value: TInput): TOutput {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const fieldErrors = result.error.issues.reduce<Record<string, string[]>>((errors, issue) => {
        const field = String(issue.path[0] ?? "form");
        const messages = errors[field] ?? [];

        return {
          ...errors,
          [field]: [...messages, mapZodIssueMessage(issue)]
        };
      }, {});

      throw new BadRequestException({
        code: apiErrorCodes.validation,
        message: "Validation failed",
        errors: {
          fieldErrors
        }
      });
    }

    return result.data;
  }
}
