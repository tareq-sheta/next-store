import {
  CategoryDTO,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/categories";

const BASE = "/api/categories";

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

export async function fetchAllCategories(): Promise<CategoryDTO[]> {
  const res = await fetch(BASE);
  return handleResponse<CategoryDTO[]>(res);
}

export async function fetchCategoryById(id: string): Promise<CategoryDTO> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<CategoryDTO>(res);
}

export async function createCategory(
  data: CreateCategoryInput,
): Promise<CategoryDTO> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<CategoryDTO>(res);
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<CategoryDTO> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<CategoryDTO>(res);
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Failed to delete category");
  }
}
