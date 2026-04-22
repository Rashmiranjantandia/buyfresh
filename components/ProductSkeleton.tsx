/** Shimmer skeleton for a single product card — matches ProductCard dimensions exactly */
export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="skeleton w-full h-48 rounded-none" />

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Name */}
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/2" />

        {/* Description */}
        <div className="skeleton h-3 w-full mt-1" />
        <div className="skeleton h-3 w-5/6" />

        {/* Price */}
        <div className="skeleton h-6 w-20 mt-2" />

        {/* Button */}
        <div className="skeleton h-10 w-full rounded-xl mt-auto" />
      </div>
    </div>
  );
}

/** Grid of N skeleton cards — drop-in replacement for the product grid while loading */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
