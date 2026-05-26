import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter
} from "@nestjs/common";
import {
  apiErrorCodes,
  publicErrorCodeByMessage,
  publicErrorMessages
} from "./api-error.constants";

type FieldErrors = Record<string, string[]>;

type ErrorResponseBody = {
  code: string;
  message: string;
  statusCode: number;
  errors?: {
    fieldErrors: FieldErrors;
  };
};

type HttpResponse = {
  status(statusCode: number): {
    json(body: ErrorResponseBody): void;
  };
};

type HttpRequest = {
  method?: string;
  url?: string;
};

type ExceptionResponse = {
  message?: unknown;
  code?: unknown;
  errors?: unknown;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<HttpResponse>();
    const request = context.getRequest<HttpRequest>();
    const errorResponse = this.toErrorResponse(exception);

    if (errorResponse.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logInternalError(exception, request);
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private toErrorResponse(exception: unknown): ErrorResponseBody {
    if (!(exception instanceof HttpException)) {
      return {
        code: apiErrorCodes.internal,
        message: publicErrorMessages.internal,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      };
    }

    const statusCode = exception.getStatus();
    const exceptionResponse = this.getExceptionResponse(exception);
    const fieldErrors = this.getFieldErrors(exceptionResponse.errors);
    const message = this.getPublicMessage(statusCode, exceptionResponse.message);
    const code = this.getPublicCode(statusCode, message, exceptionResponse.code, fieldErrors);

    return {
      code,
      message,
      statusCode,
      ...(fieldErrors ? { errors: { fieldErrors } } : {})
    };
  }

  private getExceptionResponse(exception: HttpException): ExceptionResponse {
    const response = exception.getResponse();

    if (typeof response === "string") {
      return { message: response };
    }

    if (this.isRecord(response)) {
      return response;
    }

    return {};
  }

  private getPublicMessage(statusCode: number, message: unknown): string {
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return publicErrorMessages.internal;
    }

    if (this.isValidationStatus(statusCode, message)) {
      return publicErrorMessages.validation;
    }

    const normalizedMessage = this.getFirstMessage(message);

    if (normalizedMessage && publicErrorCodeByMessage.has(normalizedMessage)) {
      return normalizedMessage;
    }

    return this.getFallbackMessage(statusCode);
  }

  private getPublicCode(statusCode: number, message: string, code: unknown, fieldErrors: FieldErrors | null): string {
    if (typeof code === "string" && code.trim()) {
      return code;
    }

    if (fieldErrors) {
      return apiErrorCodes.validation;
    }

    return publicErrorCodeByMessage.get(message) ?? this.getFallbackCode(statusCode);
  }

  private getFallbackMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: publicErrorMessages.badRequest,
      [HttpStatus.UNAUTHORIZED]: publicErrorMessages.unauthorized,
      [HttpStatus.FORBIDDEN]: publicErrorMessages.forbidden,
      [HttpStatus.NOT_FOUND]: publicErrorMessages.notFound,
      [HttpStatus.CONFLICT]: publicErrorMessages.conflict
    };

    return messages[statusCode] ?? publicErrorMessages.internal;
  }

  private getFallbackCode(statusCode: number): string {
    const codes: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: apiErrorCodes.badRequest,
      [HttpStatus.UNAUTHORIZED]: apiErrorCodes.unauthorized,
      [HttpStatus.FORBIDDEN]: apiErrorCodes.forbidden,
      [HttpStatus.NOT_FOUND]: apiErrorCodes.notFound,
      [HttpStatus.CONFLICT]: apiErrorCodes.conflict
    };

    return codes[statusCode] ?? apiErrorCodes.internal;
  }

  private getFirstMessage(message: unknown): string | null {
    if (typeof message === "string") {
      return message;
    }

    if (Array.isArray(message)) {
      const first = message.find((item): item is string => typeof item === "string" && Boolean(item.trim()));
      return first ?? null;
    }

    return null;
  }

  private isValidationStatus(statusCode: number, message: unknown): boolean {
    return statusCode === HttpStatus.BAD_REQUEST && this.getFirstMessage(message) === "Validation failed";
  }

  private getFieldErrors(errors: unknown): FieldErrors | null {
    if (!this.isRecord(errors) || !this.isRecord(errors.fieldErrors)) {
      return null;
    }

    const entries = Object.entries(errors.fieldErrors)
      .map(([field, messages]) => [field, this.toStringArray(messages)] as const)
      .filter(([, messages]) => messages.length > 0);

    return entries.length ? Object.fromEntries(entries) : null;
  }

  private toStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  private logInternalError(exception: unknown, request: HttpRequest): void {
    const route = `${request.method ?? "UNKNOWN"} ${request.url ?? "UNKNOWN"}`;

    if (exception instanceof Error) {
      this.logger.error(`${route}: ${exception.message}`, exception.stack);
      return;
    }

    this.logger.error(`${route}: unexpected error`);
  }
}
