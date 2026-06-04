import mongoose, { Schema, Types } from "mongoose";

export type OrderItemStatus =
  | "pending"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  status: OrderItemStatus;
}

export const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "A product ID is required."],
  },
  quantity: {
    type: Number,
    required: [true, "A quantity is required."],
    validate: {
      validator: function (num: number) {
        return num > 0;
      },
      message: "An order must have a quantity of at least one product.",
    },
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "shipped", "delivered", "cancelled"],
      message: "{VALUE} is not a valid status.",
    },
    default: "pending",
  },
});

export default orderItemSchema;
