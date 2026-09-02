import z from "zod";
import mongoose from "mongoose";

const CartItemSchema = z.object({
  product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID format",
  }),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(999),
});

export const AddToCartSchema = z
  .object({
    products: z
      .array(CartItemSchema)
      .min(1, "At least one product is required"),
  })
  .strict();
//--------
export const QuantitySchema = z.object({
  quantity: z.number().int().min(1, "Valid quantity is required"),
});
