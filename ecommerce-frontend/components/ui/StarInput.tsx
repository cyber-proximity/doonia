"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: number;
}

export default function StarInput({ value, onChange, size = 28 }: StarInputProps) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={size}
            fill={display >= star ? "#f59e0b" : "none"}
            className={display >= star ? "text-amber-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}
