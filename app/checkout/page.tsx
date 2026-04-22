'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import OrderSummary from '@/components/OrderSummary';
import EmptyState from '@/components/EmptyState';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface FormData {
  customerName: string;
  phone: string;
  address: string;
}

interface FormErrors {
  customerName?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, sessionId, clearCart } = useCart();

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    totalAmount: number;
  } | null>(null);

  // ✅ DELIVERY RULE: Free above ₹99, otherwise ₹40
  const deliveryFee = totalAmount > 99 ? 0 : 40;
  const finalTotal = totalAmount + deliveryFee;

  // --- Form Validation ---
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number (starts with 6-9)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address (min 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit,
          })),
          totalAmount: finalTotal,
          sessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success!
      setOrderSuccess({
        orderId: data.data.orderId,
        totalAmount: data.data.totalAmount,
      });
      await clearCart();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Empty cart state
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">🏠 Checkout</h1>
        <EmptyState
          icon="🛍️"
          title="Nothing to Checkout"
          description="Your cart is empty. Add some fresh groceries before checking out!"
          actionLabel="Shop Now"
          actionHref="/"
        />
      </div>
    );
  }

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center animate-bounce-in py-16">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-14 h-14 text-green-500 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-50 mb-3">Order Placed! 🎉</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
          Thank you, <strong className="text-gray-700 dark:text-gray-200">{formData.customerName}</strong>! Your order has been confirmed and
          will be delivered to your address soon.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 mb-8 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Order ID</span>
            <span className="font-mono font-semibold text-gray-700 dark:text-gray-200 text-xs">
              #{String(orderSuccess.orderId).slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total Paid</span>
            <span className="font-bold text-green-600 dark:text-green-400">₹{orderSuccess.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Delivery to</span>
            <span className="font-medium text-gray-700 dark:text-gray-300 text-right max-w-[200px] text-xs">
              {formData.address}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-semibold">
              ⏳ Pending
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Continue Shopping 🛒
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">🏠 Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Delivery Form */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-green-600" />
              Delivery Details
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors duration-150 outline-none focus:ring-2 focus:ring-green-400
                      ${errors.customerName
                        ? 'border-red-400 bg-red-50 dark:bg-red-900/20 focus:ring-red-300'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 focus:border-green-400 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100'
                      }`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    ⚠️ {errors.customerName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex">
                  <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-600 rounded-l-xl text-sm text-gray-500 dark:text-gray-400 font-medium">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full pl-10 pr-4 py-3 rounded-r-xl border text-sm transition-colors duration-150 outline-none focus:ring-2 focus:ring-green-400
                        ${errors.phone
                          ? 'border-red-400 bg-red-50 dark:bg-red-900/20 focus:ring-red-300'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 focus:border-green-400 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100'
                        }`}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    ⚠️ {errors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 42, Green Park Colony, Sector 15, Noida, Uttar Pradesh - 201301"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors duration-150 outline-none focus:ring-2 focus:ring-green-400 resize-none
                    ${errors.address
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/20 focus:ring-red-300'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 focus:border-green-400 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100'
                    }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    ⚠️ {errors.address}
                  </p>
                )}
              </div>

              {/* API Error */}
              {apiError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                  <span className="text-lg">❌</span>
                  <span>{apiError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Place Order · ₹{finalTotal.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          <Link
            href="/cart"
            className="block text-center text-sm text-gray-400 hover:text-green-600 transition-colors duration-150 mt-4"
          >
            ← Back to Cart
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <OrderSummary items={items} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
}
