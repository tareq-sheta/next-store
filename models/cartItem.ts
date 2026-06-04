import mongoose, { Schema, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
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
