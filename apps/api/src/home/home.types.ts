import type { CustomerHomeResponse } from "@repo/shared";
import type { Prisma } from "@prisma/client";
import type { customerAddressSelect } from "../addresses/addresses.constants";
import type { deliveryOrderSelect } from "../delivery/delivery.constants";
import type { menuCategorySelect, menuItemSelect } from "../menu/menu.constants";
import type { reservationSelect } from "../reservations/reservations.constants";

export type CustomerHomeDto = CustomerHomeResponse;
export type HomeAddressRecord = Prisma.CustomerAddressGetPayload<{
  select: typeof customerAddressSelect;
}>;
export type HomeDeliveryOrderRecord = Prisma.DeliveryOrderGetPayload<{
  select: typeof deliveryOrderSelect;
}>;
export type HomeReservationRecord = Prisma.ReservationGetPayload<{
  select: typeof reservationSelect;
}>;
export type HomeMenuItemRecord = Prisma.MenuItemGetPayload<{
  select: typeof menuItemSelect;
}>;
export type HomeMenuCategoryRecord = Prisma.MenuCategoryGetPayload<{
  select: typeof menuCategorySelect;
}>;
export type CustomerHomeRecords = {
  defaultAddress: HomeAddressRecord | null;
  activeOrder: HomeDeliveryOrderRecord | null;
  lastOrder: HomeDeliveryOrderRecord | null;
  nextReservation: HomeReservationRecord | null;
  featuredItems: HomeMenuItemRecord[];
  popularItems: HomeMenuItemRecord[];
  categories: HomeMenuCategoryRecord[];
};
