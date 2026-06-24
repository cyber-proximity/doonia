"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Package, ArrowRight } from "lucide-react";
import { verifyPayment } from "@/lib/services/orders";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "error">("loading");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }
    verifyPayment(reference)
      .then((o) => {
        setOrder(o);
        setStatus(o.paymentStatus === "paid" ? "success" : "failed");
      })
      .catch(() => setStatus("error"));
  }, [reference]);

  if (status === "loading") {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying your payment…</p>
        </div>
      </div>
    );
  }

  if (status === "failed" || status === "error") {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 text-center">
          <XCircle size={56} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Unsuccessful</h1>
          <p className="text-gray-500 text-sm mb-6">
            {status === "error"
              ? "We couldn't verify this payment. Please contact support if you were charged."
              : "Your payment was not completed. No charge was made."}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/cart"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Return to Cart
            </Link>
            <Link href="/products" className="text-sm text-gray-500 hover:text-primary-500 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success header */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 text-center mb-6">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-1">Thank you, {order?.customerName}. Your order has been placed.</p>
          <p className="text-xs text-gray-400">A confirmation will be sent to <strong>{order?.customerEmail}</strong></p>

          <div className="mt-5 inline-block bg-primary-50 text-primary-700 font-mono font-semibold text-sm px-5 py-2.5 rounded-xl border border-primary-100">
            {order?.orderNumber}
          </div>
        </div>

        {/* Order items */}
        {order && order.items.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Package size={18} className="text-primary-500" /> Items Ordered
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  {item.productImage ? (
                    <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-gray-50">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Package size={20} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.productName}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity} · SKU: {item.productSku}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={order.shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                  {order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery info */}
        {order?.shippingAddress && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-bold text-gray-900 mb-3">Delivering To</h2>
            <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.city}
              {order.shippingAddress.region ? `, ${order.shippingAddress.region}` : ""}
            </p>
            <p className="text-sm text-gray-600">Ghana</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold py-3.5 rounded-xl hover:border-primary-300 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
