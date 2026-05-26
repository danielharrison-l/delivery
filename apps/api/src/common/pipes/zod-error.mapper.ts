import type { ZodIssue } from "zod";

type IssueDetails = Record<string, unknown>;

export function mapZodIssueMessage(issue: ZodIssue): string {
  const details = issue as ZodIssue & IssueDetails;

  if (issue.code === "invalid_format") {
    return mapInvalidFormat(details);
  }

  if (issue.code === "invalid_type") {
    return "Preencha este campo corretamente.";
  }

  if (issue.code === "too_small") {
    return mapTooSmall(details);
  }

  if (issue.code === "too_big") {
    return mapTooBig(details);
  }

  if (issue.code === "invalid_value") {
    return "Selecione uma opção válida.";
  }

  if (issue.code === "custom" && issue.message) {
    return issue.message;
  }

  return "Confira este campo.";
}

function mapInvalidFormat(details: IssueDetails): string {
  if (details.format === "email") {
    return "Informe um e-mail válido.";
  }

  if (details.format === "uuid") {
    return "Informe um identificador válido.";
  }

  if (details.format === "url") {
    return "Informe uma URL válida.";
  }

  if (details.format === "datetime") {
    return "Informe uma data válida.";
  }

  return "Informe um valor válido.";
}

function mapTooSmall(details: IssueDetails): string {
  const minimum = typeof details.minimum === "number" ? details.minimum : null;

  if (details.origin === "array") {
    return "Informe pelo menos um item.";
  }

  if (details.origin === "number") {
    return minimum ? `Informe um número maior ou igual a ${minimum}.` : "Informe um número válido.";
  }

  if (minimum === 1) {
    return "Preencha este campo.";
  }

  return minimum ? `Informe pelo menos ${minimum} caracteres.` : "Preencha este campo corretamente.";
}

function mapTooBig(details: IssueDetails): string {
  const maximum = typeof details.maximum === "number" ? details.maximum : null;

  if (details.origin === "array") {
    return maximum ? `Informe no máximo ${maximum} itens.` : "Informe menos itens.";
  }

  if (details.origin === "number") {
    return maximum ? `Informe um número menor ou igual a ${maximum}.` : "Informe um número válido.";
  }

  return maximum ? `Informe no máximo ${maximum} caracteres.` : "Reduza o tamanho deste campo.";
}
