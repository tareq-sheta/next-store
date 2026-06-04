import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { cartItemSchema, ICartItem } from "./cartItem";
import { CustomError } from "@/utils/ErrorHandler";

export type CartProductInput = {
  product: Types.ObjectId;
  quantity: number;
};

export type CartCreateInput = {
  user: Types.ObjectId;
  products?: CartProductInput[];
};

export type CartUpdateInput = {
  user?: Types.ObjectId;
  products?: CartProductInput[];
};

export interface ICart extends Document {
  user: Types.ObjectId;
  products: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type CartDoc = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  products: Array<{
    product: Types.ObjectId;
    quantity: number;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
};

const cartSchema: Schema<ICart> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, "A cart must have a user ID."],
    },
    products: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const cartModel: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);

function omitId<T extends { _id?: unknown }>(data: T): Omit<T, "_id"> {
  const { _id: _omit, ...rest } = data;
  return rest;
}

class Cart {
  async showAll(): Promise<CartDoc[]> {
    try {
      return await cartModel.find().lean<CartDoc[]>();
    } catch {
      throw new CustomError("Failed to fetch carts", 500, "cart.showAll");
    }
  }

  async showOne(query: Record<string, unknown>): Promise<CartDoc | null> {
    try {
      return await cartModel.findOne(query).lean<CartDoc | null>();
    } catch {
      throw new CustomError(
        `DB error looking up cart: ${JSON.stringify(query)}`,
        500,
        "cart.showOne",
      );
    }
  }

  async create(obj: CartCreateInput): Promise<CartDoc> {
    try {
      const existingCart = await cartModel.findOne({ user: obj.user }).lean();
      if (existingCart) {
        throw new CustomError(
          "Cart already exists for this user",
          400,
          "cart.create",
        );
      }
      const newCart = await cartModel.create(obj);
      const doc = await cartModel.findById(newCart._id).lean<CartDoc>();
      if (!doc) {
        throw new CustomError("Failed to create cart", 500, "cart.create");
      }
      return doc;
    } catch (err: unknown) {
      if (err instanceof CustomError) throw err;
      throw new CustomError("Failed to create cart", 500, "cart.create");
    }
  }

  async delete(id: string): Promise<CartDoc | null> {
    try {
      return await cartModel.findByIdAndDelete(id).lean<CartDoc | null>();
    } catch {
      throw new CustomError("Failed to delete cart", 500, "cart.delete");
    }
  }

  async update(
    id: string,
    data: CartUpdateInput & { _id?: unknown },
  ): Promise<CartDoc | null> {
    try {
      const updateData = omitId(data);
      return await cartModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .lean<CartDoc | null>();
    } catch {
      throw new CustomError("Failed to update cart", 500, "cart.update");
    }
  }
}

export default Cart;
