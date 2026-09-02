import mongoose, { Document, Schema, Model, Types, SortOrder } from "mongoose";
import { CustomError } from "@/utils/ErrorHandler";
import { CATEGORY_DEFINITIONS } from "@/lib/validations/categories";
import type { PopulatedSeller } from "@/types/products";
import { PaginatedResult } from "@/types";
import { isValidObjectId, omitId } from "@/utils/mongoose";
import { toPublicProductDTO } from "@/lib/dto";

// CATEGORY_DEFINITIONS is now an array of objects; extract the slug strings for
// use as the canonical category type and in the Mongoose enum validator.
export type ProductCategory = (typeof CATEGORY_DEFINITIONS)[number]["slug"];
/**
 * Options for fetching top-selling products.
 */
interface TopSellerOptions {
  /** Limit the number of results */
  limit?: number;
  /** Filter by category slug */
  category?: string;
  /** Exclude a specific product ID from the results */
  excludeProductId?: string;
  /** Filter by seller ID */
  sellerId?: string;
}
/**
 * Mongoose document interface for a Product.
 */
export interface IProduct extends Document {
  /** The product name */
  name: string;
  /** The ID of the seller */
  seller: Types.ObjectId;
  /** The product price */
  price: number;
  /** The product description */
  description: string;
  /** The product category slug */
  category: ProductCategory;
  /** URL to the product image */
  image: string;
  /** The current inventory stock level */
  stock: number;
  /** The computed stock status */
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  /** The total number of units sold */
  unitsSold: number;
  /** Creation timestamp */
  createdAt?: Date;
  /** Last update timestamp */
  updatedAt?: Date;
}

/**
 * Plain object representation of a Product, without Mongoose Document properties.
 * Derived from IProduct to ensure schema changes only happen in one place.
 */
export type ProductDoc = Omit<IProduct, keyof Document> & {
  _id: Types.ObjectId | string;
};

const productsSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A product must have a description."],
    },
    image: { type: String, required: [true, "A product must have an image."] },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A product must have a seller."],
    },
    price: {
      type: Number,
      required: [true, "A product must have a price."],
      min: [0, "Price cannot be negative."],
    },
    category: {
      type: String,
      enum: CATEGORY_DEFINITIONS.map((cat) => cat.slug),
      required: [true, "A product must have a category."],
    },
    stock: {
      type: Number,
      required: [true, "A product must have stock."],
      default: 0,
      min: [0, "Stock cannot be negative."],
    },
    stockStatus: {
      type: String,
      enum: ["IN_STOCK", "OUT_OF_STOCK"],
      default: "IN_STOCK",
    },
    unitsSold: {
      type: Number,
      default: 0,
      min: [0, "Units sold cannot be negative."],

      index: true,
    },
  },
  { timestamps: true },
);

// Two sellers can list "Wireless Mouse"; the same seller can't list it twice.
productsSchema.index({ name: 1, seller: 1 }, { unique: true });
productsSchema.index({ name: "text", description: "text" });

/**
 * Mongoose model for Product documents.
 */
export const productsModel: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productsSchema);

/**
 * Repository class for interacting with the Product collection.
 */
class Products {
  /**
   * Fetches a product by its ID.
   * @param id The product ID.
   * @returns The product document or null if not found.
   */
  async findById(id: string): Promise<ProductDoc | null> {
    if (!isValidObjectId(id)) return null;
    try {
      return await productsModel.findById(id).lean<ProductDoc | null>();
    } catch {
      throw new CustomError(
        `DB error looking up product by id: ${id}`,
        500,
        "products.findById",
      );
    }
  }

  /**
   * Fetches a single product matching the query.
   * @param target The product ID string or a MongoDB query object.
   * @returns The product document or null if not found.
   */
  async showOne(
    target: string | Record<string, unknown>,
  ): Promise<ProductDoc | null> {
    try {
      if (typeof target === "string") {
        return isValidObjectId(target)
          ? await productsModel.findById(target).lean<ProductDoc | null>()
          : null;
      }
      if (Object.keys(target).length === 0) {
        throw new CustomError(
          "Cannot query with an empty filter object",
          400,
          "products.showOne",
        );
      }
      return await productsModel.findOne(target).lean<ProductDoc | null>();
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(
        "Failed to fetch the product",
        500,
        "products.showOne",
      );
    }
  }

  /**
   * Public storefront query — returns in-stock products only, safe fields, always paginated.
   * Supports text search and category filtering.
   * @param options Query options including pagination and filters.
   * @returns A paginated result containing products.
   */
  async showPublic(
    options: {
      category?: ProductCategory;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<PaginatedResult<ProductDoc>> {
    const { category, search, page = 1, limit = 20 } = options;

    const filter: mongoose.QueryFilter<IProduct> & {
      $text?: { $search: string };
    } = {
      stock: { $gt: 0 },
      ...(category && { category }),
      ...(search && { $text: { $search: search } }),
    };

    const projection = search ? { score: { $meta: "textScore" } } : undefined;

    // Typed against Mongoose's own SortOrder rather than `any` — this is the
    // exact type `.sort()` expects, so an invalid sort value or a typo'd
    // field name still fails to compile.
    type ProductSort = Record<string, SortOrder | { $meta: string }>;

    const sort: ProductSort = search
      ? { score: { $meta: "textScore" } }
      : { createdAt: -1 };
    try {
      const [items, total] = await Promise.all([
        productsModel
          .find(filter, projection)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean<ProductDoc[]>(),
        productsModel.countDocuments(filter),
      ]);
      return { items, total };
    } catch {
      throw new CustomError(
        "Failed to fetch products",
        500,
        "products.showPublic",
      );
    }
  }

  /**
   * Seller dashboard query — returns products for a specific seller only, including exact stock.
   * @param sellerId The ID of the seller.
   * @param options Pagination options.
   * @returns A paginated result containing the seller's products.
   */
  async showBySeller(
    sellerId: string,
    options: { page?: number; limit?: number } = {},
  ): Promise<PaginatedResult<ProductDoc>> {
    if (!isValidObjectId(sellerId)) return { items: [], total: 0 };
    const { page = 1, limit = 20 } = options;
    const filter = { seller: new Types.ObjectId(sellerId) };

    try {
      const [items, total] = await Promise.all([
        productsModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean<ProductDoc[]>(),
        productsModel.countDocuments(filter),
      ]);
      return { items, total };
    } catch {
      throw new CustomError(
        "Failed to fetch seller products",
        500,
        "products.showBySeller",
      );
    }
  }

  /**
   * Fetches top-selling products, ordered by units sold descending.
   * @param options Query options (limit, category, exclusions).
   * @returns An array of top-selling products.
   */
  async showTopSellers({
    limit,
    category,
    excludeProductId,
    sellerId,
  }: TopSellerOptions): Promise<ProductDoc[]> {
    try {
      // We keep our out-of-stock filter for widgets!
      const filter: Record<string, unknown> = { stock: { $gt: 0 } };

      if (category) filter.category = category;

      if (excludeProductId) filter._id = { $ne: excludeProductId };

      if (sellerId) filter.seller = sellerId;

      const topProducts = await productsModel
        .find(filter)
        .sort({ unitsSold: -1 })
        .limit(limit as number)
        .lean<ProductDoc[]>();

      return topProducts;
    } catch {
      throw new CustomError("Failed to fetch top sellers", 500);
    }
  }
  /**
   * Admin panel query — fetches all products, including full seller information joined via aggregation.
   * @param options Pagination and filtering options.
   * @returns A paginated result of products populated with seller data.
   */
  async showAllAdmin(
    options: {
      page?: number;
      limit?: number;
      sellerId?: string;
    } = {},
  ): Promise<PaginatedResult<ProductDoc & { seller: PopulatedSeller }>> {
    const { page = 1, limit = 20, sellerId } = options;

    if (sellerId && !isValidObjectId(sellerId)) {
      throw new CustomError("Invalid sellerId", 400, "products.showAllAdmin");
    }

    const matchStage = sellerId
      ? [{ $match: { seller: new mongoose.Types.ObjectId(sellerId) } }]
      : [];

    try {
      const [items, totalResult] = await Promise.all([
        productsModel.aggregate([
          ...matchStage,
          {
            $lookup: {
              from: "users",
              localField: "seller",
              foreignField: "_id",
              as: "seller",
              pipeline: [{ $project: { userName: 1, email: 1 } }],
            },
          },
          {
            $unwind: {
              path: "$seller",
              preserveNullAndEmptyArrays: true,
            },
          },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ]),
        productsModel.aggregate([...matchStage, { $count: "total" }]),
      ]);
      // console.log("Fetched products:", items, "Total:", totalResult);
      return { items, total: totalResult[0]?.total ?? 0 };
    } catch {
      throw new CustomError(
        "Failed to fetch admin products",
        500,
        "products.showAllAdmin",
      );
    }
  }

  /**
   * Performs a text search across products.
   * @param term The search term.
   * @param limit The maximum number of results (default 20).
   * @returns An array of products matching the search, ordered by relevance score.
   */
  async search(term: string, limit = 20): Promise<ProductDoc[]> {
    try {
      return await productsModel
        .find({ $text: { $search: term } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean<ProductDoc[]>();
    } catch {
      throw new CustomError(
        `DB error searching products: ${term}`,
        500,
        "products.search",
      );
    }
  }

  /**
   * Creates a new product.
   * @param data The product data.
   * @returns The created product document.
   */
  async create(data: Partial<IProduct>): Promise<ProductDoc> {
    try {
      const product = await productsModel.create(data);
      return product.toObject();
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === 11000
      ) {
        throw new CustomError(
          "You already have a product with this name",
          409,
          "products.create",
        );
      }
      throw new CustomError("Failed to create product", 500, "products.create");
    }
  }

  /**
   * Deletes a product by ID.
   * @param id The ID of the product to delete.
   * @returns The deleted product document or null if not found.
   */
  async delete(id: string): Promise<ProductDoc | null> {
    if (!isValidObjectId(id)) return null;
    try {
      return await productsModel
        .findByIdAndDelete(id)
        .lean<ProductDoc | null>();
    } catch {
      throw new CustomError("Failed to delete product", 500, "products.delete");
    }
  }
  /**
   * Increments the stock of a product.
   * Requires the product to have enough stock currently to avoid negative inventory.
   * @param productId The ID of the product.
   * @param quantity The amount to increment.
   * @returns The updated product document or null if not found.
   */
  async incrementStock(
    productId: string,
    quantity: number,
  ): Promise<ProductDoc | null> {
    if (!isValidObjectId(productId)) return null;
    try {
      return await productsModel
        .findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity } },
          { $inc: { stock: quantity } },
          { new: true },
        )
        .lean<ProductDoc | null>();
    } catch {
      throw new CustomError(
        "Failed to update product stock",
        500,
        "products.incrementStock",
      );
    }
  }
  /**
   * Decrements the stock of a product and increments its unitsSold.
   * Prevents stock from falling below zero.
   * @param productId The ID of the product.
   * @param quantity The amount to decrement.
   * @returns The updated product document or null if not found.
   */
  async decrementStock(
    productId: string,
    quantity: number,
  ): Promise<ProductDoc | null> {
    if (!isValidObjectId(productId)) return null;
    try {
      return await productsModel
        .findOneAndUpdate(
          { _id: productId, stock: { $gte: quantity } },
          { $inc: { stock: -quantity, unitsSold: quantity } },

          { new: true },
        )
        .lean<ProductDoc | null>();
    } catch {
      throw new CustomError(
        "Failed to update product stock",
        500,
        "products.decrementStock",
      );
    }
  }

  /**
   * Best-effort compensation for rolling back a decrement that succeeded
   * before a later step in the same order failed.
   * @param productId The ID of the product.
   * @param quantity The amount of stock to restore.
   */
  async restoreStock(productId: string, quantity: number): Promise<void> {
    if (!isValidObjectId(productId)) return;
    try {
      await productsModel.findByIdAndUpdate(productId, {
        $inc: { stock: quantity },
      });
    } catch (err) {
      // This is now a real, undetected inventory drift — log it loudly
      // rather than swallowing it, since it needs a human to reconcile.
      console.error(
        `CRITICAL: failed to restore ${quantity} stock to product ${productId} after a failed order — manual reconciliation needed`,
        err,
      );
    }
  }

  /**
   * Updates a product by ID.
   * @param id The ID of the product to update.
   * @param data The data to update.
   * @returns The updated product document or null if not found.
   */
  async update(
    id: string,
    data: Partial<IProduct> & { _id?: unknown },
  ): Promise<ProductDoc | null> {
    if (!isValidObjectId(id)) return null;
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
  /**
   * Deletes a single product by ID, optionally verifying the seller.
   * @param id The ID of the product to delete.
   * @param sellerId If provided, ensures the product belongs to this seller.
   * @returns True if a document was actually removed, false otherwise.
   */
  async deleteOne(id: string, sellerId?: string): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    try {
      const filter: Record<string, any> = { _id: id };
      if (sellerId) filter.seller = sellerId; // Non-admins must match seller ID

      const result = await productsModel.deleteOne(filter);
      return result.deletedCount > 0; // True if a document was actually removed
    } catch {
      throw new CustomError(
        "Failed to delete product",
        500,
        "products.deleteOne",
      );
    }
  }
}

export default Products;
