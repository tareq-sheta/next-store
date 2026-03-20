import { Suspense } from "react";
import ProductsPageContent from "@/components/ProductsPageContent";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-gray-400">
          Loading products...
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
