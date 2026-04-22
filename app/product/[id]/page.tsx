'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

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

export default function ProductDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = params?.id as string;

  const { items, addToCart, updateQuantity } = useCart();

  const [product, setProduct]   = useState<Product | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [addedFx, setAddedFx]   = useState(false);
  const [localQty, setLocalQty] = useState(1); // quantity picker before adding to cart

  const cartItem = product ? items.find((i) => i.productId === product._id) : null;
  const cartQty  = cartItem?.quantity ?? 0;

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Product not found');
        setProduct(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart({
      productId: product._id,
      name:      product.name,
      price:     product.price,
      image:     product.image,
      unit:      product.unit,
    });
    if (localQty > 1) {
      await updateQuantity(product._id, localQty);
    }
    setAddedFx(true);
    setTimeout(() => setAddedFx(false), 2000);
  };

  const handleIncrease = () => product && updateQuantity(product._id, cartQty + 1);
  const handleDecrease = () => product && updateQuantity(product._id, cartQty - 1);

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="skeleton h-8 w-32 mb-6 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton aspect-square rounded-3xl" />
          <div className="space-y-4 pt-2">
            <div className="skeleton h-4 w-24 rounded-full" />
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-8 w-1/2" />
            <div className="skeleton h-4 w-full mt-4" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-4/6" />
            <div className="skeleton h-10 w-32 mt-4" />
            <div className="skeleton h-14 w-full rounded-2xl mt-2" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <ExclamationTriangleIcon className="w-16 h-16 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Product Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">{error || 'This product may have been removed.'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-semibold rounded-xl transition-colors active:scale-95"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  const fallbackEmoji = CATEGORY_FALLBACK[product.category] ?? '🛒';
  const isOutOfStock  = product.stock === 0;
  const isLowStock    = product.stock > 0 && product.stock < 20;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">

      {/* ── Breadcrumb / Back ───────────────────────────────────────── */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* ── Left: Image ─────────────────────────────────────────── */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 shadow-lg">
          {product.image && !imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              onError={() => setImgError(true)}
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-9xl mb-2">{fallbackEmoji}</span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium opacity-70">{product.category}</span>
            </div>
          )}

          {/* Category pill */}
          <span className="absolute top-4 left-4 text-sm font-semibold px-3 py-1.5 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-green-700 dark:text-green-400 rounded-full shadow-sm">
            {product.category}
          </span>

          {/* Stock badges */}
          {isLowStock && (
            <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 bg-orange-500 text-white rounded-full shadow-sm">
              Only {product.stock} left!
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-xl px-6 py-2 bg-black/60 rounded-2xl">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* ── Right: Details ──────────────────────────────────────── */}
        <div className="flex flex-col justify-center py-2">

          {/* Category tag */}
          <span className="inline-flex items-center text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full w-fit mb-3">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
            <span className="text-base text-gray-500 dark:text-gray-400 font-medium">{product.unit}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-base">
            {product.description}
          </p>

          {/* Low stock warning */}
          {isLowStock && (
            <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-2.5 mb-5">
              <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
              Only {product.stock} units remaining — order soon!
            </div>
          )}

          {/* ── Cart Controls ────────────────────────────────────── */}
          {isOutOfStock ? (
            <div className="rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-center py-4 font-semibold text-lg">
              Out of Stock
            </div>

          ) : cartQty === 0 ? (
            /* Pre-add: qty picker + Add to Cart */
            <div className="space-y-4">
              {/* Quantity picker */}
              <div className="flex items-center gap-0 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-1 w-fit">
                <button
                  onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                  disabled={localQty <= 1}
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm transition-all disabled:opacity-40 active:scale-90"
                  aria-label="Decrease"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-gray-800 dark:text-white text-lg">{localQty}</span>
                <button
                  onClick={() => setLocalQty((q) => Math.min(product.stock, q + 1))}
                  disabled={localQty >= product.stock}
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm transition-all disabled:opacity-40 active:scale-90"
                  aria-label="Increase"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg active:scale-95
                  ${addedFx
                    ? 'bg-green-600 text-white scale-95 shadow-green-200'
                    : 'bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 hover:shadow-xl hover:scale-[1.02]'
                  }`}
              >
                {addedFx ? (
                  <>
                    <CheckCircleSolid className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add {localQty > 1 ? `${localQty} × ` : ''}to Cart · ₹{(product.price * localQty).toFixed(0)}
                  </>
                )}
              </button>
            </div>

          ) : (
            /* Already in cart: qty stepper */
            <div className="space-y-3">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4" />
                In your cart
              </p>
              <div className="flex items-center gap-3 bg-green-50 dark:bg-gray-700/60 border dark:border-gray-600 rounded-2xl p-2 w-fit">
                <button
                  onClick={handleDecrease}
                  className="w-11 h-11 flex items-center justify-center bg-white dark:bg-gray-600 rounded-xl shadow-sm text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all hover:scale-110 active:scale-90"
                  aria-label="Remove one"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-gray-800 dark:text-white text-lg">{cartQty}</span>
                <button
                  onClick={handleIncrease}
                  className="w-11 h-11 flex items-center justify-center bg-green-600 dark:bg-green-500 rounded-xl shadow-sm text-white hover:bg-green-700 dark:hover:bg-green-600 transition-all hover:scale-110 active:scale-90"
                  aria-label="Add one more"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Subtotal: <span className="font-bold text-gray-800 dark:text-white">₹{(product.price * cartQty).toFixed(0)}</span>
              </p>
            </div>
          )}

          {/* Go to cart shortcut */}
          {cartQty > 0 && (
            <Link
              href="/cart"
              className="mt-4 flex items-center justify-center gap-2 py-3 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 font-semibold rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors active:scale-95"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              View Cart ({cartQty} {cartQty === 1 ? 'item' : 'items'})
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
