export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface OrderItemDTO {
  product: string;
  quantity: number;
  status: OrderStatus;
}

export interface OrderDTO {
  _id: string;
  user: string;
  products: OrderItemDTO[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  user: string;
  products: Array<{
    product: string;
    quantity: number;
    status?: OrderStatus;
  }>;
  status?: OrderStatus;
}

export interface UpdateOrderInput {
  products?: Array<{
    product: string;
    quantity: number;
    status?: OrderStatus;
  }>;
  status?: OrderStatus;
}
