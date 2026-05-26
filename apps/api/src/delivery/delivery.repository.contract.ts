import type { Prisma } from "@prisma/client";
import type { PaginatedRepositoryContract } from "../common/pagination/pagination.contract";
import type {
  DeliveryAddressRecord,
  DeliveryMenuItemPriceRecord,
  DeliveryOrderFindManyQuery,
  DeliveryOrderRecord
} from "./delivery.types";

export interface DeliveryRepositoryContract
  extends PaginatedRepositoryContract<DeliveryOrderRecord, DeliveryOrderFindManyQuery> {
  findById(id: string): Promise<DeliveryOrderRecord | null>;
  customerExists(id: string): Promise<boolean>;
  findCustomerAddressById(id: string): Promise<DeliveryAddressRecord | null>;
  findAvailableMenuItemsByIds(ids: string[]): Promise<DeliveryMenuItemPriceRecord[]>;
  create(data: Prisma.DeliveryOrderCreateInput): Promise<DeliveryOrderRecord>;
  updateStatus(id: string, data: Prisma.DeliveryOrderUpdateInput): Promise<DeliveryOrderRecord>;
  delete(id: string): Promise<void>;
}
