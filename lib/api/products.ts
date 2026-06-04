import {
  ProductDTO,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/products";

const BASE = "/api/products";

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Request failed");
  }
  return json.data;
}

export async function fetchAllProducts(): Promise<ProductDTO[]> {
  const res = await fetch(BASE);
  return handleResponse<ProductDTO[]>(res);
}

export async function fetchProductById(id: string): Promise<ProductDTO> {
  const res = await fetch(`${BASE}/${id}`);
  return handleResponse<ProductDTO>(res);
}

export async function createProduct(
  data: CreateProductInput,
): Promise<ProductDTO> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ProductDTO>(res);
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
): Promise<ProductDTO> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ProductDTO>(res);
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Failed to delete product");
  }
}
