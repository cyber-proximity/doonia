"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { useCartStore, selectTotal, selectItemCount } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { createOrder } from "@/lib/services/orders";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  customerName:  z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().optional(),
  street:        z.string().min(3, "Street address is required"),
  city:          z.string().min(2, "City is required"),
  region:        z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const items     = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total     = useCartStore(selectTotal);
  const itemCount = useCartStore(selectItemCount);
  const { user } = useAuthStore();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const shipping = total >= 200 ? 0 : 15;
  const grandTotal = total + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName:  user?.name  ?? "",
      customerEmail: user?.email ?? "",
      customerPhone: user?.phone ?? "",
    },
  });

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <ShoppingBag size={40} className="text-gray-300 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
          <Link href="/products" className="inline-flex items-center gap-2 text-primary-500 font-medium hover:underline">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(data: FormData) {
    setServerError("");
    setLoading(true);
    try {
      const result = await createOrder({
        customerName:  data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: {
          street: data.street,
          city:   data.city,
          region: data.region,
        },
        items: items.map((i) => ({
          productId: i.product.id,
          quantity:  i.quantity,
        })),
      });

      clearCart();
      window.location.href = result.paymentUrl;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Something went wrong. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      {...register("customerName")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="Kofi Mensah"
                    />
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      {...register("customerEmail")}
                      type="email"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="kofi@email.com"
                    />
                    {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      {...register("customerPhone")}
                      type="tel"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="+233 20 000 0000"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                    <input
                      {...register("street")}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="House No. / Street name"
                    />
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                      <input
                        {...register("city")}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                        placeholder="Accra"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                      <input
                        {...register("region")}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                        placeholder="Greater Accra"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {serverError}
                </div>
              )}
            </div>

            {/* Right: order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="font-bold text-gray-900 text-lg mb-5">
                  Order Summary <span className="text-sm font-normal text-gray-400">({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                </h2>

                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => {
                    const img = product.images.find((i) => i.isPrimary) ?? product.images[0];
                    return (
                      <div key={product.id} className="flex gap-3 items-center">
                        <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                          <Image src={img?.url ?? "/placeholder.png"} alt={product.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-xs text-gray-400">Qty: {quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 shrink-0">{formatPrice(product.price * quantity)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  <Lock size={16} />
                  {loading ? "Redirecting to Paystack…" : `Pay ${formatPrice(grandTotal)}`}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <Lock size={11} /> Secured by Paystack
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
