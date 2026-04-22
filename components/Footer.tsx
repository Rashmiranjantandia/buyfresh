'use client';

import Link from 'next/link';

const footerLinks = {
  Company: ['About', 'Careers', 'Blog'],
  Support: ['Help Center', 'Contact', 'Refund Policy'],
  Legal: ['Privacy Policy', 'Terms'],
};

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              {/* Logo mark */}
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-lg" aria-hidden="true">🛒</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Buy<span className="text-green-600 dark:text-green-400">Fresh</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[200px]">
              Fast and fresh grocery delivery at your fingertips.
            </p>
            <div className="flex gap-3 mt-4 text-xs text-gray-400 dark:text-gray-500">
              <span>🌿 Fresh</span>
              <span>🚚 Fast</span>
              <span>🔒 Secure</span>
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(footerLinks) as [string, string[]][]).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
            © 2025 BuyFresh. All rights reserved.
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600">
            Built with ❤️ using Next.js &amp; MongoDB Atlas
          </p>
        </div>
      </div>
    </footer>
  );
}
