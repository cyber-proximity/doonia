"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Review, ReviewSummary } from "@/types";
import { getProductReviews } from "@/lib/services/reviews";
import { useAuthStore } from "@/store/authStore";
import StarRating from "@/components/ui/StarRating";
import ReviewCard from "./ReviewCard";
import WriteReviewForm from "./WriteReviewForm";

interface Props {
  slug: string;
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-6 text-right text-gray-500">{star}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 text-xs text-gray-400">{pct}%</span>
    </div>
  );
}

export default function ReviewsSection({ slug }: Props) {
  const user = useAuthStore((s) => s.user);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({
    avgRating: null,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const userAlreadyReviewed = user
    ? reviews.some((r) => r.user.id === user.id)
    : false;

  useEffect(() => {
    setLoading(true);
    getProductReviews(slug, 1).then((result) => {
      setReviews(result.reviews);
      setSummary(result.summary);
      setMeta(result.meta);
      setLoading(false);
    });
  }, [slug]);

  async function loadMore() {
    if (meta.currentPage >= meta.lastPage) return;
    setLoadingMore(true);
    const result = await getProductReviews(slug, meta.currentPage + 1);
    setReviews((prev) => [...prev, ...result.reviews]);
    setMeta(result.meta);
    setLoadingMore(false);
  }

  function handleReviewSubmitted(review: Review) {
    setReviews((prev) => [review, ...prev]);
    setSummary((prev) => {
      const newTotal = prev.total + 1;
      const newDist = { ...prev.distribution, [review.rating]: (prev.distribution[review.rating as keyof typeof prev.distribution] ?? 0) + 1 };
      const sum = Object.entries(newDist).reduce((acc, [k, v]) => acc + Number(k) * v, 0);
      return { avgRating: Math.round((sum / newTotal) * 10) / 10, total: newTotal, distribution: newDist };
    });
    setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
    setSubmitted(true);
  }

  return (
    <section className="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Customer Reviews
        {summary.total > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-400">({summary.total})</span>
        )}
      </h2>

      {/* Summary panel */}
      {summary.total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-gray-50 rounded-2xl">
          {/* Avg score */}
          <div className="flex flex-col items-center justify-center min-w-28">
            <span className="text-5xl font-extrabold text-gray-900">
              {summary.avgRating?.toFixed(1)}
            </span>
            <StarRating rating={summary.avgRating ?? 0} size={16} className="mt-2" />
            <span className="text-xs text-gray-400 mt-1">{summary.total} review{summary.total !== 1 ? "s" : ""}</span>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingBar
                key={star}
                star={star}
                count={summary.distribution[star as keyof typeof summary.distribution] ?? 0}
                total={summary.total}
              />
            ))}
          </div>
        </div>
      )}

      {/* Write a review */}
      {!submitted && user && !userAlreadyReviewed && (
        <div className="mb-8">
          <WriteReviewForm slug={slug} onSubmitted={handleReviewSubmitted} />
        </div>
      )}
      {submitted && (
        <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl text-sm text-green-700 font-medium">
          Thank you! Your review has been submitted.
        </div>
      )}
      {!user && (
        <div className="mb-8 p-4 bg-primary-50 border border-primary-100 rounded-2xl text-sm text-gray-700">
          <Link href="/login" className="text-primary-600 font-semibold hover:underline">
            Log in
          </Link>{" "}
          to share your experience with this product.
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 size={24} className="animate-spin text-primary-400" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400 py-6 text-center">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {meta.currentPage < meta.lastPage && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-6 flex items-center gap-2 text-sm text-primary-600 font-semibold hover:text-primary-700 disabled:opacity-60"
            >
              {loadingMore && <Loader2 size={14} className="animate-spin" />}
              {loadingMore ? "Loading…" : "Load more reviews"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
