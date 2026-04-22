'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';
import EmptyState from '@/components/EmptyState';
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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

const CATEGORIES = [
  'All',
  'Grains & Pulses',
  'Dairy & Eggs',
  'Fruits',
  'Vegetables',
  'Snacks',
  'Beverages',
  'Household',
  'Spices',
];

const CATEGORY_ICONS: Record<string, string> = {
  All: '🛒',
  'Grains & Pulses': '🌾',
  'Dairy & Eggs': '🥛',
  Fruits: '🍎',
  Vegetables: '🥦',
  Snacks: '🍿',
  Beverages: '☕',
  Household: '🧹',
  Spices: '🌶️',
};

export default function HomePage() {
  const [allProducts, setAllProducts]     = useState<Product[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery]     = useState('');

  // Fetch ALL products once; filtering happens client-side so search + category can combine
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      if (data.success) {
        setAllProducts(data.data);
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Client-side filtering: category + search query ────────────────────────
  const filtered = allProducts.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const q        = searchQuery.trim().toLowerCase();
    const matchQ   = !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery(''); // clear search when switching category
  };

  return (
    <div className="animate-fade-in">

      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 dark:from-green-900 dark:via-green-800 dark:to-green-700 p-8 md:p-12 mb-8 shadow-xl">
        <div className="relative z-10">
          <p className="text-green-100 font-medium text-sm mb-2 tracking-wide uppercase">
            🛒 Groceries made simple.
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Groceries, delivered<br />
            <span className="text-green-100">in minutes.</span>
          </h1>
          <p className="text-green-50 text-base md:text-lg max-w-md mb-6">
            Shop fresh fruits, vegetables, and daily essentials at unbeatable prices.
          </p>
          {/* Offer line */}
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            🚚 Free delivery on orders above ₹99
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href="#product-search"
              className="px-6 py-2.5 bg-white text-green-700 font-bold rounded-xl shadow hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 text-sm"
            >
              Shop Now
            </a>
            <a
              href="#categories"
              className="px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 active:scale-95 transition-all duration-200 text-sm border border-white/30"
            >
              Browse Categories
            </a>
          </div>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-8xl md:text-9xl opacity-20 select-none pointer-events-none">🛒</div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -top-6 right-24 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* ── Search Bar ─────────────────────────────────────────────────── */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          id="product-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products, categories… (e.g. &quot;rice&quot;, &quot;dal&quot;, &quot;spices&quot;)"
          className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Category Filter ────────────────────────────────────────────── */}
      <div id="categories" className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Browse by Category
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-green-600 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {loading ? (
        <ProductGridSkeleton count={8} />

      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <span className="text-6xl mb-4">⚠️</span>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6 max-w-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Try Again
          </button>
          <p className="mt-4 text-sm text-gray-400">
            First time?{' '}
            <code className="bg-gray-100 px-2 py-0.5 rounded text-green-600">POST /api/seed</code>
          </p>
        </div>

      ) : filtered.length === 0 && searchQuery ? (
        /* ── Search: no results ──────────────────────────────────────── */
        <EmptyState
          icon="🔍"
          title="No results found"
          description={`No products match "${searchQuery}". Try a different keyword or browse by category.`}
          actionLabel="Clear Search"
          actionHref="/"
        />

      ) : filtered.length === 0 ? (
        /* ── Category: no products ───────────────────────────────────── */
        <EmptyState
          icon="🥬"
          title="No Products in This Category"
          description={`No products available in "${activeCategory}" right now. Try a different category.`}
          actionLabel="View All Products"
          actionHref="/"
        />

      ) : (
        <>
          {/* Result count */}
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Showing{' '}
            <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'product' : 'products'}
            {activeCategory !== 'All' && (
              <> in <span className="font-semibold text-green-600 dark:text-green-400">{activeCategory}</span></>
            )}
            {searchQuery && (
              <> for{' '}
                <span className="font-semibold text-green-600 dark:text-green-400">&ldquo;{searchQuery}&rdquo;</span>
              </>
            )}
          </p>

          {/* Product Grid — each card links to /product/[id] */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="block group/link focus:outline-none focus:ring-2 focus:ring-green-400 rounded-2xl"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
