// components/AddToCart.tsx
"use client";
import { useState } from "react";
import { PublicProductDTO } from "@/types/products";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

interface AddToCartButtonProps {
  product: PublicProductDTO;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.stockStatus === "OUT_OF_STOCK"}
      className={`w-full md:w-auto px-10 py-3 rounded-lg font-semibold text-base transition-all ${
        added
          ? "bg-green-600 text-white"
          : "bg-gray-900 text-white hover:bg-gray-700"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {added ? "✓ Added to Cart!" : "Add to Cart"}
    </button>
  );
}
