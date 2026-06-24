"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import StarInput from "@/components/ui/StarInput";
import { submitReview } from "@/lib/services/reviews";
import { Review } from "@/types";

interface Props {
  slug: string;
  onSubmitted: (review: Review) => void;
}

export default function WriteReviewForm({ slug, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const review = await submitReview(slug, {
        rating,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
      });
      onSubmitted(review);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-5 space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Write a Review</h3>

      {/* Star picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={255}
          placeholder="Summarise your experience"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Tell others what you think about this product…"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
      >
        {submitting && <Loader2 size={15} className="animate-spin" />}
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
