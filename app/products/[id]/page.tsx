"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/lib/data";
import { useAuthStore, useCartStore } from "@/lib/store";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { FaTruck, FaShieldAlt, FaShoppingCart } from "react-icons/fa";

const COLORS = [
  { name: "Black", bg: "bg-black" },
  { name: "Gray", bg: "bg-gray-500" },
  { name: "Blue", bg: "bg-blue-600" },
  { name: "Gold", bg: "bg-yellow-500" },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <Link
          href="/products"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link href="/products" className="hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Main Product */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="bg-gray-50 rounded-2xl flex items-center justify-center p-8 min-h-[350px] relative">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain max-h-[350px]"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm text-gray-400 uppercase tracking-wide mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </span>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Available Colors:
            </p>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  title={c.name}
                  aria-label={`Select ${c.name}`}
                  className={`w-9 h-9 rounded-full ${c.bg} transition-transform hover:scale-110 ${
                    selectedColor === c.name
                      ? "ring-2 ring-offset-2 ring-gray-800"
                      : ""
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Selected: {selectedColor}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full md:w-auto px-10 py-3 rounded-lg font-semibold text-base transition-all ${
              added
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-white hover:bg-gray-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
            {[
              { icon: <FaTruck />, title: "Free Delivery", sub: "1-2 days" },
              {
                icon: <FaShoppingCart />,
                title: "Stock Status",
                sub: `${product.stock > 0 ? "In Stock" : "Out of Stock"}`,
              },
              {
                icon: <FaShieldAlt />,
                title: "Guaranteed",
                sub: "1 Year Warranty",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center gap-2"
              >
                <span className="text-xl text-gray-700">{f.icon}</span>
                <p className="text-xs font-semibold text-gray-800">{f.title}</p>
                <p className="text-xs text-gray-400">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
