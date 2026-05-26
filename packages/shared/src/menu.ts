import { z } from "zod";

const booleanQuerySchema = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((value) => value === "true")
]);

export const createMenuCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().or(z.literal(""))
});

export const updateMenuCategorySchema = createMenuCategorySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Informe pelo menos um campo para atualizar." }
);

export const menuCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const createMenuItemSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.coerce.number().positive(),
  imageUrl: z.string().trim().url().max(255).optional().or(z.literal("")),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999).optional(),
  categoryId: z.string().uuid()
});

export const updateMenuItemSchema = createMenuItemSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Informe pelo menos um campo para atualizar." }
);

export const menuItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.coerce.number(),
  imageUrl: z.string().nullable(),
  available: z.boolean(),
  featured: z.boolean(),
  popular: z.boolean(),
  isNew: z.boolean(),
  displayOrder: z.number().int(),
  categoryId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  category: menuCategorySchema.optional()
});

export const menuCategoriesSchema = z.array(menuCategorySchema);
export const menuItemsSchema = z.array(menuItemSchema);

export const menuItemListQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  available: booleanQuerySchema.optional(),
  search: z.string().trim().min(1).max(100).optional()
});

export type CreateMenuCategoryInput = z.infer<typeof createMenuCategorySchema>;
export type UpdateMenuCategoryInput = z.infer<typeof updateMenuCategorySchema>;
export type MenuCategoryResponse = z.infer<typeof menuCategorySchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuItemResponse = z.infer<typeof menuItemSchema>;
export type MenuItemListQuery = z.infer<typeof menuItemListQuerySchema>;
