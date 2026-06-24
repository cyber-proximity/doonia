"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Minus, Plus, Truck, ShieldCheck,
  RefreshCw, Heart, Share2, ZoomIn, CheckCircle, X,
  MapPin, Store, Package, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/products/ProductCard";
import StarRating from "@/components/ui/StarRating";
import ReviewsSection from "@/components/reviews/ReviewsSection";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetails({ product, related }: Props) {
  const [qty,          setQty]          = useState(1);
  const [activeImg,    setActiveImg]    = useState(0);
  const [toast,        setToast]        = useState(false);
  const [cartQty,      setCartQty]      = useState(0);
  const [thumbStart,   setThumbStart]   = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg,  setLightboxImg]  = useState(0);

  const THUMB_VISIBLE = 5;

  const addItem        = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartItems      = useCartStore((s) => s.items);

  const discount = product.compareAtPrice
    ? getDiscountPercent(product.price, product.compareAtPrice)
    : null;

  const images = product.images.filter((img) => img.url);

  // Keep cartQty in sync with store
  useEffect(() => {
    const item = cartItems.find((i) => i.product.id === product.id);
    setCartQty(item?.quantity ?? 0);
  }, [cartItems, product.id]);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setLightboxImg((i) => Math.min(images.length - 1, i + 1));
      if (e.key === "ArrowLeft")  setLightboxImg((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, images.length]);

  function handleAddToCart() {
    addItem(product, qty);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  function handleIncrement() {
    updateQuantity(product.id, cartQty + 1);
  }

  function handleDecrement() {
    updateQuantity(product.id, cartQty - 1); // updateQuantity removes when qty reaches 0
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ── Green success toast ── */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 transition-transform duration-300 ${
          toast ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-2.5 bg-green-500 text-white px-5 py-2.5 rounded-lg shadow-xl text-sm font-semibold">
          <CheckCircle size={16} />
          Product added successfully
          <button onClick={() => setToast(false)} className="ml-1 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* ── 3-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr_260px] gap-4 mb-4">

          {/* ── Col 1: Image gallery ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">

            {/* Main image — click to open lightbox */}
            <div
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border border-gray-100 group cursor-zoom-in"
              onClick={() => { if (images[activeImg]?.url) { setLightboxImg(activeImg); setLightboxOpen(true); } }}
            >
              {images[activeImg]?.url ? (
                <Image
                  src={images[activeImg].url}
                  alt={images[activeImg]?.altText ?? product.name}
                  fill
                  sizes="360px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  No image
                </div>
              )}
              {discount && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
                  -{discount}% OFF
                </span>
              )}
              <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIn size={15} className="text-gray-600" />
              </div>
            </div>

            {/* Thumbnails row — paginated with arrows when > 5 images */}
            {images.length > 1 && (
              <div className="flex items-center gap-1.5">

                {/* Left arrow */}
                <button
                  onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
                  disabled={thumbStart === 0}
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                >
                  <ChevronLeft size={14} className="text-gray-600" />
                </button>

                {/* Visible thumbnails */}
                <div className="flex gap-2 flex-1">
                  {images.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((img, relIdx) => {
                    const idx = thumbStart + relIdx;
                    return (
                      <button
                        key={img.id}
                        onClick={() => setActiveImg(idx)}
                        className={`w-14 h-14 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                          activeImg === idx
                            ? "border-primary-500"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.altText ?? product.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => setThumbStart((s) => Math.min(images.length - THUMB_VISIBLE, s + 1))}
                  disabled={thumbStart + THUMB_VISIBLE >= images.length}
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-opacity"
                >
                  <ChevronRight size={14} className="text-gray-600" />
                </button>

              </div>
            )}

            {/* Share row */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] text-gray-500 font-semibold mb-2 uppercase tracking-wide">Share This Product</p>
              <div className="flex gap-2">
                {[
                  { label: "FB",  color: "text-blue-600 hover:bg-blue-50 border-blue-200" },
                  { label: "TW",  color: "text-sky-500 hover:bg-sky-50 border-sky-200" },
                  { label: "WA",  color: "text-green-600 hover:bg-green-50 border-green-200" },
                ].map(({ label, color }) => (
                  <button
                    key={label}
                    className={`text-[11px] font-bold px-3 py-1 rounded border transition-colors ${color}`}
                  >
                    {label}
                  </button>
                ))}
                <button className="p-1.5 rounded border border-gray-200 text-gray-400 hover:text-primary-500 hover:border-primary-300 transition-colors">
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Col 2: Product details ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-sm uppercase tracking-wide">
                <Store size={10} /> Official Store
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-sm uppercase tracking-wide">
                <Package size={10} /> Pay On Delivery
              </span>
            </div>

            {/* Category link + name */}
            <div>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 uppercase tracking-wide"
              >
                {product.category.name}
              </Link>
              <h1 className="text-xl font-bold text-gray-900 mt-1 leading-snug">
                {product.name}
              </h1>
              <p className="text-[11px] text-gray-400 mt-1">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              {product.reviewCount > 0 ? (
                <>
                  <StarRating rating={product.avgRating ?? 0} size={14} />
                  <span className="text-sm font-bold text-gray-800">{product.avgRating?.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({product.reviewCount} rating{product.reviewCount !== 1 ? "s" : ""})</span>
                </>
              ) : (
                <>
                  <StarRating rating={0} size={14} />
                  <span className="text-sm text-gray-400">No reviews yet — be the first!</span>
                </>
              )}
            </div>

            {/* Price row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock badge */}
            <div>
              {product.stockQuantity > 10 ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock
                </span>
              ) : product.stockQuantity > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-orange-700 font-semibold bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" /> Only {product.stockQuantity} left!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-semibold bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {product.description}
            </p>

            {/* Promotions */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Promotions</p>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  Free delivery on orders over GH₵200
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                  Save up to 5% when you Pay on Delivery
                </div>
              </div>
            </div>

            {/* Cart controls */}
            <div className="flex flex-col gap-3 pt-1">
              {cartQty > 0 ? (
                /* Item already in cart — show inline qty controls */
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <button
                      onClick={handleDecrement}
                      className="px-3 py-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors border-r border-gray-200"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="px-5 py-2 font-bold text-gray-800 text-sm min-w-[3rem] text-center tabular-nums">
                      {cartQty}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="px-3 py-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors border-l border-gray-200"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {cartQty} item{cartQty !== 1 ? "s" : ""} added
                  </span>
                  <button className="p-2.5 border border-gray-300 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors">
                    <Heart size={16} />
                  </button>
                </div>
              ) : (
                /* Not in cart — show qty picker + Add to Cart button */
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="px-3 py-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors border-r border-gray-200"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="px-5 py-2 font-bold text-gray-800 text-sm min-w-[3rem] text-center tabular-nums">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="px-3 py-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors border-l border-gray-200"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <button className="p-2.5 border border-gray-300 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm text-sm w-full"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart · {formatPrice(product.price * qty)}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Col 3: Delivery sidebar ── */}
          <div className="space-y-3">

            {/* Delivery & Returns card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-secondary-500 px-4 py-2.5">
                <p className="text-sm font-bold text-white">Delivery &amp; Returns</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-2.5">
                  <Truck size={15} className="text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Standard Delivery</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">3–5 business days across Ghana</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <MapPin size={15} className="text-primary-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800 mb-1">Choose Your Location</p>
                    <select className="w-full text-[11px] border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-300">
                      <option>Accra</option>
                      <option>Kumasi</option>
                      <option>Tamale</option>
                      <option>Cape Coast</option>
                      <option>Takoradi</option>
                      <option>Ho</option>
                      <option>Koforidua</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <Store size={15} className="text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Pickup Station</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Collect at your nearest station</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return policy + warranty */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex gap-2.5">
                <RefreshCw size={15} className="text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Return Policy</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">7-day free returns, no questions asked</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <ShieldCheck size={15} className="text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Warranty</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Manufacturer warranty included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 mb-4">
          <ReviewsSection slug={product.slug} />
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">You Might Also Like</h2>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                See more
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Lightbox modal ── */}
      {lightboxOpen && (
        /* Backdrop — click outside the card to close */
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-2 pb-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* White modal card — fixed height so header + thumbnails always stay visible */}
          <div
            className="bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-2xl"
            style={{ height: "min(96vh, 700px)" }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-gray-900 text-base">Product Images</h3>
              <button
                onClick={() => setLightboxOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Main image with side arrows ── fills remaining space */}
            <div className="flex-1 min-h-0 relative flex items-center justify-center px-2 py-2">

              {/* Prev */}
              <button
                onClick={() => setLightboxImg((i) => Math.max(0, i - 1))}
                disabled={lightboxImg === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 hover:border-gray-400 rounded-full shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>

              {/* Image fills the flex area without imposing its own height */}
              <div className="relative w-full h-full">
                {images[lightboxImg]?.url && (
                  <Image
                    src={images[lightboxImg].url}
                    alt={images[lightboxImg]?.altText ?? product.name}
                    fill
                    sizes="(max-width: 768px) 80vw, 520px"
                    className="object-contain"
                    priority
                  />
                )}
              </div>

              {/* Next */}
              <button
                onClick={() => setLightboxImg((i) => Math.min(images.length - 1, i + 1))}
                disabled={lightboxImg === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 hover:border-gray-400 rounded-full shadow-sm disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>

            {/* ── Thumbnail strip ── */}
            {images.length > 1 && (
              <div className="shrink-0 flex justify-center gap-2.5 px-5 pb-4 pt-2 flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setLightboxImg(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors shrink-0 ${
                      lightboxImg === idx
                        ? "border-primary-500"
                        : "border-gray-200 hover:border-primary-300"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
