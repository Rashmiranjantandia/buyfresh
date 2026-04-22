'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
}

const STATUS_CONFIG = {
  pending: {
    label: '⏳ Pending',
    className: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700',
  },
  confirmed: {
    label: '✅ Confirmed',
    className: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
  },
  delivered: {
    label: '🎉 Delivered',
    className: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700',
  },
};

export default function OrdersPage() {
  const { sessionId } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders?sessionId=${sessionId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to load orders');
      }
      setOrders(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">📋 My Orders</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Your order history from this device</p>
        </div>
        {!loading && (
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <LoadingSpinner message="Fetching your orders..." />
      ) : error ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <span className="text-6xl mb-4">⚠️</span>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">Could not load orders</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{error}</p>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon="📦"
          title="No Orders Yet"
          description="You haven't placed any orders from this device. Start shopping and your order history will appear here!"
          actionLabel="Shop Now"
          actionHref="/"
        />
      ) : (
        /* Order List */
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            return (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow duration-200 animate-slide-up"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono font-semibold text-gray-700 dark:text-gray-200 text-sm">
                      #{String(order._id).slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4 space-y-1.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-200 flex-1 min-w-0 truncate">
                        {item.name}
                        <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">({item.unit})</span>
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 flex-shrink-0 ml-3">
                        ×{item.quantity} ·{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{order.customerName}</span>
                    {' · '}
                    {order.address.length > 50
                      ? order.address.slice(0, 50) + '…'
                      : order.address}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">Total Paid</p>
                    <p className="font-bold text-green-600 text-lg">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
