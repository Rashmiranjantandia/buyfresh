/** Shimmer skeleton for a single cart item row */
export default function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
      {/* Thumbnail */}
      <div className="skeleton w-16 h-16 rounded-xl flex-shrink-0" />

      {/* Details */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-3 w-1/4" />
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2">
        <div className="skeleton w-9 h-9 rounded-lg" />
        <div className="skeleton w-6 h-6 rounded" />
        <div className="skeleton w-9 h-9 rounded-lg" />
      </div>
    </div>
  );
}

/** Stack of skeleton cart items shown while cart is loading on first visit */
export function CartSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
}
