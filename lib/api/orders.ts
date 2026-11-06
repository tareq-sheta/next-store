import { OrderDTO, CreateOrderInput, UpdateOrderInput } from "@/types/orders";
// import { ApiResponse, handleResponse } from "@/utils/general";
import { apiFetch, ApiResponse } from "@/utils/general";
const BASE = "/api/orders";
//----------------------
// export async function fetchAllOrders(): Promise<ApiResponse<OrderDTO[]>> {
//   const res = await fetch(BASE);
//   const response = await handleResponse<OrderDTO[]>(res);
//   console.log("Fetched orders:", response);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch orders");
//   }
//   return response;
// }

export const fetchAllOrders = (): Promise<ApiResponse<OrderDTO[]>> =>
  apiFetch<OrderDTO[]>(BASE);

//----------------------

// export async function fetchOrderById(
//   id: string,
// ): Promise<ApiResponse<OrderDTO>> {
//   const res = await fetch(`${BASE}/${id}`);
//   const response = await handleResponse<OrderDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch order");
//   }
//   return response;
// }

export const fetchOrderById = (id: string): Promise<ApiResponse<OrderDTO>> =>
  apiFetch<OrderDTO>(`${BASE}/${id}`);

//----------------------
// export async function createOrder(
//   data: CreateOrderInput,
// ): Promise<ApiResponse<OrderDTO>> {
//   const res = await fetch(BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   const response = await handleResponse<OrderDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to create order");
//   }
//   return response;
// }
export const createOrder = (
  data: CreateOrderInput,
): Promise<ApiResponse<OrderDTO>> =>
  apiFetch<OrderDTO>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });

//----------------------

// export async function updateOrder(
//   id: string,
//   data: UpdateOrderInput,
// ): Promise<ApiResponse<OrderDTO>> {
//   const res = await fetch(`${BASE}/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   const response = await handleResponse<OrderDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to update order");
//   }
//   return response;
// }
export const updateOrder = (
  id: string,
  data: UpdateOrderInput,
): Promise<ApiResponse<OrderDTO>> =>
  apiFetch<OrderDTO>(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

//----------------------
