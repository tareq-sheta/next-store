import {
  CategoryDTO,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/categories";
// import { ApiResponse, handleResponse } from "@/utils/general";
import { apiFetch, ApiResponse } from "@/utils/general";

const BASE = "/api/categories";
//----------------
// export async function fetchAllCategories(): Promise<
//   ApiResponse<CategoryDTO[]>
// > {
//   const res = await fetch(BASE);
//   return handleResponse<CategoryDTO[]>(res);
// }
export const fetchAllCategories = (): Promise<ApiResponse<CategoryDTO[]>> =>
  apiFetch<CategoryDTO[]>(BASE);

//----------------
// export async function fetchCategoryById(
//   id: string,
// ): Promise<ApiResponse<CategoryDTO>> {
//   const res = await fetch(`${BASE}/${id}`);
//   return handleResponse<CategoryDTO>(res);
// }
export const fetchCategoryById = (
  id: string,
): Promise<ApiResponse<CategoryDTO>> => apiFetch<CategoryDTO>(`${BASE}/${id}`);

//----------------
// export async function createCategory(
//   data: CreateCategoryInput,
// ): Promise<ApiResponse<CategoryDTO>> {
//   const res = await fetch(BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return handleResponse<CategoryDTO>(res);
// }
export const createCategory = (
  data: CreateCategoryInput,
): Promise<ApiResponse<CategoryDTO>> =>
  apiFetch<CategoryDTO>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });

//----------------

// export async function updateCategory(
//   id: string,
//   data: UpdateCategoryInput,
// ): Promise<ApiResponse<CategoryDTO>> {
//   const res = await fetch(`${BASE}/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return handleResponse<CategoryDTO>(res);
// }
export const updateCategory = (
  id: string,
  data: UpdateCategoryInput,
): Promise<ApiResponse<CategoryDTO>> =>
  apiFetch<CategoryDTO>(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

//----------------

// export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
//   const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
//   if (!res.ok) {
//     const json = await res.json();
//     throw new Error(json.error ?? "Failed to delete category");
//   }
//   return handleResponse<void>(res);
// }
export const deleteCategory = (id: string): Promise<ApiResponse<void>> =>
  apiFetch<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });
//----------------
