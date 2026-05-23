import { z } from "zod";
import { customerSchema } from "./customers";
import { menuItemSchema } from "./menu";
import { paginationMetaSchema, paginationQuerySchema } from "./pagination";

export const deliveryOrderStatusSchema = z.enum([
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED"
]);

export const createDeliveryOrderSchema = z.object({
  customerId: z.string().uuid(),
  deliveryAddress: z.string().trim().min(5).max(255),
  items: z.array(
    z.object({
      menuItemId: z.string().uuid(),
      quantity: z.coerce.number().int().min(1).max(20)
    })
  ).min(1)
});

export const createAuthenticatedDeliveryOrderSchema = createDeliveryOrderSchema.omit({
  customerId: true
});

export const updateDeliveryOrderStatusSchema = z.object({
  status: deliveryOrderStatusSchema
});

export const deliveryOrderItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int(),
  unitPrice: z.coerce.number(),
  orderId: z.string().uuid(),
  menuItemId: z.string().uuid(),
  createdAt: z.string().datetime(),
  menuItem: menuItemSchema.optional()
});

export const deliveryOrderSchema = z.object({
  id: z.string().uuid(),
  status: deliveryOrderStatusSchema,
  totalAmount: z.coerce.number(),
  deliveryAddress: z.string(),
  customerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  customer: customerSchema.optional(),
  items: z.array(deliveryOrderItemSchema).optional()
});

export const deliveryOrdersSchema = z.array(deliveryOrderSchema);

export const deliveryOrderListQuerySchema = paginationQuerySchema.extend({
  status: deliveryOrderStatusSchema.optional(),
  customerId: z.string().uuid().optional()
});

export const paginatedDeliveryOrdersSchema = z.object({
  data: deliveryOrdersSchema,
  meta: paginationMetaSchema
});

export type CreateDeliveryOrderInput = z.infer<typeof createDeliveryOrderSchema>;
export type CreateAuthenticatedDeliveryOrderInput = z.infer<typeof createAuthenticatedDeliveryOrderSchema>;
export type UpdateDeliveryOrderStatusInput = z.infer<typeof updateDeliveryOrderStatusSchema>;
export type DeliveryOrderResponse = z.infer<typeof deliveryOrderSchema>;
export type DeliveryOrderListQuery = z.infer<typeof deliveryOrderListQuerySchema>;
export type PaginatedDeliveryOrdersResponse = z.infer<typeof paginatedDeliveryOrdersSchema>;
