import { Review } from "@/types";
import StarRating from "@/components/ui/StarRating";

interface Props {
  review: Review;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewCard({ review }: Props) {
  const initials = review.user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="shrink-0 w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + date */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">{review.user.name}</span>
            <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
          </div>

          {/* Stars */}
          <StarRating rating={review.rating} size={13} className="mt-1" />

          {/* Title */}
          {review.title && (
            <p className="mt-2 text-sm font-semibold text-gray-800">{review.title}</p>
          )}

          {/* Body */}
          {review.body && (
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.body}</p>
          )}
        </div>
      </div>
    </div>
  );
}
