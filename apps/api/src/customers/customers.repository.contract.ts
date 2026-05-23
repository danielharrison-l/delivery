import type { Prisma } from "@prisma/client";
import type { PaginatedRepositoryContract } from "../common/pagination/pagination.contract";
import type { CustomerFindManyQuery, CustomerRecord } from "./customers.types";

export interface CustomersRepositoryContract
  extends PaginatedRepositoryContract<CustomerRecord, CustomerFindManyQuery> {
  findById(id: string): Promise<CustomerRecord | null>;
  create(data: Prisma.CustomerCreateInput): Promise<CustomerRecord>;
  update(id: string, data: Prisma.CustomerUpdateInput): Promise<CustomerRecord>;
  delete(id: string): Promise<void>;
}
