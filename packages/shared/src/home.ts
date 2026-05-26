import { z } from "zod";
import { customerAddressSchema } from "./addresses";
import { deliveryOrderSchema } from "./delivery";
import { menuCategoriesSchema, menuItemsSchema } from "./menu";
import { reservationSchema } from "./reservations";

export const restaurantStatusSchema = z.object({
  isOpen: z.boolean(),
  deliveryAvailable: z.boolean(),
  reservationsAvailable: z.boolean(),
  currentLabel: z.string(),
  nextChangeLabel: z.string(),
  deliveryEstimateMinutes: z.object({
    min: z.number().int(),
    max: z.number().int()
  })
});

export const customerHomeSchema = z.object({
  restaurantStatus: restaurantStatusSchema,
  defaultAddress: customerAddressSchema.nullable(),
  activeOrder: deliveryOrderSchema.nullable(),
  lastOrder: deliveryOrderSchema.nullable(),
  nextReservation: reservationSchema.nullable(),
  featuredItems: menuItemsSchema,
  popularItems: menuItemsSchema,
  categories: menuCategoriesSchema
});

export type RestaurantStatusResponse = z.infer<typeof restaurantStatusSchema>;
export type CustomerHomeResponse = z.infer<typeof customerHomeSchema>;
