// app/products/page.tsx
import { Suspense } from "react";
import connectToDatabase from "@/lib/database";
import Products from "@/models/products";
import SearchAndFilter from "@/components/SearchAndFilter";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";
import { toPublicProductDTO } from "@/lib/dto";
import Pagination from "@/components/Pagination";
// import { ProductCategory } from "@/types";
import {
  ProductCategory,
  VALID_CATEGORIES,
} from "@/lib/validations/categories";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}
// function parseCategory(value: string | undefined): ProductCategory | undefined {
//   if (!value || value === "all") return undefined;
//   return CATEGORY_DEFINITIONS.map((c) => c.name.toLowerCase()).includes(
//     value.toLowerCase(),
//   )
//     ? (value as ProductCategory)
//     : undefined; // invalid category param is silently ignored, not passed to the DB
// }
function parseCategory(value: string | undefined): ProductCategory | undefined {
  if (!value || value === "all") return undefined;
  return VALID_CATEGORIES.find((slug) => slug === value.toLowerCase());
}
// Async component that fetches products from DB
async function ProductGrid({ searchParams }: PageProps) {
  const { category, search, page = "1" } = await searchParams;

  await connectToDatabase();
  const productsRepo = new Products();
  let itemsPerPage = 12;
  const { items, total } = await productsRepo.showPublic({
    // category: category !== "all" ? (category as any) : undefined,
    category: parseCategory(category),
    search: search ? search : undefined,
    page: parseInt(page),
    limit: itemsPerPage,
  });
  const products = items.map(toPublicProductDTO);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        No products found matching your search.
      </div>
    );
  }

  const totalPages = Math.ceil(total / itemsPerPage);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <Pagination totalPages={totalPages} currentPage={parseInt(page)} />
    </>
  );
}

export default function ProductsPage(props: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ⚡ Rendered IMMEDIATELY on client */}
      <Suspense fallback={null}>
        <SearchAndFilter />
      </Suspense>

      {/* ⚡ Streams product cards with Skeleton fallback */}
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductGrid {...props} />
      </Suspense>
    </div>
  );
}
