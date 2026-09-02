import mongoose, { Document, Schema, Model, Types } from "mongoose";
import orderItemSchema, { IOrderItem } from "./orderItem";
import { CustomError } from "@/utils/ErrorHandler";
import { productsModel } from "./products";
import { PaginatedResult } from "@/types";
import { isValidObjectId } from "@/utils/mongoose";
import { PopulatedOrderDoc, PopulatedUser } from "@/types/orders";

/**
 * Valid overall statuses for an order.
 */
export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

/**
 * Input type for a product in an order.
 */
export type OrderedProductInput = {
  /** The product ID */
  product: Types.ObjectId;
  /** The quantity ordered */
  quantity: number;
  /** The status of this specific item */
  productStatus?: OrderStatus;
};

/**
 * Input type for creating a new order.
 */
export type OrderCreateInput = {
  /** The user ID placing the order */
  user: Types.ObjectId;
  /** The products to order */
  products: OrderedProductInput[];
};

/**
 * Input type for updating an existing order.
 */
export type OrderUpdateInput = {
  /** The updated products list */
  products?: OrderedProductInput[];
};

/**
 * Mongoose document interface for an Order.
 */
export interface IOrder extends Document {
  /** The user ID who placed the order */
  user: Types.ObjectId;
  /** The items in the order */
  products: IOrderItem[];
  /** The overall status of the order */
  orderStatus: OrderStatus;
  /** The total price of the order */
  totalPrice: number;
  /** Creation timestamp */
  createdAt?: Date;
  /** Last update timestamp */
  updatedAt?: Date;
}

/**
 * Plain object representation of an Order, without Mongoose Document properties.
 */
export interface OrderDoc {
  _id: Types.ObjectId;
  user: PopulatedUser;
  products: Array<{
    product: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    productStatus: OrderStatus;
  }>;
  totalPrice: number;
  orderStatus: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Helper function to derive the overall order status based on its individual item statuses.
 * @param items The items in the order.
 * @returns The computed order status.
 */
export function deriveOrderStatus(items: OrderedProductInput[]): OrderStatus {
  if (items.length === 0) return "pending";

  const active = items.filter((item) => item.productStatus !== "cancelled");
  if (active.length === 0) return "cancelled";

  if (active.every((item) => item.productStatus === "delivered"))
    return "delivered";
  if (
    active.every(
      (item) =>
        item.productStatus === "shipped" || item.productStatus === "delivered",
    )
  ) {
    return "shipped";
  }
  return "pending";
}

const ordersSchema: Schema<IOrder> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (arr: IOrderItem[]) {
          return arr && arr.length >= 1;
        },
        message: "An order must contain at least one product.",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative."],
      index: true, // Enables fast sorting and range queries (e.g. orders > $50)
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Mongoose model for Order documents.
 */
export const ordersModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", ordersSchema);

/**
 * Repository class for interacting with the Order collection.
 */
class Orders {
  /**
   * Fetches all orders for admin view, with pagination.
   * @param query The MongoDB query object.
   * @param options Pagination options.
   * @returns A paginated result containing orders with populated user and product details.
   */
  async showAllAdmin(
    query: Record<string, unknown> = {},
    options: { page?: number; limit?: number } = {},
    // ): Promise<PaginatedResult<OrderDoc & { user: PopulatedUser }>> {
  ): Promise<PaginatedResult<PopulatedOrderDoc>> {
    const { page = 1, limit = 20 } = options;
    const [items, total] = await Promise.all([
      ordersModel
        .find(query)
        .populate("products.product", "name price image")
        .populate("user", "email userName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        // THE FIX: Tell .lean() that the user field is now an object!
        .lean<PopulatedOrderDoc[]>(),
      ordersModel.countDocuments(query),
    ]);
    return { items, total };
  }

  /**
   * Fetches a single order matching the query.
   * @param query The MongoDB query object.
   * @returns The populated order document or null if not found.
   */
  async showOne(
    query: Record<string, unknown>,
  ): Promise<PopulatedOrderDoc | null> {
    try {
      // return await ordersModel.findOne(query).lean<PopulatedOrderDoc | null>();
      return await ordersModel
        .findOne(query)
        .populate("user", "email userName") // ← add
        .populate("products.product", "name image") // ← add
        .lean<PopulatedOrderDoc | null>();
    } catch {
      throw new CustomError(
        `DB error looking up order: ${JSON.stringify(query)}`,
        500,
        "orders.showOne",
      );
    }
  }
  /**
   * Fetches all orders for a specific customer.
   * @param userId The ID of the customer.
   * @param query Additional query parameters.
   * @returns A paginated result of the customer's orders.
   */
  async showAllCustomer(
    userId: string,
    query: Record<string, unknown> = {},
  ): Promise<PaginatedResult<PopulatedOrderDoc>> {
    try {
      const [items, total] = await Promise.all([
        ordersModel
          .find({ user: userId, ...query })
          .populate({ path: "products.product", select: "name image price" })
          .sort({ createdAt: -1 })
          .lean<PopulatedOrderDoc[]>(),
        ordersModel.countDocuments({ user: userId, ...query }),
      ]);
      return { items, total };
    } catch {
      throw new CustomError(
        "Failed to fetch customer orders",
        500,
        "orders.showAllCustomer",
      );
    }
  }
  /**
   * Fetches all orders containing products sold by a specific seller.
   * Only returns the products in the order that belong to the seller.
   * @param sellerId The ID of the seller.
   * @param query Additional query parameters for filtering and pagination.
   * @returns A paginated result of orders, scoped to the seller's items.
   */
  async showAllSeller(
    sellerId: string,
    query: Record<string, unknown> = {},
  ): Promise<PaginatedResult<PopulatedOrderDoc>> {
    try {
      const page = Math.max(1, Number(query.page) || 1);
      const limit = Math.max(1, Number(query.limit) || 10);
      const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

      // One indexed lookup against Products (already indexed on `seller`),
      // instead of joining the whole Products collection against every order.
      const sellerProductIds = await productsModel.distinct("_id", {
        seller: sellerObjectId,
      });

      if (sellerProductIds.length === 0) {
        return { items: [], total: 0 };
      }

      const filter: Record<string, unknown> = {
        "products.product": { $in: sellerProductIds },
      };
      if (query.orderStatus) filter.orderStatus = query.orderStatus;
      if (query.productStatus)
        filter["products.productStatus"] = query.productStatus;

      const [orders, total] = await Promise.all([
        ordersModel
          .find(filter)
          .populate("products.product", "name image price")
          .populate("user", "email userName")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean<PopulatedOrderDoc[]>(),
        ordersModel.countDocuments(filter),
      ]);

      // Scope each order down to only this seller's line items — same intent
      // as your $project/$filter stage, just done in application code once
      // the (already paginated, already small) result set is in hand.
      const ownedIds = new Set(
        sellerProductIds.map((id: mongoose.Types.ObjectId) => id.toString()),
      );
      const items = orders.map((order) => ({
        ...order,
        products: order.products.filter((item) =>
          ownedIds.has(item.product._id.toString()),
        ),
      }));

      return { items, total };
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError(
        "Failed to fetch seller orders",
        500,
        "orders.showAllSeller",
      );
    }
  }
  /**
   * Creates a new order.
   * Automatically calculates total price based on current product prices in the database.
   * @param obj The order data.
   * @returns The created and populated order document.
   */
  async create(obj: OrderCreateInput): Promise<PopulatedOrderDoc> {
    try {
      const productIds = obj.products.map((p) => p.product);
      const dbProducts = await productsModel
        .find({ _id: { $in: productIds } })
        .lean();

      const priceMap = new Map(
        dbProducts.map((p) => [p._id.toString(), p.price]),
      );

      let totalPrice = 0;
      const products = obj.products.map((item) => {
        const unitPrice = priceMap.get(item.product.toString()) ?? 0;
        totalPrice += unitPrice * item.quantity;
        return {
          product: item.product,
          quantity: item.quantity,
          unitPrice,
          productStatus: item.productStatus ?? "pending",
        };
      });

      const newOrder = await ordersModel.create({
        user: obj.user,
        products,
        totalPrice,
        orderStatus: deriveOrderStatus(products),
      });

      const doc = await ordersModel
        .findById(newOrder._id)
        .populate("user", "email userName")
        // .populate("products.product", "name image price")
        .populate("products.product", "name image")
        .lean<PopulatedOrderDoc>();

      if (!doc) {
        throw new CustomError("Failed to create order", 500, "orders.create");
      }
      return doc;
    } catch (err: unknown) {
      if (err instanceof CustomError) throw err;
      throw new CustomError("Failed to create order", 500, "orders.create");
    }
  }

  /**
   * Deletes an order by ID.
   * @param id The ID of the order to delete.
   * @returns The deleted order document or null if not found.
   */
  async delete(id: string): Promise<PopulatedOrderDoc | null> {
    if (!isValidObjectId(id)) return null;
    try {
      return await ordersModel
        .findByIdAndDelete(id)
        .populate("user", "email userName")
        // .populate("products.product", "name image price")
        .populate("products.product", "name image")
        .lean<PopulatedOrderDoc | null>();
    } catch {
      throw new CustomError("Failed to delete order", 500, "orders.delete");
    }
  }

  /**
   * Updates an order by ID.
   * Takes the full, final products array and always recomputes orderStatus from it.
   * @param id The ID of the order to update.
   * @param data The order data to update.
   * @returns The updated and populated order document or null if not found.
   */
  async update(
    id: string,
    data: OrderUpdateInput,
  ): Promise<PopulatedOrderDoc | null> {
    if (!isValidObjectId(id)) return null;
    try {
      const updatePayload: Partial<IOrder> = {};
      if (data.products) {
        updatePayload.products = data.products as unknown as IOrderItem[];
        updatePayload.orderStatus = deriveOrderStatus(data.products);
      }
      return await ordersModel
        .findByIdAndUpdate(
          id,
          { $set: updatePayload },
          { new: true, runValidators: true },
        )
        .populate("user", "email userName")
        // .populate("products.product", "name image price")
        .populate("products.product", "name image")
        .lean<PopulatedOrderDoc | null>();
    } catch {
      throw new CustomError("Failed to update order", 500, "orders.update");
    }
  }
}

export default Orders;
