// types/cart.ts

export interface CartItemDTO {
  product: string;
  quantity: number;
}

export interface CartDTO {
  _id: string;
  user: string;
  products: CartItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartInput {
  user: string;
  products: CartItemDTO[];
}
