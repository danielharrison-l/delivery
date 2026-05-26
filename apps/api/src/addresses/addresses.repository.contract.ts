import type { Prisma } from "@prisma/client";
import type { CustomerAddressRecord } from "./addresses.types";

export interface AddressesRepositoryContract {
  findByCustomerId(customerId: string): Promise<CustomerAddressRecord[]>;
  findDefaultByCustomerId(customerId: string): Promise<CustomerAddressRecord | null>;
  findById(id: string): Promise<CustomerAddressRecord | null>;
  create(data: Prisma.CustomerAddressCreateInput): Promise<CustomerAddressRecord>;
  update(id: string, data: Prisma.CustomerAddressUpdateInput): Promise<CustomerAddressRecord>;
  unsetDefault(customerId: string, exceptId?: string): Promise<void>;
  delete(id: string): Promise<void>;
}
