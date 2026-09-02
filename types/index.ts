export type {
  UserDTO,
  CurrentUser,
  CreateUserInput,
  UpdateUserInput,
  SessionUser,
  AddressDTO,
  UserRole,
  AuthProvider,
} from "./users";

export type {
  PublicProductDTO,
  SellerProductDTO,
  AdminProductDTO,
  CreateProductInput,
  UpdateProductInput,
} from "./products";

export type { CartDTO, CartItemDTO, AddToCartInput, CartItem } from "./cart";

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

/** Client-side cart line used by Zustand (not the API CartDTO) */

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
