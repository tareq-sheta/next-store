import { Types } from "mongoose";
import { ProductDoc } from "@/models/products";

/**
 * Valid product categories.
 */
export type ProductCategory =
  | "phones"
  | "smartwatch"
  | "headphones"
  | "cameras"
  | "computers"
  | "gaming"
  | "others";

/**
 * Valid stock statuses.
 */
export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
/**
 * Data Transfer Object for a product intended for public storefront display.
 */
export interface PublicProductDTO {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  description: string;
  stockStatus: StockStatus;

  createdAt: string;
  updatedAt: string;
}

/**
 * Data Transfer Object for a product displayed in a seller's dashboard.
 * Includes precise stock levels instead of just status.
 */
export interface SellerProductDTO extends Omit<
  PublicProductDTO,
  "stockStatus"
> {
  stock: number;
  unitsSold: number;
}

/**
 * Data Transfer Object for a product displayed in the admin panel.
 * Includes seller identification details.
 */
export interface AdminProductDTO extends SellerProductDTO {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
}

export interface PopulatedSeller {
  _id: Types.ObjectId;
  userName: string;
  email: string;
}

export interface PopulatedProductDoc extends Omit<ProductDoc, "seller"> {
  seller: PopulatedSeller;
}

export type AdminProductDoc = PopulatedProductDoc;

export type {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validations/products";

// handlers/products.ts and lib/api/products.ts import this name — it was
// never exported here, so both files failed to compile. PublicProductDTO
// matches how those two files actually use it (a plain fetched product,
// no seller-only fields).
export type { PublicProductDTO as ProductDTO };
