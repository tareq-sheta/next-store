import { OrderDoc } from "@/models/orders";
import { Types } from "mongoose";

/**
 * Valid overall statuses for an order.
 */
export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

/**
 * Data Transfer Object for an order item where the product is populated as a string ID.
 */
export interface OrderItemPopulatedDTO {
  product: string;
  quantity: number;
  productStatus: OrderStatus;
}

/**
 * Data Transfer Object for an order item with fully populated product data.
 */
export interface OrderItemDTO {
  product: PopulatedProductInOrder;
  quantity: number;
  productStatus: OrderStatus;
}

/**
 * Data Transfer Object for an Order, safely returned to the client.
 */
export interface OrderDTO {
  _id: string;
  user: PopulatedUser; // Note: consider making a UserDTO if you also stringify the user._id
  products: OrderItemDTO[]; // <-- Changed from PopulatedOrderItem[]
  orderStatus: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
/**
 * Fully populated order representation, including user and product details.
 */
export interface PopulatedOrderDTO {
  _id: string | Types.ObjectId;
  user: PopulatedUser; // Note: consider making a UserDTO if you also stringify the user._id
  products: PopulatedOrderItem[]; // <-- Changed from PopulatedOrderItem[]
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input type for creating a new order via API.
 */
export interface CreateOrderInput {
  user: string;
  products: Array<{
    product: string;
    quantity: number;
    productStatus?: OrderStatus;
  }>;
  // No top-level status field — a new order's orderStatus is derived from
  // its items (which default to "pending") the moment it's created.
}

// Buyer/admin — full item-list replacement. Still no orderStatus field;
// Orders.update() recalculates it from whatever products array is sent.

export interface UpdateOrderInput {
  products?: Array<{
    product: string;
    quantity: number;
    productStatus?: OrderStatus;
  }>;
}

// Seller — status only, and only ever applies to their own line items;
// the server determines which items that is, the client can't specify it.
export interface UpdateOrderItemStatusInput {
  productStatus: OrderStatus;
}

export interface PopulatedUser {
  _id: Types.ObjectId;
  userName: string;
  email: string;
}
export interface PopulatedProductInOrder {
  _id: string;
  name: string;
  price: number;
  image: string;
  // images: string[];
}

export interface PopulatedOrderItem {
  product: PopulatedProductInOrder;
  quantity: number;
  unitPrice: number;
  productStatus: OrderStatus;
}
export interface PopulatedOrderDoc extends Omit<OrderDoc, "user" | "products"> {
  user: PopulatedUser;
  products: PopulatedOrderItem[];
}
