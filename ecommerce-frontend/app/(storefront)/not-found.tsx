import Link from "next/link";
import { SearchX } from "lucide-react";

export default function StorefrontNotFound() {
  return (
    <div className="bg-gray-50 min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX size={36} className="text-primary-400" />
        </div>

        {/* Badge */}
        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          404 — Not Found
        </span>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Oops! Page not found
        </h1>
        <p className="text-gray-500 mb-8">
          The page or product you&apos;re looking for doesn&apos;t exist or may
          have been removed. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-200 hover:border-primary-300 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
