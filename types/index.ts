export type {
  UserDTO,
  CreateUserInput,
  UpdateUserInput,
  SessionUser,
  AddressDTO,
  UserRole,
  AuthProvider,
} from "./users";

export type {
  ProductDTO,
  CreateProductInput,
  UpdateProductInput,
  ProductCategory,
} from "./products";

export type { CartDTO, CartItemDTO, AddToCartInput } from "./cart";

export type {
  OrderDTO,
  CreateOrderInput,
  UpdateOrderInput,
  OrderStatus,
  OrderItemDTO,
} from "./orders";

export type {
  CategoryDTO,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./categories";

/** @deprecated Use UserDTO — kept for existing store/UI code */
export type User = import("./users").UserDTO & {
  id: string;
  selectedAddressIndex?: number;
};

/** @deprecated Use ProductDTO — kept for existing store/UI code */
export type Product = import("./products").ProductDTO & { id: string | number };

/** Client-side cart line used by Zustand (not the API CartDTO) */
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  cartQuantity: number;
  image: string;
  category?: string;
}

/** Client-side cart shape used by Zustand (not the API CartDTO) */
export interface Cart {
  items: CartItem[];
  total: number;
}
