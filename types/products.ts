// types/products.ts

export type ProductCategory = "electronics" | "clothing" | "home" | "books" | "toys" | "other";

export interface ProductDTO {
  _id: string;
  name: string;
  sellerEmail: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  fav?: boolean;
  stock: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sellerEmail: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  fav?: boolean;
  stock?: number;
  quantity: number;
}

export interface UpdateProductInput {
  name?: string;
  sellerEmail?: string;
  price?: number;
  description?: string;
  category?: ProductCategory;
  image?: string;
  fav?: boolean;
  stock?: number;
  quantity?: number;
}
