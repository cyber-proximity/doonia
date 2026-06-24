"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    tag: "Hot Deals",
    title: "Big Sale on\nElectronics",
    sub: "Save up to 60% on phones, laptops & accessories",
    cta: "Shop Now",
    href: "/products",
    gradientFrom: "#007a87",
    gradientTo: "#00B5C8",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=420&fit=crop",
  },
  {
    id: 2,
    tag: "New Arrivals",
    title: "Fashion\nWeek Sale",
    sub: "Discover the latest trends at unbeatable prices",
    cta: "Shop Fashion",
    href: "/products",
    gradientFrom: "#48296c",
    gradientTo: "#6B3FA0",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=420&fit=crop",
  },
  {
    id: 3,
    tag: "Limited Time",
    title: "Up to 80%\nOff Today",
    sub: "Flash deals on all categories — updated every hour",
    cta: "See All Deals",
    href: "/deals",
    gradientFrom: "#b45309",
    gradientTo: "#f97316",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=420&fit=crop",
  },
  {
    id: 4,
    tag: "Best Value",
    title: "Home &\nLiving Sale",
    sub: "Quality furniture, decor and appliances for your home",
    cta: "Shop Home",
    href: "/products",
    gradientFrom: "#0f766e",
    gradientTo: "#10b981",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=420&fit=crop",
  },
];

export default function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <div
      className="relative flex-1 min-w-0 overflow-hidden rounded-lg group"
      style={{ minHeight: 260 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
          style={{
            background: `linear-gradient(135deg, ${s.gradientFrom} 0%, ${s.gradientTo} 100%)`,
          }}
        >
          <div className="flex h-full">
            {/* Text */}
            <div className="flex flex-col justify-center px-7 py-6 flex-1 min-w-0">
              <span className="inline-block bg-white/25 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full mb-4 w-fit uppercase tracking-wide">
                {s.tag}
              </span>
              <h2 className="text-white font-extrabold leading-tight mb-3 whitespace-pre-line"
                  style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)" }}>
                {s.title}
              </h2>
              <p className="text-white/80 text-sm mb-5 max-w-xs leading-relaxed hidden sm:block">
                {s.sub}
              </p>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 bg-white text-gray-800 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-yellow-50 transition-colors shadow-md w-fit"
              >
                {s.cta} <ChevronRight size={15} />
              </Link>
            </div>

            {/* Image */}
            <div className="relative w-44 sm:w-52 md:w-64 shrink-0 overflow-hidden">
              <Image
                src={s.image}
                alt={s.title.replace("\n", " ")}
                fill
                sizes="256px"
                className="object-cover"
                priority={i === 0}
              />
              {/* gradient blend so image fades into banner color on left */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${s.gradientTo}ee 0%, transparent 50%)`,
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows — appear on hover */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
