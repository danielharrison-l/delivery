export const apiErrorCodes = {
  validation: "VALIDATION_ERROR",
  badRequest: "BAD_REQUEST",
  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",
  notFound: "NOT_FOUND",
  conflict: "CONFLICT",
  internal: "INTERNAL_SERVER_ERROR",
  authInvalidCredentials: "AUTH_INVALID_CREDENTIALS",
  authInvalidSession: "AUTH_INVALID_SESSION",
  authMissingAccessToken: "AUTH_MISSING_ACCESS_TOKEN",
  authCustomerNotFound: "AUTH_CUSTOMER_NOT_FOUND",
  authAdminOnly: "AUTH_ADMIN_ONLY",
  customerNotFound: "CUSTOMER_NOT_FOUND",
  customerEmailAlreadyExists: "CUSTOMER_EMAIL_ALREADY_EXISTS",
  menuCategoryNotFound: "MENU_CATEGORY_NOT_FOUND",
  menuCategoryAlreadyExists: "MENU_CATEGORY_ALREADY_EXISTS",
  menuItemNotFound: "MENU_ITEM_NOT_FOUND",
  reservationNotFound: "RESERVATION_NOT_FOUND",
  reservationCustomerNotFound: "RESERVATION_CUSTOMER_NOT_FOUND",
  deliveryNotFound: "DELIVERY_NOT_FOUND",
  deliveryCustomerNotFound: "DELIVERY_CUSTOMER_NOT_FOUND",
  deliveryUnavailableItems: "DELIVERY_UNAVAILABLE_ITEMS"
} as const;

export const publicErrorMessages = {
  validation: "Confira os dados informados.",
  badRequest: "Não foi possível processar a solicitação.",
  unauthorized: "Faça login para continuar.",
  forbidden: "Você não tem permissão para realizar esta ação.",
  notFound: "Registro não encontrado.",
  conflict: "Já existe um registro com estes dados.",
  internal: "Não foi possível completar a solicitação agora. Tente novamente em instantes."
} as const;

export const publicErrorCodeByMessage = new Map<string, string>([
  ["E-mail ou senha inválidos.", apiErrorCodes.authInvalidCredentials],
  ["Já existe um cliente com este e-mail.", apiErrorCodes.customerEmailAlreadyExists],
  ["Sessão inválida ou expirada.", apiErrorCodes.authInvalidSession],
  ["Faça login para continuar.", apiErrorCodes.authMissingAccessToken],
  ["Cliente autenticado não encontrado.", apiErrorCodes.authCustomerNotFound],
  ["Acesso permitido apenas para administradores.", apiErrorCodes.authAdminOnly],
  ["Cliente não encontrado", apiErrorCodes.customerNotFound],
  ["Cliente não encontrado.", apiErrorCodes.customerNotFound],
  ["Categoria não encontrada", apiErrorCodes.menuCategoryNotFound],
  ["Já existe uma categoria com este nome", apiErrorCodes.menuCategoryAlreadyExists],
  ["Item do cardápio não encontrado", apiErrorCodes.menuItemNotFound],
  ["Reserva não encontrada", apiErrorCodes.reservationNotFound],
  ["Pedido não encontrado", apiErrorCodes.deliveryNotFound],
  ["Um ou mais itens estão indisponíveis", apiErrorCodes.deliveryUnavailableItems]
]);
