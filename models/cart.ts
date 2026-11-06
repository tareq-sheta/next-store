import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { cartItemSchema, ICartItem } from "./cartItem";
import { CustomError } from "@/utils/ErrorHandler";
import { omitId } from "@/utils/mongoose";

/**
 * Input type for a product in a cart.
 */
export type CartProductInput = {
  product: Types.ObjectId;
  quantity: number;
};

/**
 * Input type for creating a new cart.
 */
export type CartCreateInput = {
  user: Types.ObjectId;
  products?: CartProductInput[];
};

/**
 * Input type for updating an existing cart.
 */
export type CartUpdateInput = {
  user?: Types.ObjectId;
  products?: CartProductInput[];
};

/**
 * Mongoose document interface for a Cart.
 */
export interface ICart extends Document {
  /** The ID of the user who owns the cart */
  user: Types.ObjectId;
  /** The products currently in the cart */
  products: ICartItem[];
  /** Creation timestamp */
  createdAt?: Date;
  /** Last update timestamp */
  updatedAt?: Date;
}

/**
 * Plain object representation of a Cart, without Mongoose Document properties.
 */
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

/**
 * Mongoose model for Cart documents.
 */
export const cartModel: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);

/**
 * Repository class for interacting with the Cart collection.
 */
class Cart {
  /**
   * Fetches all carts.
   * @returns A promise resolving to an array of CartDoc.
   */
  async showAll(): Promise<CartDoc[]> {
    try {
      return await cartModel.find().lean<CartDoc[]>();
    } catch {
      throw new CustomError("Failed to fetch carts", 500, "cart.showAll");
    }
  }

  /**
   * Fetches a single cart matching the query.
   * @param query The MongoDB query object.
   * @returns The cart document or null if not found.
   */
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

  /**
   * Creates a new cart for a user.
   * @param obj The cart data.
   * @returns The created cart document.
   */
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

  /**
   * Deletes a cart by ID.
   * @param id The ID of the cart to delete.
   * @returns The deleted cart document or null if not found.
   */
  async delete(id: string): Promise<CartDoc | null> {
    try {
      return await cartModel.findByIdAndDelete(id).lean<CartDoc | null>();
    } catch {
      throw new CustomError("Failed to delete cart", 500, "cart.delete");
    }
  }

  /**
   * Updates a cart by ID.
   * @param id The ID of the cart to update.
   * @param data The data to update.
   * @returns The updated cart document or null if not found.
   */
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
