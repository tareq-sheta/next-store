import { z } from "zod";
import { CATEGORY_DEFINITIONS } from "./categories";

// export const CATEGORY_DEFINITIONS = [
//   "phones",
//   "smartwatch",
//   "headphones",
//   "cameras",
//   "computers",
//   "gaming",
//   "others",
// ] as const;

export const CreateProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(200, "Name too long"),
    price: z
      .number({
        error: "Price is required",
      })
      .positive("Price must be greater than 0"),
    description: z.string().trim().min(1, "Description is required").max(2000),
    category: z.enum(
      CATEGORY_DEFINITIONS.map((cat) => cat.slug),
      { error: "Invalid category" },
    ),
    image: z.string().pipe(z.url("Image must be a valid URL")),
    stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  })
  .strict(); // rejects any extra fields the client sends

export const UpdateProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    price: z.number().positive().optional(),
    description: z.string().trim().min(1).max(2000).optional(),
    category: z.enum(CATEGORY_DEFINITIONS.map((cat) => cat.slug)).optional(),
    image: z.string().pipe(z.url("Image must be a valid URL")).optional(),
    stock: z.number().int().nonnegative().optional(),
  })
  .strict();

// Infer types from schemas — replace the manual interfaces in types/products.ts
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const MAX_PAGE_SIZE = 50;

export const ListProductsQuerySchema = z.object({
  category: z.enum(CATEGORY_DEFINITIONS.map((cat) => cat.slug)).optional(),
  search: z.string().trim().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(20),
});
//------
// const MAX_PAGE_SIZE = 50;

export const DashboardProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(20),
});
