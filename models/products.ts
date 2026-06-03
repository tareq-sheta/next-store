import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { CustomError } from "@/utils/ErrorHandler";


export type ProductCategory =
  | "phones"
  | "smartwatch"
  | "headphones"
  | "cameras"
  | "computers"
  | "gaming"
  | "others";

export interface IProduct extends Document {
  name: string;
  sellerEmail: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  fav?: boolean;
  stock: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductDoc = {
  _id: Types.ObjectId;
  name: string;
  sellerEmail: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  fav?: boolean;
  stock: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export const productsSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A product must have a name."],
    },
    description: {
      type: String,
      required: [true, "A product must have a description."],
    },
    image: {
      type: String,
      required: [true, "A product must have an image."],
    },
    sellerEmail: {
      type: String,
      required: [true, "A product must have a seller email."],
    },
    price: {
      type: Number,
      required: [true, "A product must have a price."],
      min: [0, "Price cannot be negative."],
    },
    quantity: {
      type: Number,
      required: [true, "A product must have a quantity."],
    },
    fav: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ["electronics", "clothing", "home", "books", "toys", "other"],
      required: [true, "A product must have a category."],
    },
    stock: {
      type: Number,
      required: [true, "A product must have stock."],
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const productsModel: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productsSchema);

function omitId<T extends { _id?: unknown }>(data: T): Omit<T, "_id"> {
  const { _id: _omit, ...rest } = data;
  return rest;
}

class Products {
  async showAll(): Promise<ProductDoc[]> {
    try {
      return await productsModel.find().lean<ProductDoc[]>();
    } catch {
      throw new CustomError("Failed to fetch products", 500, "products.showAll");
    }
  }

  async showOne(query: string): Promise<ProductDoc | null> {
    try {
      const filter = mongoose.Types.ObjectId.isValid(query)
        ? { _id: query }
        : { $or: [{ name: query }, { sellerEmail: query }] };

      return await productsModel.findOne(filter).lean<ProductDoc | null>();
    } catch {
      throw new CustomError(
        `DB error looking up product: ${query}`,
        500,
        "products.showOne",
      );
    }
  }

  async create(obj: Partial<IProduct>): Promise<ProductDoc> {
    try {
      const product = await productsModel.create(obj);
      return product.toObject();
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === 11000
      ) {
        throw new CustomError(
          "Product name already exists",
          400,
          "products.create",
        );
      }
      throw new CustomError("Failed to create product", 500, "products.create");
    }
  }

  async delete(id: string): Promise<ProductDoc | null> {
    try {
      return await productsModel.findByIdAndDelete(id).lean<ProductDoc | null>();
    } catch {
      throw new CustomError("Failed to delete product", 500, "products.delete");
    }
  }

  async update(
    id: string,
    data: Partial<IProduct> & { _id?: unknown },
  ): Promise<ProductDoc | null> {
    try {
      const updateData = omitId(data);
      return await productsModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true },
        )
        .lean<ProductDoc | null>();
    } catch {
      throw new CustomError("Failed to update product", 500, "products.update");
    }
  }
}

export default Products;
