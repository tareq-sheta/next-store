"use client";
import { PublicProductDTO } from "@/types/products";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { fetchTopProducts } from "@/lib";

export default function TopProducts({
  category,
  limit,
  excludeId,
}: {
  category?: string;
  limit?: number;
  excludeId?: string;
}) {
  const [products, setProducts] = useState<PublicProductDTO[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetchTopProducts(category, limit, excludeId);
      if (!res.success) return;
      console.log(res.data);
      setProducts(res.data);
    };
    fetchProducts();
  }, [limit, category]);
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Featured Products
        </h2>
        <Link
          href="/products"
          className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-150 transition-colors"
        >
          View All →
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-400 py-12">
          No products available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{ ...product, _id: product._id }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
