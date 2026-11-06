import mongoose, { Schema, Types } from "mongoose";

/**
 * Represents a single item in a cart or order.
 */
export interface ICartItem {
  /** The product ID */
  product: Types.ObjectId;
  /** The quantity of this product */
  quantity: number;
}

export const cartItemSchema = new Schema<ICartItem>({
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
      message: "A cart must have a quantity of at least one product.",
    },
  },
});

export default cartItemSchema;
