import mongoose, { Schema, Types } from "mongoose";

/**
 * Valid statuses for a specific item in an order.
 */
export type OrderItemStatus = "pending" | "shipped" | "delivered" | "cancelled";

/**
 * Represents a single item within an order.
 */
export interface IOrderItem {
  /** The product ID */
  product: Types.ObjectId;
  /** The quantity ordered */
  quantity: number;
  /** The unit price at the time of purchase */
  unitPrice: number;
  /** The status of this specific item */
  productStatus: OrderItemStatus;
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
  unitPrice: {
    // this prop is needed in case rrthe product price has changed
    type: Number,
    required: [true, "Unit price at purchase is required."],
    min: [0, "Unit price cannot be negative."],
  },
  productStatus: {
    type: String,
    enum: {
      values: ["pending", "shipped", "delivered", "cancelled"],
      message: "{VALUE} is not a valid status.",
    },
    default: "pending",
  },
});

export default orderItemSchema;
