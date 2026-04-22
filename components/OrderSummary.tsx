import { CartItem } from '@/context/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
  showTitle?: boolean;
}

export default function OrderSummary({ items, totalAmount, showTitle = true }: OrderSummaryProps) {
  // ✅ DELIVERY RULE: Free above ₹99, otherwise ₹40
  const deliveryFee = totalAmount > 99 ? 0 : 40;
  const finalTotal = totalAmount + deliveryFee;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      {showTitle && (
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span>🧾</span> Order Summary
        </h2>
      )}

      {/* Item List */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <div className="flex-1 min-w-0">
              <span className="text-gray-700 dark:text-gray-200 font-medium line-clamp-1">{item.name}</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs block">{item.unit}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-gray-400 dark:text-gray-500 text-xs">×{item.quantity}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-200 dark:border-gray-600 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span className="text-green-600 dark:text-green-400 font-medium">FREE 🎉</span>
          ) : (
            <span>₹{deliveryFee}</span>
          )}
        </div>
        {deliveryFee > 0 && (
          <p className="text-xs text-orange-500 dark:text-orange-400">
            Add ₹{(99 - totalAmount).toFixed(0)} more for free delivery!
          </p>
        )}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between font-bold text-gray-900 dark:text-gray-50 text-base">
          <span>Total</span>
          <span className="text-green-600 dark:text-green-400">₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
