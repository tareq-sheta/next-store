import z from "zod";
import mongoose from "mongoose";
const ORDER_STATUSES = [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const objectIdString = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid id");

const OrderItemSchema = z.object({
  product: objectIdString,
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  productStatus: z.enum(ORDER_STATUSES).optional(),
});

// No top-level order status accepted at creation — a brand-new order's
// items start "pending" by default, and orderStatus is derived from that.
export const CreateOrderSchema = z.object({
  user: objectIdString,
  products: z.array(OrderItemSchema).min(1, "At least one product is required"),
});
//----------

// const objectIdString = z
//   .string()
//   .refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid id");

// Buyer/admin — can replace the full item list (product/quantity/status per
// line). orderStatus is intentionally NOT accepted here — Orders.update()
// always recalculates it from whatever products array ends up persisted.
export const UpdateOrderSchema = z
  .object({
    products: z
      .array(
        z.object({
          product: objectIdString,
          quantity: z.number().int().min(1, "Quantity must be at least 1"),
          productStatus: z.enum(ORDER_STATUSES).optional(),
        }),
      )
      .min(1)
      .optional(),
  })
  .strict();

// Seller — can only flip the status field, and only for their own items.
export const SellerUpdateItemStatusSchema = z
  .object({
    productStatus: z.enum(ORDER_STATUSES),
  })
  .strict();
