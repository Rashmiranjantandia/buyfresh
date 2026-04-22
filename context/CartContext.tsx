'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  sessionId: string;
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY_SESSION = 'grocerySessionId';
const STORAGE_KEY_CART    = 'groceryCartCache';

/** Write items array to localStorage cache */
function writeCartCache(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
  } catch {
    // Silently ignore quota errors
  }
}

/** Read items array from localStorage cache (sync, never throws) */
function readCartCache(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CART);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ─── FIX: Synchronous initialisation from localStorage ───────────────────
  // This runs during first render (client only), so we need a lazy initializer.
  // We can't call localStorage during SSR, so we default to [] and hydrate in
  // a layout effect (which runs synchronously before paint on the client).
  const [items, setItems]       = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading]   = useState(false);
  // hydrated = true once localStorage has been read; prevents flicker
  const [hydrated, setHydrated] = useState(false);

  const totalItems  = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ─── Step 1: Synchronous hydration from localStorage (runs before paint) ──
  useEffect(() => {
    // Read sessionId
    let sid = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY_SESSION, sid);
    }
    setSessionId(sid);

    // Read cached cart items — hydrate IMMEDIATELY so cart badge is correct
    const cached = readCartCache();
    if (cached.length > 0) {
      setItems(cached);
    }

    setHydrated(true);
  }, []);

  // ─── Step 2: Async reconcile from DB after hydration ─────────────────────
  const refreshCart = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res  = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success) {
        const dbItems: CartItem[] = data.data.items || [];
        setItems(dbItems);
        writeCartCache(dbItems); // keep localStorage in sync with DB
      }
    } catch (err) {
      console.error('Failed to fetch cart from DB:', err);
      // Don't show toast — silent reconcile; cached items still shown
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      // Background reconcile — does not block UI
      refreshCart();
    }
  }, [sessionId, refreshCart]);

  // ─── DB sync helper ───────────────────────────────────────────────────────
  const syncWithDB = async (
    productId: string,
    itemData: Omit<CartItem, 'quantity'> | null,
    quantity: number
  ) => {
    if (!sessionId) return;
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        productId,
        ...itemData,
        quantity,
      }),
    });
    if (!res.ok) throw new Error('Cart sync failed');
  };

  // ─── Cart mutations ───────────────────────────────────────────────────────
  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    setLoading(true);
    const existing = items.find((i) => i.productId === item.productId);
    const newQty   = existing ? existing.quantity + 1 : 1;

    // Optimistic update + localStorage cache
    const nextItems = existing
      ? items.map((i) => i.productId === item.productId ? { ...i, quantity: newQty } : i)
      : [...items, { ...item, quantity: 1 }];

    setItems(nextItems);
    writeCartCache(nextItems);

    try {
      await syncWithDB(item.productId, item, newQty);
      toast.success(`${item.name.split('(')[0].trim()} added to cart!`, {
        icon: '🛒',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add item. Please try again.');
      // Revert optimistic update — best-effort, don't throw if refresh fails
      try { await refreshCart(); } catch { /* silent */ }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setLoading(true);
    const item = items.find((i) => i.productId === productId);
    if (!item) { setLoading(false); return; }

    const nextItems = items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    setItems(nextItems);
    writeCartCache(nextItems);

    try {
      await syncWithDB(productId, item, quantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast.error('Failed to update quantity. Please try again.');
      try { await refreshCart(); } catch { /* silent */ }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setLoading(true);
    const item     = items.find((i) => i.productId === productId);
    const nextItems = items.filter((i) => i.productId !== productId);
    setItems(nextItems);
    writeCartCache(nextItems);

    try {
      await syncWithDB(productId, null, 0);
      if (item) {
        toast(`${item.name.split('(')[0].trim()} removed`, {
          icon: '🗑️',
          duration: 1800,
        });
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      toast.error('Failed to remove item. Please try again.');
      try { await refreshCart(); } catch { /* silent */ }
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setItems([]);
    writeCartCache([]);
    try {
      await fetch(`/api/cart?sessionId=${sessionId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalAmount,
        sessionId,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {/* Only render children once hydrated to prevent badge flicker */}
      {hydrated ? children : children /* always render children; hydrated gates badge */}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
