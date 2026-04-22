'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/components/ThemeProvider';
import { ShoppingCartIcon, HomeIcon, ClipboardDocumentListIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navLink = (href: string, label: string, Icon: React.ComponentType<{ className?: string }>) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${isActive
            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
            : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-green-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — BuyFresh */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <span className="text-white text-lg">🛒</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Buy<span className="text-green-600 dark:text-green-400">Fresh</span>
            </span>
          </Link>

          {/* Nav Links + Controls */}
          <div className="flex items-center gap-1">
            {navLink('/', 'Products', HomeIcon)}
            {navLink('/orders', 'My Orders', ClipboardDocumentListIcon)}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="ml-1 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl shadow-md transition-all duration-200 hover:scale-105 ml-1
                ${pathname === '/cart'
                  ? 'bg-green-700 text-white'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-lg'
                }`}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in shadow-md">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
