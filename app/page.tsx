import Hero from "@/components/Hero";
import CategoryMain from "@/components/CategoryMain";
import ProductCard from "@/components/ProductCard";
import SalePanner from "@/components/SalePanner";
import Link from "next/link";
import { ProductDTO } from "@/types/products";
 
async function getProducts(): Promise<ProductDTO[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}
 
export default async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const products = await getProducts();
  const params = await searchParams;
  const orderSuccess = params.order === "success";
 
  return (
    <>
      {orderSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Thank you for your purchase!
        </div>
      )}
 
      <Hero />
      <CategoryMain />
 
      {/* Featured Products */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Products</h2>
          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All →
          </Link>
        </div>
 
        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={{ ...product, id: product._id }} />
            ))}
          </div>
        )}
      </section>
 
      <SalePanner />
    </>
  );
}