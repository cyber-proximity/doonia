import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;        // 0–5, decimals supported
  size?: number;
  className?: string;
}

export default function StarRating({ rating, size = 14, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <Star
            key={star}
            size={size}
            fill={filled ? "#f59e0b" : half ? "url(#half)" : "none"}
            className={filled || half ? "text-amber-400" : "text-gray-300"}
          />
        );
      })}
    </div>
  );
}
