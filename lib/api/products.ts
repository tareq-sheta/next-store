// import {
//   ProductDTO,
//   CreateProductInput,
//   UpdateProductInput,
//   AdminProductDTO,
//   SellerProductDTO,
// } from "@/types/products";
// import { ApiResponse, handleResponse } from "@/utils/general";

// let BASE = "/api/products";

// // type ApiResponse<T> = {
// //   success: boolean;
// //   data: T;
// //   error?: string;
// // };
// // async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
// //   const json = await res.json();
// //   try {
// //     if (!res.ok) throw new Error(json.error ?? "Request failed");
// //     return { success: true, data: json.data };
// //   } catch (err) {
// //     return {
// //       success: false,
// //       data: null as unknown as T,
// //       error: err instanceof Error ? err.message : "Unknown error",
// //     };
// //   }
// // }

// export async function fetchAllProductsAdmin(): Promise<
//   ApiResponse<AdminProductDTO[]>
// > {
//   BASE = "/api/admin/products";
//   const res = await fetch(BASE);
//   const response: ApiResponse<AdminProductDTO[]> =
//     await handleResponse<AdminProductDTO[]>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch products");
//   }
//   // return response.data;
//   return response;
// }
// export async function fetchAllProductsSeller(): Promise<
//   ApiResponse<SellerProductDTO[]>
// > {
//   BASE = "/api/dashboard/products";
//   const res = await fetch(BASE);
//   const response: ApiResponse<SellerProductDTO[]> =
//     await handleResponse<SellerProductDTO[]>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch products");
//   }
//   // return response.data;
//   return response;
// }
// export async function fetchAllProductsCustomer(): Promise<
//   ApiResponse<ProductDTO[]>
// > {
//   const res = await fetch(BASE);
//   const response: ApiResponse<ProductDTO[]> =
//     await handleResponse<ProductDTO[]>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch products");
//   }
//   // return response.data;
//   return response;
// }

// export async function fetchProductById(
//   id: string,
// ): Promise<ApiResponse<ProductDTO>> {
//   const res = await fetch(`${BASE}/${id}`);
//   const response = await handleResponse<ProductDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch product");
//   }
//   return response;
//   // return response.data;
// }

// export async function createProduct(
//   data: CreateProductInput,
// ): Promise<ApiResponse<ProductDTO>> {
//   const res = await fetch(BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   const response = await handleResponse<ProductDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to create product");
//   }
//   return response;
// }

// export async function updateProduct(
//   id: string,
//   data: UpdateProductInput,
// ): Promise<ApiResponse<ProductDTO>> {
//   const res = await fetch(`${BASE}/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   const response = await handleResponse<ProductDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to update product");
//   }
//   // return response.data;
//   return response;
// }

// export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
//   const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
//   const response = await handleResponse<void>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to delete product");
//   }
//   return response;
// }

//--------------
//--------------
//--------------
import type {
  PublicProductDTO,
  SellerProductDTO,
  AdminProductDTO,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/products";
import { apiFetch, ApiResponse } from "@/utils/general";
// import { ApiResponse, handleResponse } from "@/utils/general copy";
// import { ApiResponse  } from "@/utils/general";
// import { id } from "zod/locales";
// import { ApiResponse, handleResponse } from "@/utils/general";

const BASE = "/api/products";
const SELLER_DASHBOARD_BASE = "/api/dashboard/products";
const ADMIN_DASHBOARD_BASE = "/api/admin/products";

//---------------
// export async function fetchAllProducts(): Promise<ApiResponse<ProductDTO[]>> {
//   const res = await fetch(BASE);
//   const response: ApiResponse<ProductDTO[]> =
//     await handleResponse<ProductDTO[]>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch products");
//   }
//   return response;
// }
//---------------
// lib/api/products.ts
// import { apiFetch, ApiResponse } from "./client";
// import { PublicProductDTO, CreateProductInput } from "@/types/products";
//-----------------
//-----------------
//-----------------
//-----------------
//-----------------

// Public product fetch endpoint
// /api/products/ public fetch for customers and unauthenticated users
// with minimal product details for better performance.
export const fetchAllProducts = (
  queryString?: string,
): Promise<ApiResponse<PublicProductDTO[]>> =>
  apiFetch<PublicProductDTO[]>(
    `${BASE}${queryString ? `?${queryString}` : ""}`,
    {
      next: { revalidate: 60, tags: ["products"] },
    },
  );

export const fetchProductById = (
  id: string,
): Promise<ApiResponse<PublicProductDTO>> =>
  apiFetch<PublicProductDTO>(`${BASE}/${encodeURIComponent(id)}`, {
    next: { revalidate: 60, tags: [`product-${id}`] },
  });

export const createProduct = (
  data: CreateProductInput,
): Promise<ApiResponse<SellerProductDTO>> =>
  // apiFetch<SellerProductDTO>(BASE, {
  apiFetch<SellerProductDTO>(SELLER_DASHBOARD_BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });

//---------------

// Seller/admin dashboard listing — real stock counts, seller info for
// admins. The public fetchAllProducts() above returns PublicProductDTO,
// which has `inStock: boolean`, not `stock: number` — using that on the
// dashboard silently produced blank/zero stock numbers.
//---------------
// export async function fetchSellerDashboardProducts(): Promise<
// ApiResponse<SellerProductDTO[]>
// > {
//   const res = await fetch(SELLER_DASHBOARD_BASE);
//   const response = await handleResponse<SellerProductDTO[]>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch dashboard products");
//   }
//   return response;
// }
export const fetchSellerDashboardProducts = (): Promise<
  ApiResponse<SellerProductDTO[]>
> => apiFetch<SellerProductDTO[]>(SELLER_DASHBOARD_BASE, { cache: "no-store" });
// const response = await handleResponse<SellerProductDTO[]>(res);
// if (!response.success) {
//   throw new Error(response.error ?? "Failed to fetch dashboard products");
// }
// return response;

//---------------

// export async function fetchAdminDashboardProducts(): Promise<
//   ApiResponse<AdminProductDTO[]>
// > {
//   const res = await fetch(ADMIN_DASHBOARD_BASE);
//   const response = await handleResponse<AdminProductDTO[]>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch dashboard products");
//   }
//   return response;
// }
//-----------------------
// export const fetchAdminDashboardProducts = (): Promise<
//   ApiResponse<AdminProductDTO[]>
// > => apiFetch<AdminProductDTO[]>(ADMIN_DASHBOARD_BASE, { cache: "no-store" });
export const fetchAdminDashboardProducts = async (): Promise<
  ApiResponse<AdminProductDTO[]>
> => {
  const res = await apiFetch<AdminProductDTO[]>(ADMIN_DASHBOARD_BASE, {
    cache: "no-store",
  });
  console.log("res in fetchAdminDashboardProducts", res); // here i tis not retriving items

  return res;
};
export const fetchTopProducts = async (
  category?: string,
  limit?: number,
  excludeId?: string,
  sellerId?: string,
): Promise<ApiResponse<PublicProductDTO[]>> => {
  const res = await apiFetch<PublicProductDTO[]>(
    `/api/products/top${limit ? `?limit=${limit}` : ""}${category ? `&category=${category}` : ""}${excludeId ? `&excludeId=${excludeId}` : ""}${sellerId ? `&sellerId=${sellerId}` : ""}`,
    {
      cache: "no-store",
    },
  );
  // console.log("res in fetchTopProducts", res); // here i tis not retriving items

  return res;
};

//-----------------------
// export async function fetchProductById(
//   id: string,
// ): Promise<ApiResponse<ProductDTO>> {
//   const res = await fetch(`${BASE}/${id}`);
//   const response = await handleResponse<ProductDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to fetch product");
//   }
//   return response;
// }

// export async function createProduct(
//   data: CreateProductInput,
// ): Promise<ApiResponse<ProductDTO>> {
//   const res = await fetch(BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   const response = await handleResponse<ProductDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to create product");
//   }
//   return response;
// }
//--------------------
// export async function updateProduct(
//   id: string,
//   data: UpdateProductInput,
// ): Promise<ApiResponse<ProductDTO>> {
//   const res = await fetch(`${BASE}/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   const response = await handleResponse<ProductDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to update product");
//   }
//   return response;
// }
export const updateProduct = (
  id: string,
  data: UpdateProductInput,
): Promise<ApiResponse<AdminProductDTO>> =>
  apiFetch<AdminProductDTO>(`${BASE}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
//   const response = await handleResponse<ProductDTO>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to update product");
//   }
//   return response;

//--------------------

// export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
//   const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
//   const response = await handleResponse<void>(res);
//   if (!response.success) {
//     throw new Error(response.error ?? "Failed to delete product");
//   }
//   return response;
// }
export const deleteProduct = (id: string): Promise<ApiResponse<void>> =>
  apiFetch<void>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });

//--------------------
