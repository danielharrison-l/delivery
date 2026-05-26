import { getRestaurantStatus } from "@repo/shared";
import { addressesMapper } from "../addresses/addresses.mapper";
import { deliveryMapper } from "../delivery/delivery.mapper";
import { menuMapper } from "../menu/menu.mapper";
import { reservationsMapper } from "../reservations/reservations.mapper";
import type { CustomerHomeDto, CustomerHomeRecords } from "./home.types";

function toDto(records: CustomerHomeRecords): CustomerHomeDto {
  return {
    restaurantStatus: getRestaurantStatus(),
    defaultAddress: records.defaultAddress ? addressesMapper.toDto(records.defaultAddress) : null,
    activeOrder: records.activeOrder ? deliveryMapper.toDto(records.activeOrder) : null,
    lastOrder: records.lastOrder ? deliveryMapper.toDto(records.lastOrder) : null,
    nextReservation: records.nextReservation ? reservationsMapper.toDto(records.nextReservation) : null,
    featuredItems: records.featuredItems.map((item) => menuMapper.toItemDto(item)),
    popularItems: records.popularItems.map((item) => menuMapper.toItemDto(item)),
    categories: records.categories.map((category) => menuMapper.toCategoryDto(category))
  };
}

export const homeMapper = {
  toDto
} as const;
