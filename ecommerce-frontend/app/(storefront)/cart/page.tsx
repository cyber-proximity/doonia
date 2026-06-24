"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle, X, AlertTriangle } from "lucide-react";
import { useCartStore, selectItemCount, selectTotal } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export default function CartPage() {
  const items          = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem     = useCartStore((s) => s.removeItem);
  const itemCount      = useCartStore(selectItemCount);
  const total          = useCartStore(selectTotal);

  const shipping   = total >= 200 ? 0 : 15;
  const grandTotal = total + shipping;

  // Confirm-removal dialog state
  const [pendingRemove, setPendingRemove] = useState<Product | null>(null);
  // Success toast state
  const [successName, setSuccessName]     = useState<string | null>(null);

  function askRemove(product: Product) {
    setPendingRemove(product);
  }

  function confirmRemove() {
    if (!pendingRemove) return;
    const name = pendingRemove.name;
    removeItem(pendingRemove.id);
    setPendingRemove(null);
    setSuccessName(name);
    setTimeout(() => setSuccessName(null), 3000);
  }

  function cancelRemove() {
    setPendingRemove(null);
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-200">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-gray-500 text-sm">Browse our products and add something you like</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ── Green success toast ── */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 transition-transform duration-300 pointer-events-none ${
          successName ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-2.5 bg-green-500 text-white px-5 py-2.5 rounded-lg shadow-xl text-sm font-semibold">
          <CheckCircle size={16} />
          Item removed from cart
          <button onClick={() => setSuccessName(null)} className="ml-1 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Confirm-remove dialog ── */}
      {pendingRemove && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={cancelRemove}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Remove item?</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  <span className="font-medium text-gray-700">{pendingRemove.name}</span> will be removed from your cart.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={cancelRemove}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Keep Item
              </button>
              <button
                onClick={confirmRemove}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">

        <h1 className="text-xl font-bold text-gray-900 mb-4">
          My Cart <span className="text-sm font-normal text-gray-400 ml-1">({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Cart items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ product, quantity }) => {
              const image    = product.images.find((i) => i.isPrimary) ?? product.images[0];
              const subtotal = product.price * quantity;

              return (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-4">

                  {/* Product image */}
                  <Link href={`/products/${product.slug}`} className="shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        src={image?.url ?? "/placeholder.png"}
                        alt={image?.altText ?? product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-primary-600 font-semibold uppercase tracking-wide">
                      {product.category.name}
                    </p>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-gray-800 leading-snug mt-0.5 line-clamp-2 hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {formatPrice(product.price)}
                      {product.compareAtPrice && (
                        <span className="ml-2 text-xs text-gray-400 font-normal line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </p>

                    {/* Qty controls + remove */}
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="px-3 py-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-bold text-gray-800 min-w-[2.5rem] text-center tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-3 py-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(subtotal)}
                        </span>
                        <button
                          onClick={() => askRemove(product)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24 space-y-4">
              <h2 className="font-bold text-gray-900 text-base">Order Summary</h2>

              <div className="space-y-2.5 text-sm border-b border-gray-100 pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                  <span className="font-semibold text-gray-800">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-semibold text-gray-800"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-primary-600 bg-primary-50 border border-primary-100 rounded-lg px-3 py-2">
                    Add {formatPrice(200 - total)} more for free shipping
                  </p>
                )}
              </div>

              <div className="flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              {/* Coupon */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                  <Tag size={13} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent focus:outline-none"
                  />
                </div>
                <button className="px-3 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  Apply
                </button>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-center text-sm text-gray-500 hover:text-primary-500 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
