import mongoose, { Document, Schema, Model, Types } from "mongoose";
import orderItemSchema, { IOrderItem } from "./orderItem";
import { CustomError } from "@/utils/ErrorHandler";

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export type OrderProductInput = {
  product: Types.ObjectId;
  quantity: number;
  status?: OrderStatus;
};

export type OrderCreateInput = {
  user: Types.ObjectId;
  products: OrderProductInput[];
  status?: OrderStatus;
};

export type OrderUpdateInput = {
  products?: OrderProductInput[];
  status?: OrderStatus;
};

export interface IOrder extends Document {
  user: Types.ObjectId;
  products: IOrderItem[];
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderDoc = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  products: Array<{
    product: Types.ObjectId;
    quantity: number;
    status: OrderStatus;
  }>;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

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
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const ordersModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", ordersSchema);

function omitId<T extends { _id?: unknown }>(data: T): Omit<T, "_id"> {
  const { _id: _omit, ...rest } = data;
  return rest;
}

class Orders {
  async showAll(query: Record<string, unknown> = {}): Promise<OrderDoc[]> {
    try {
      return await ordersModel.find(query).lean<OrderDoc[]>();
    } catch {
      throw new CustomError("Failed to fetch orders", 500, "orders.showAll");
    }
  }

  async showOne(query: Record<string, unknown>): Promise<OrderDoc | null> {
    try {
      return await ordersModel.findOne(query).lean<OrderDoc | null>();
    } catch {
      throw new CustomError(
        `DB error looking up order: ${JSON.stringify(query)}`,
        500,
        "orders.showOne",
      );
    }
  }

  async create(obj: OrderCreateInput): Promise<OrderDoc> {
    try {
      const newOrder = await ordersModel.create({
        user: obj.user,
        products: obj.products.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          status: item.status ?? "pending",
        })),
        status: obj.status ?? "pending",
      });
      const doc = await ordersModel.findById(newOrder._id).lean<OrderDoc>();
      if (!doc) {
        throw new CustomError("Failed to create order", 500, "orders.create");
      }
      return doc;
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        err.name === "ValidationError" &&
        "message" in err &&
        typeof err.message === "string"
      ) {
        throw new CustomError(err.message, 400, "orders.create");
      }
      throw new CustomError("Failed to create order", 500, "orders.create");
    }
  }

  async delete(id: string): Promise<OrderDoc | null> {
    try {
      return await ordersModel.findByIdAndDelete(id).lean<OrderDoc | null>();
    } catch {
      throw new CustomError("Failed to delete order", 500, "orders.delete");
    }
  }

  async update(
    id: string,
    data: OrderUpdateInput & { _id?: unknown },
  ): Promise<OrderDoc | null> {
    try {
      const updateData = omitId(data);
      return await ordersModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .lean<OrderDoc | null>();
    } catch {
      throw new CustomError("Failed to update order", 500, "orders.update");
    }
  }
}

export default Orders;
