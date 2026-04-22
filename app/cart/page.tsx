'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItemComponent from '@/components/CartItem';
import OrderSummary from '@/components/OrderSummary';
import EmptyState from '@/components/EmptyState';
import { CartSkeleton } from '@/components/CartSkeleton';
import { ArrowRightIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';


export default function CartPage() {
  const { items, totalAmount, totalItems, loading, clearCart, refreshCart } = useCart();
  const [cartError, setCartError] = useState<string | null>(null);

  const handleRefresh = async () => {
    setCartError(null);
    try {
      await refreshCart();
    } catch {
      setCartError('Could not load your cart. Please check your connection.');
    }
  };

  // Show skeleton while loading on first visit (items still empty)
  if (loading && items.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">🛒 Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><CartSkeleton count={3} /></div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">
              <div className="skeleton h-5 w-1/2" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-12 w-full rounded-2xl mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state — show if we know something went wrong
  if (cartError) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">🛒 Your Cart</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">⚠️</span>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Could not load cart</h2>
          <p className="text-gray-500 mb-6 max-w-sm">{cartError}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">🛒 Your Cart</h1>
        <EmptyState
          icon="🛍️"
          title="Your Cart is Empty"
          description="Looks like you haven't added anything yet. Start shopping for fresh groceries!"
          actionLabel="Browse Products"
          actionHref="/"
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          🛒 Your Cart{' '}
          <span className="text-base font-normal text-gray-400 dark:text-gray-500">
            ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-2 rounded-lg transition-all duration-150 active:scale-95 font-medium"
        >
          <TrashIcon className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <CartItemComponent key={item.productId} {...item} />
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <OrderSummary items={items} totalAmount={totalAmount} />

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 hover:scale-[1.02] transition-all duration-200"
            >
              Proceed to Checkout
              <ArrowRightIcon className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="block text-center text-sm text-gray-400 hover:text-green-600 transition-colors duration-150 py-2"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
