"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useAuthStore, useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
// import { IProduct } from "@/models/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {product.category}
          </span>
          <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
