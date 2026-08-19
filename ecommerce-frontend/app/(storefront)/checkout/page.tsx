"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShoppingBag, ArrowLeft, Lock, MapPin, Plus,
  CheckCircle,
} from "lucide-react";
import { useCartStore, selectTotal, selectItemCount } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { createOrder } from "@/lib/services/orders";
import { getAddresses, createAddress } from "@/lib/services/account";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { Address } from "@/types";

/* ── Contact info schema (address handled separately) ── */
const schema = z.object({
  customerName:  z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

/* ── New-address local state type ── */
interface NewAddressState {
  street: string;
  city:   string;
  region: string;
}

export default function CheckoutPage() {
  const items     = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const total     = useCartStore(selectTotal);
  const itemCount = useCartStore(selectItemCount);
  const { user, isAuthenticated } = useAuthStore();
  const { format, paymentCurrency } = useCurrency();

  /* ── Saved addresses ── */
  const [savedAddresses,  setSavedAddresses]  = useState<Address[]>([]);
  const [addressMode,     setAddressMode]     = useState<"saved" | "new">("new");
  const [selectedAddrId,  setSelectedAddrId]  = useState<number | null>(null);
  const [saveForLater,    setSaveForLater]    = useState(false);
  const [newAddr,         setNewAddr]         = useState<NewAddressState>({ street: "", city: "", region: "" });
  const [addrError,       setAddrError]       = useState("");
  const [loadingAddresses,setLoadingAddresses]= useState(false);

  /* ── Order state ── */
  const [serverError, setServerError] = useState("");
  const [loading,     setLoading]     = useState(false);

  const shipping   = total >= 200 ? 0 : 15;
  const grandTotal = total + shipping;

  /* ── Contact form ── */
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

  /* ── Fetch saved addresses if logged in ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingAddresses(true);
    getAddresses()
      .then((addrs) => {
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          setAddressMode("saved");
          const def = addrs.find((a) => a.isDefault) ?? addrs[0];
          setSelectedAddrId(def.id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingAddresses(false));
  }, [isAuthenticated]);

  /* ── Submit ── */
  async function onSubmit(contact: FormData) {
    setServerError("");
    setAddrError("");

    /* Resolve shipping address */
    let shippingAddress: { street: string; city: string; region?: string };

    if (addressMode === "saved") {
      const addr = savedAddresses.find((a) => a.id === selectedAddrId);
      if (!addr) {
        setAddrError("Please select a delivery address.");
        return;
      }
      shippingAddress = { street: addr.street, city: addr.city, region: addr.state ?? undefined };
    } else {
      if (!newAddr.street.trim() || !newAddr.city.trim()) {
        setAddrError("Street address and city are required.");
        return;
      }
      shippingAddress = { street: newAddr.street, city: newAddr.city, region: newAddr.region || undefined };

      /* Optionally save address to account */
      if (isAuthenticated && saveForLater) {
        try {
          await createAddress({
            label:      "Home",
            street:     newAddr.street,
            city:       newAddr.city,
            state:      newAddr.region ?? "",
            postalCode: null,
            isDefault:  savedAddresses.length === 0,
          });
        } catch {
          /* non-blocking — order still proceeds */
        }
      }
    }

    setLoading(true);
    try {
      const result = await createOrder({
        customerName:    contact.customerName,
        customerEmail:   contact.customerEmail,
        customerPhone:   contact.customerPhone,
        shippingAddress,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        paymentCurrency,
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

  /* ── Empty cart ── */
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

  const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300";

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

            {/* ── Left: contact + address ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input {...register("customerName")} className={inputCls} placeholder="Kofi Mensah" />
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input {...register("customerEmail")} type="email" className={inputCls} placeholder="kofi@email.com" />
                    {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input {...register("customerPhone")} type="tel" className={inputCls} placeholder="+233 20 000 0000" />
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 text-lg mb-5">Delivery Address</h2>

                {/* ── Mode tabs (only when logged in and has addresses) ── */}
                {isAuthenticated && savedAddresses.length > 0 && (
                  <div className="flex gap-2 mb-5">
                    <button
                      type="button"
                      onClick={() => setAddressMode("saved")}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        addressMode === "saved"
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                      }`}
                    >
                      <MapPin size={14} /> Saved Addresses
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressMode("new")}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                        addressMode === "new"
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                      }`}
                    >
                      <Plus size={14} /> New Address
                    </button>
                  </div>
                )}

                {/* ── Saved addresses list ── */}
                {addressMode === "saved" && (
                  loadingAddresses ? (
                    <p className="text-sm text-gray-400">Loading addresses…</p>
                  ) : (
                    <div className="space-y-2">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                            selectedAddrId === addr.id
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 hover:border-primary-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            value={addr.id}
                            checked={selectedAddrId === addr.id}
                            onChange={() => setSelectedAddrId(addr.id)}
                            className="mt-0.5 accent-primary-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-gray-800">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">{addr.street}</p>
                            <p className="text-sm text-gray-500">{addr.city}{addr.state ? `, ${addr.state}` : ""}</p>
                          </div>
                          {selectedAddrId === addr.id && (
                            <CheckCircle size={18} className="text-primary-500 shrink-0 mt-0.5" />
                          )}
                        </label>
                      ))}

                      <p className="text-xs text-gray-400 pt-1">
                        Need to add a new address?{" "}
                        <button
                          type="button"
                          onClick={() => setAddressMode("new")}
                          className="text-primary-600 font-semibold hover:underline"
                        >
                          Enter a different one
                        </button>
                      </p>
                    </div>
                  )
                )}

                {/* ── New address form ── */}
                {addressMode === "new" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                      <input
                        value={newAddr.street}
                        onChange={(e) => setNewAddr((p) => ({ ...p, street: e.target.value }))}
                        className={inputCls}
                        placeholder="House No. / Street name"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                        <input
                          value={newAddr.city}
                          onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))}
                          className={inputCls}
                          placeholder="Accra"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                        <input
                          value={newAddr.region}
                          onChange={(e) => setNewAddr((p) => ({ ...p, region: e.target.value }))}
                          className={inputCls}
                          placeholder="Greater Accra"
                        />
                      </div>
                    </div>

                    {/* Save for later — only shown to logged-in users */}
                    {isAuthenticated && (
                      <label className="flex items-start gap-3 p-3 rounded-xl border border-dashed border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={saveForLater}
                          onChange={(e) => setSaveForLater(e.target.checked)}
                          className="mt-0.5 accent-primary-500"
                        />
                        <span className="text-sm text-gray-700">
                          <span className="font-semibold">Save this address</span> to my account for future orders
                        </span>
                      </label>
                    )}
                  </div>
                )}

                {addrError && (
                  <p className="mt-3 text-sm text-red-500">{addrError}</p>
                )}
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {serverError}
                </div>
              )}
            </div>

            {/* ── Right: order summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="font-bold text-gray-900 text-lg mb-5">
                  Order Summary{" "}
                  <span className="text-sm font-normal text-gray-400">
                    ({itemCount} item{itemCount !== 1 ? "s" : ""})
                  </span>
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
                        <p className="text-sm font-semibold text-gray-800 shrink-0">{format(product.price * quantity)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>{format(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : format(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span><span>{format(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  <Lock size={16} />
                  {loading ? "Redirecting to Paystack…" : `Pay ${format(grandTotal)} (${paymentCurrency})`}
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
