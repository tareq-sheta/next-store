import { ProductDTO, UpdateProductInput } from "@/types/products";

export async function getAllProducts(): Promise<ProductDTO[]> {
  const res = await fetch("/api/products", {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to fetch products");
  }

  const { data } = await res.json();
  return data;
}

export async function getOneProduct(id: string): Promise<ProductDTO> {
  const res = await fetch(`/api/products/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to fetch product");
  }

  const { data } = await res.json();
  return data;
}

export async function updateProduct(
  id: string,
  product: UpdateProductInput,
): Promise<ProductDTO> {
  const res = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? "Failed to update product");
  }

  const { data } = await res.json();
  return data;
}
