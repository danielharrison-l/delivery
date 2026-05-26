import type {
  CreateDeliveryOrderInput,
  DeliveryOrderListQuery,
  DeliveryOrderResponse,
  PaginatedDeliveryOrdersResponse,
  UpdateDeliveryOrderStatusInput
} from "@repo/shared";
import type { Prisma } from "@prisma/client";
import type { PaginatedRepositoryResult } from "../common/pagination/pagination.types";
import type { customerAddressSelect } from "../addresses/addresses.constants";
import type { deliveryMenuItemPriceSelect, deliveryOrderSelect } from "./delivery.constants";

export type DeliveryOrderCreateData = CreateDeliveryOrderInput;
export type DeliveryOrderStatusUpdateData = UpdateDeliveryOrderStatusInput;
export type DeliveryOrderFindManyQuery = DeliveryOrderListQuery;
export type DeliveryOrderDto = DeliveryOrderResponse;
export type DeliveryOrdersPageDto = PaginatedDeliveryOrdersResponse;
export type DeliveryOrderRecord = Prisma.DeliveryOrderGetPayload<{
  select: typeof deliveryOrderSelect;
}>;
export type DeliveryOrderPaginatedRecords = PaginatedRepositoryResult<DeliveryOrderRecord>;
export type DeliveryMenuItemPriceRecord = Prisma.MenuItemGetPayload<{
  select: typeof deliveryMenuItemPriceSelect;
}>;
export type DeliveryAddressRecord = Prisma.CustomerAddressGetPayload<{
  select: typeof customerAddressSelect;
}>;
