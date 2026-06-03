"use client";

import Hero from "@/components/Hero";
import CategoryMain from "@/components/CategoryMain";
import ProductCard from "@/components/ProductCard";
import SalePanner from "@/components/SalePanner";
import Link from "next/link";
// import { products } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Product } from "@/types";

function HomeContent() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  // const featured = products.slice(0, 8);

  useEffect(() => {
    if (searchParams.get("order") === "success") {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  useEffect(() => {
    let getData = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.error);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getData();
  }, []);

  return (
    <>
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Thank you for your purchase!
        </div>
      )}

      <Hero />
      <CategoryMain />

      {/* Featured Products */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <SalePanner />
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-gray-400">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
