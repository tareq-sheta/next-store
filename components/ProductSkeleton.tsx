// components/ProductSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
      {/* Category Pill Skeleton */}
      <div className="w-16 h-3 bg-gray-200 rounded mb-2" />
      {/* Title Skeleton */}
      <div className="w-3/4 h-5 bg-gray-200 rounded mb-3" />
      {/* Price & Button Skeleton */}
      <div className="flex items-center justify-between mt-auto">
        <div className="w-16 h-6 bg-gray-200 rounded" />
        <div className="w-20 h-8 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
