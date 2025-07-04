import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  category: z.string(),
  image: z.string(),
  images: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  badge: z.string().optional(),
  features: z.array(z.string()).optional(),
  inStock: z.boolean().default(true),
});

export const insertProductSchema = productSchema.omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = z.infer<typeof productSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
  variant: z.string().optional(),
});

export const insertCartItemSchema = cartItemSchema.omit({ id: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

// Search and filter schemas
export const productFiltersSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["featured", "price-low", "price-high", "rating", "newest"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;
