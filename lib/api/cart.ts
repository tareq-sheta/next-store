import { CartDTO, AddToCartInput } from "@/types/cart";
// import { ApiResponse, handleResponse } from "@/utils/general";
import { apiFetch, ApiResponse } from "@/utils/general";

const BASE = "/api/cart";

// async function handleResponse<T>(res: Response): Promise<T> {
//   const json = await res.json();
//   if (!res.ok) {
//     throw new Error(json.error ?? "Request failed");
//   }
//   return json.data;
// }
//------------------------------
// export async function fetchCart(userId: string): Promise<ApiResponse<CartDTO>> {
//   const res = await fetch(`${BASE}?userId=${encodeURIComponent(userId)}`);
//   return handleResponse<CartDTO>(res);
// }
export const fetchCart = (userId: string): Promise<ApiResponse<CartDTO>> =>
  apiFetch<CartDTO>(`${BASE}?userId=${encodeURIComponent(userId)}`, {
    cache: "no-store",
  });

//------------------------------
// export async function addToCart(
//   input: AddToCartInput,
// ): Promise<ApiResponse<CartDTO>> {
//   const res = await fetch(BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(input),
//   });
//   return handleResponse<CartDTO>(res);
// }
export async function addToCart(
  input: AddToCartInput,
): Promise<ApiResponse<CartDTO>> {
  return apiFetch<CartDTO>(BASE, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

//------------------------------
// export async function removeFromCart(
//   userId: string,
//   productId: string,
// ): Promise<ApiResponse<CartDTO>> {
//   const res = await fetch(
//     `${BASE}/${productId}?userId=${encodeURIComponent(userId)}`,
//     { method: "DELETE" },
//   );
//   return handleResponse<CartDTO>(res);
// }
export async function removeFromCart(
  userId: string,
  productId: string,
): Promise<ApiResponse<CartDTO>> {
  return apiFetch<CartDTO>(
    `${BASE}/${productId}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  );
}

//------------------------------
// export async function clearCart(userId: string): Promise<ApiResponse<CartDTO>> {
//   const res = await fetch(
//     `${BASE}/clear?userId=${encodeURIComponent(userId)}`,
//     {
//       method: "DELETE",
//     },
//   );
//   return handleResponse<CartDTO>(res);
// }
export async function clearCart(userId: string): Promise<ApiResponse<CartDTO>> {
  return apiFetch<CartDTO>(
    `${BASE}/clear?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    },
  );
}
//------------------------------
