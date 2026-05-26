export const paginationDefaults = {
  page: 1,
  limit: 8
};

export const reservationStatusOptions = [
  { value: "all", label: "Todas" },
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "CANCELLED", label: "Cancelada" }
];

export const deliveryStatusOptions = [
  { value: "all", label: "Todos" },
  { value: "PREPARING", label: "Em preparo" },
  { value: "OUT_FOR_DELIVERY", label: "Saiu para entrega" },
  { value: "DELIVERED", label: "Entregue" },
  { value: "CANCELLED", label: "Cancelado" }
];

export const statusLabels = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  PREPARING: "Em preparo",
  OUT_FOR_DELIVERY: "Saiu para entrega",
  DELIVERED: "Entregue"
};
