import type { CustomerHomeRecords } from "./home.types";

export interface HomeRepositoryContract {
  getCustomerHome(customerId: string): Promise<CustomerHomeRecords>;
}
