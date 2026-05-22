import { z } from "zod";

export const menuCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const menuItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.coerce.number(),
  imageUrl: z.string().nullable(),
  available: z.boolean(),
  categoryId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  category: menuCategorySchema.optional()
});

export const menuCategoriesSchema = z.array(menuCategorySchema);
export const menuItemsSchema = z.array(menuItemSchema);

export type MenuCategoryResponse = z.infer<typeof menuCategorySchema>;
export type MenuItemResponse = z.infer<typeof menuItemSchema>;
