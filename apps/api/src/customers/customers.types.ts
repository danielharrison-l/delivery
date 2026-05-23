import type {
  CreateCustomerInput,
  CustomerListQuery,
  CustomerResponse,
  PaginatedCustomersResponse,
  UpdateCustomerInput
} from "@repo/shared";
import type { Prisma } from "@prisma/client";
import type { PaginatedRepositoryResult } from "../common/pagination/pagination.types";
import type { customerSelect } from "./customers.constants";

export type CustomerCreateData = CreateCustomerInput;
export type CustomerUpdateData = UpdateCustomerInput;
export type CustomerFindManyQuery = CustomerListQuery;
export type CustomerDto = CustomerResponse;
export type CustomersPageDto = PaginatedCustomersResponse;
export type CustomerRecord = Prisma.CustomerGetPayload<{
  select: typeof customerSelect;
}>;
export type CustomerPaginatedRecords = PaginatedRepositoryResult<CustomerRecord>;
