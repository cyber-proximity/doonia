import { Review, ReviewSummary } from "@/types";
import api from "@/lib/api";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api") + "/v1";

type RawReview = {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  user: { id: number; name: string };
  created_at: string;
};

function toReview(raw: RawReview): Review {
  return {
    id: raw.id,
    rating: raw.rating,
    title: raw.title,
    body: raw.body,
    user: raw.user,
    createdAt: raw.created_at,
  };
}

export interface ReviewsResult {
  reviews: Review[];
  summary: ReviewSummary;
  meta: { currentPage: number; lastPage: number; total: number };
}

export async function getProductReviews(
  slug: string,
  page = 1
): Promise<ReviewsResult> {
  const empty: ReviewsResult = {
    reviews: [],
    summary: { avgRating: null, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
    meta: { currentPage: 1, lastPage: 1, total: 0 },
  };

  try {
    const res = await fetch(`${BASE}/products/${slug}/reviews?page=${page}`, {
      cache: "no-store",
    });
    if (!res.ok) return empty;
    const json = await res.json();
    return {
      reviews: (json.data as RawReview[]).map(toReview),
      summary: {
        avgRating: json.summary.avg_rating ?? null,
        total: json.summary.total,
        distribution: json.summary.distribution,
      },
      meta: {
        currentPage: json.meta.current_page,
        lastPage: json.meta.last_page,
        total: json.meta.total,
      },
    };
  } catch {
    return empty;
  }
}

export async function submitReview(
  slug: string,
  data: { rating: number; title?: string; body?: string }
): Promise<Review> {
  const res = await api.post(`/v1/products/${slug}/reviews`, data);
  const raw: RawReview = res.data.data;
  return toReview(raw);
}

