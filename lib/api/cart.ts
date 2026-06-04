import { CartDTO, AddToCartInput } from "@/types/cart";

const BASE = "/api/cart";

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

export async function fetchCart(userId: string): Promise<CartDTO> {
  const res = await fetch(`${BASE}?userId=${encodeURIComponent(userId)}`);
  return handleResponse<CartDTO>(res);
}

export async function addToCart(input: AddToCartInput): Promise<CartDTO> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<CartDTO>(res);
}

export async function removeFromCart(
  userId: string,
  productId: string,
): Promise<CartDTO> {
  const res = await fetch(
    `${BASE}/${productId}?userId=${encodeURIComponent(userId)}`,
    { method: "DELETE" },
  );
  return handleResponse<CartDTO>(res);
}

export async function clearCart(userId: string): Promise<CartDTO> {
  const res = await fetch(`${BASE}/clear?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
  return handleResponse<CartDTO>(res);
}
