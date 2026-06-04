import {
  OrderDTO,
  CreateOrderInput,
  UpdateOrderInput,
} from "@/types/orders";

const BASE = "/api/orders";

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

export async function fetchAllOrders(userId?: string): Promise<OrderDTO[]> {
  const url = userId ? `${BASE}?userId=${encodeURIComponent(userId)}` : BASE;
  const res = await fetch(url);
  return handleResponse<OrderDTO[]>(res);
}

export async function fetchOrderById(id: string): Promise<OrderDTO> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<OrderDTO>(res);
}

export async function createOrder(data: CreateOrderInput): Promise<OrderDTO> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<OrderDTO>(res);
}

export async function updateOrder(
  id: string,
  data: UpdateOrderInput,
): Promise<OrderDTO> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<OrderDTO>(res);
}
