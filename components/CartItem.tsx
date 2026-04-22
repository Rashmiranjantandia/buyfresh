'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export default function CartItem({ productId, name, price, quantity, image, unit }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 animate-slide-up">
      {/* Product Image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-green-50 flex-shrink-0">
        <Image
          src={image || '/placeholder.png'}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug line-clamp-2 mb-1">
          {name}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{unit}</p>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-500 dark:text-gray-400">₹{price}</span>
          <span className="text-gray-300 dark:text-gray-600">×</span>
          <span className="text-gray-500 dark:text-gray-400">{quantity}</span>
          <span className="text-gray-300 dark:text-gray-600">=</span>
          <span className="font-bold text-green-600 dark:text-green-400">₹{(price * quantity).toFixed(2)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end gap-2">
        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(productId)}
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-150 active:scale-90"
          title="Remove item"
        >
          <TrashIcon className="w-4 h-4" />
        </button>

        {/* Quantity Controls */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1">
          <button
            onClick={() => updateQuantity(productId, quantity - 1)}
            className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg shadow-sm text-gray-600 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-150 hover:scale-110 active:scale-90"
          >
            <MinusIcon className="w-3 h-3" />
          </button>
          <span className="font-bold text-gray-800 dark:text-white text-sm w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(productId, quantity + 1)}
            className="w-7 h-7 flex items-center justify-center bg-green-600 dark:bg-green-500 rounded-lg shadow-sm text-white hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-150 hover:scale-110 active:scale-90"
          >
            <PlusIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
