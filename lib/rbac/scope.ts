import mongoose from "mongoose";
import type { IProduct } from "@/models/products";
import { IOrder } from "@/models/orders";
import { CustomError } from "@/utils/ErrorHandler";
import { UserRole } from "./roles";

type Ctx = { userId: string; role: UserRole };

export function scopeProducts({
  userId,
  role,
}: Ctx): mongoose.QueryFilter<IProduct> {
  if (role === "admin") return {};
  if (role === "seller") return { seller: userId };
  return { stock: { $gt: 0 } };
}

export function scopeOrders({
  userId,
  role,
}: Ctx): mongoose.QueryFilter<IOrder> {
  if (role === "admin") return {};
  if (role === "seller") {
    throw new CustomError(
      "scopeOrders: seller-scoped order filtering requires a $lookup against Products, not a direct field match — not yet implemented",
      501,
      "scopeOrders",
    );
  }
  return { user: userId };
}
