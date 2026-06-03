import { Product } from "./Products";

export interface CartItem {
  productId: string; // ObjectId serialized to string
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  products: CartItem[];
}
