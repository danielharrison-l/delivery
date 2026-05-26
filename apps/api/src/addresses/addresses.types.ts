import type {
  CreateCustomerAddressInput,
  CustomerAddressResponse,
  UpdateCustomerAddressInput
} from "@repo/shared";
import type { Prisma } from "@prisma/client";
import type { customerAddressSelect } from "./addresses.constants";

export type CustomerAddressCreateData = CreateCustomerAddressInput;
export type CustomerAddressUpdateData = UpdateCustomerAddressInput;
export type CustomerAddressDto = CustomerAddressResponse;
export type CustomerAddressRecord = Prisma.CustomerAddressGetPayload<{
  select: typeof customerAddressSelect;
}>;
