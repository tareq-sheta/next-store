"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
// import { products as allProducts } from "@/lib/data";
// import { ProductDTO } from "@/types";
import ProductCard from "@/components/ProductCard";
import { FiSearch } from "react-icons/fi";
import { PublicProductDTO } from "@/types";
// import { IProduct } from "@/models/products";

const CATEGORIES = [
  "all",
  "phones",
  "smartwatch",
  "cameras",
  "headphones",
  "computers",
  "gaming",
];
const PER_PAGE = 12;

export default function ProductsPageContent({
  searchParams,
}: {
  searchParams: Readonly<URLSearchParams>;
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<PublicProductDTO[]>([]);

  const [filtered, setFiltered] = useState<PublicProductDTO[]>([]);
  const [loading, setLoading] = useState(true); // added — show loading state

  // ✅ fetch once on mount only — no dependency on products.length
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          // console.log("Products fetched:", data.data);
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.error);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // ✅ empty array — runs once on mount

  // ✅ filter runs whenever products, search, or category changes
  // now correctly waits for products to be populated
  useEffect(() => {
    const result = products.filter((p: PublicProductDTO) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        category === "all" ||
        p.category.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    });
    setFiltered(result);
    setCurrentPage(1);
  }, [products, search, category]); // ✅ products is a dependency now

  // sync category from URL
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setCategory(cat);
  }, [searchParams]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    router.push(val === "all" ? "/products" : `/products?category=${val}`);
  };

  // ── render ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }
  // console.log(products);
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <span
          className="hover:text-gray-700 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Home
        </span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">Products</span>
      </nav>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800">
          {filtered.length} Product{filtered.length !== 1 ? "s" : ""} Found
        </h4>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Category Select */}
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all"
                  ? "All Categories"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 w-full sm:w-64"
            />
            <button className="bg-gray-900 text-white px-4 py-2 rounded-r-lg hover:bg-gray-700 transition-colors">
              <FiSearch className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {paginated.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>

          <h4 className="text-xl font-semibold text-gray-600">
            No products found
          </h4>
          <p className="text-gray-400 mt-2">
            Try adjusting your search or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginated.map((product) => {
            console.log(product._id);
            return <ProductCard key={product._id} product={product} />;
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
            )
            .reduce<(number | string)[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                    currentPage === p
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
