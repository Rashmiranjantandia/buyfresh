import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BuyFresh — Groceries made simple.',
  description:
    'Shop fresh fruits, vegetables, and daily essentials at unbeatable prices. Fast delivery across India.',
  keywords: 'grocery, online grocery, fresh vegetables, Indian grocery, buy groceries online, BuyFresh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Flicker-fix: apply saved theme BEFORE React hydrates to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-[#0B1220] min-h-screen overflow-x-hidden`}>
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
              {children}
            </main>

            {/* Toast notification system */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 2500,
                style: {
                  background: '#1f2937',
                  color: '#f9fafb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '12px 16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                },
                success: {
                  iconTheme: { primary: '#22c55e', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  duration: 4000,
                },
              }}
            />

            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
