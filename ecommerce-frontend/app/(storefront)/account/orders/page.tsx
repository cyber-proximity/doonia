"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { getMyOrders } from "@/lib/services/orders";
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
    day: "numeric", month: "short", year: "numeric",
  }).format(new Date(iso));
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center py-16 text-gray-500">
      {error}
    </div>
  );

  if (orders.length === 0) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center py-16">
      <Package size={40} className="mx-auto text-gray-300 mb-3" />
      <p className="font-semibold text-gray-700 mb-1">No orders yet</p>
      <p className="text-sm text-gray-400 mb-5">Start shopping to see your orders here.</p>
      <Link
        href="/products"
        className="inline-block px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
      >
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.orderNumber}`}
          className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-gray-900 text-sm">{order.orderNumber}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paymentBadge[order.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.paymentStatus}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${orderBadge[order.orderStatus] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-gray-900">GH₵{order.total.toFixed(2)}</span>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
