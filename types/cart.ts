/**
 * Data Transfer Object for a single cart item.
 */
export interface CartItemDTO {
  product: string;
  quantity: number;
}

/**
 * Data Transfer Object for a user's cart.
 */
export interface CartDTO {
  _id: string;
  user: string;
  products: CartItemDTO[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Input required to add an item to the cart via API.
 */
export interface AddToCartInput {
  user: string;
  products: CartItemDTO[];
}
/**
 * Client-side interface for an item in the shopping cart (used by Zustand).
 */
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

/**
 * Client-side interface representing the shopping cart state.
 */
export interface Cart {
  items: CartItem[];
  total: number;
}
