'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
}

// Category → emoji fallback for when the image URL fails to load
const CATEGORY_FALLBACK: Record<string, string> = {
  'Grains & Pulses': '🌾',
  'Dairy & Eggs':    '🥛',
  Fruits:            '🍎',
  Vegetables:        '🥦',
  Snacks:            '🍿',
  Beverages:         '☕',
  Household:         '🧹',
  Spices:            '🌶️',
};

export default function ProductCard({ product }: { product: Product }) {
  const { items, addToCart, updateQuantity } = useCart();
  const [addedFeedback, setAddedFeedback]   = useState(false);
  const [imgError, setImgError]             = useState(false);

  const cartItem = items.find((i) => i.productId === product._id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart({
      productId: product._id,
      name:      product.name,
      price:     product.price,
      image:     product.image,
      unit:      product.unit,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleIncrease = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product._id, quantity + 1); };
  const handleDecrease = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product._id, quantity - 1); };

  const fallbackEmoji = CATEGORY_FALLBACK[product.category] ?? '🛒';

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col animate-fade-in">

      {/* ── Product Image ─────────────────────────────────────────────── */}
      <div className="relative w-full h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden flex-shrink-0">

        {/* Image or Fallback */}
        {product.image && !imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback: gradient background + category emoji */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
            <span className="text-6xl mb-1" role="img" aria-label={product.category}>
              {fallbackEmoji}
            </span>
            <span className="text-xs text-green-600 font-medium opacity-70">
              {product.category}
            </span>
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-white/90 backdrop-blur-sm text-green-700 rounded-full shadow-sm z-10">
          {product.category}
        </span>

        {/* Low-stock Badge */}
        {product.stock > 0 && product.stock < 20 && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 bg-orange-500 text-white rounded-full shadow-sm z-10">
            Only {product.stock} left
          </span>
        )}

        {/* Out-of-Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="text-white font-bold text-base">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Product Info ──────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Name — always 2 lines to keep all cards the same height */}
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Description — always 2 lines */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed flex-1 min-h-[2rem]">
          {product.description || 'Fresh and high quality.'}
        </p>

        {/* Price + Unit */}
        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-50">₹{product.price}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{product.unit}</span>
        </div>

        {/* ── Cart Controls ────────────────────────────────────────── */}
        {product.stock === 0 ? (
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-sm font-medium cursor-not-allowed"
          >
            Out of Stock
          </button>

        ) : quantity === 0 ? (
          <button
            onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm
              ${addedFeedback
                ? 'bg-green-600 text-white scale-95'
                : 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 hover:shadow-md hover:scale-105 active:scale-95'
              }`}
          >
            {addedFeedback ? (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCartIcon className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>

        ) : (
          <div className="flex items-center justify-between bg-green-50 dark:bg-gray-700/60 border dark:border-gray-600 rounded-xl p-1">
            <button
              onClick={handleDecrease}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg shadow-sm text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 transition-all duration-150 hover:scale-110 active:scale-90"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="font-bold text-gray-800 dark:text-white text-base w-8 text-center">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="w-9 h-9 flex items-center justify-center bg-green-600 dark:bg-green-500 rounded-lg shadow-sm text-white hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-150 hover:scale-110 active:scale-90"
              aria-label="Increase quantity"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
