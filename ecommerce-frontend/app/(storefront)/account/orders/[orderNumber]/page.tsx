"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import api from "@/lib/api";
import { Order } from "@/types";

const paymentBadge: Record<string, string> = {
  paid:     "bg-green-100 text-green-700",
  pending:  "bg-yellow-100 text-yellow-700",
  failed:   "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

const orderBadge: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric", month: "long", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }).format(new Date(iso));
}

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get(`/v1/orders/${orderNumber}`)
      .then((res) => {
        const d = res.data.data;
        setOrder({
          id:               d.id,
          orderNumber:      d.order_number,
          customerName:     d.customer_name,
          customerEmail:    d.customer_email,
          customerPhone:    d.customer_phone,
          shippingAddress:  d.shipping_address,
          subtotal:         d.subtotal,
          shippingFee:      d.shipping_fee,
          discountAmount:   d.discount_amount,
          total:            d.total,
          paymentStatus:    d.payment_status,
          orderStatus:      d.order_status,
          paystackReference: d.paystack_reference,
          createdAt:        d.created_at,
          items: (d.items ?? []).map((item: Record<string, unknown>) => ({
            id:           item.id,
            productId:    item.product_id,
            productName:  item.product_name,
            productSku:   item.product_sku,
            quantity:     item.quantity,
            unitPrice:    item.unit_price,
            totalPrice:   item.total_price,
            productImage: item.product_image,
          })),
          payment: d.payment ?? null,
        });
      })
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  if (error || !order) return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
      <Package size={40} className="mx-auto text-gray-300 mb-3" />
      <p className="font-semibold text-gray-700 mb-1">{error || "Order not found"}</p>
      <Link href="/account/orders" className="text-primary-500 text-sm hover:underline">
        Back to orders
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link href="/account/orders" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-500 mb-2">
              <ArrowLeft size={14} /> All Orders
            </Link>
            <h1 className="font-bold text-gray-900 text-lg">{order.orderNumber}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${paymentBadge[order.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
              {order.paymentStatus}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${orderBadge[order.orderStatus] ?? "bg-gray-100 text-gray-600"}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                {item.productImage
                  ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-gray-300" /></div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{item.productName}</p>
                <p className="text-xs text-gray-400">{item.productSku} · Qty {item.quantity}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm text-gray-900">GH₵{item.totalPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-400">GH₵{item.unitPrice.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping + Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
          <p className="text-sm text-gray-700 font-medium">{order.customerName}</p>
          <p className="text-sm text-gray-500">{order.shippingAddress.street}</p>
          <p className="text-sm text-gray-500">{order.shippingAddress.city}{order.shippingAddress.region ? `, ${order.shippingAddress.region}` : ""}</p>
          {order.customerPhone && <p className="text-sm text-gray-500 mt-1">{order.customerPhone}</p>}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-3">Order Total</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>GH₵{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{order.shippingFee === 0 ? "Free" : `GH₵${order.shippingFee.toFixed(2)}`}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>-GH₵{order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span><span>GH₵{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
