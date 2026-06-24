<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'slug'                => $this->slug,
            'description'         => $this->description,
            'price'               => (float) $this->price,
            'compare_at_price'    => $this->compare_at_price ? (float) $this->compare_at_price : null,
            'sku'                 => $this->sku,
            'stock_quantity'      => $this->stock_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'status'              => $this->status,
            'featured'            => $this->featured,
            'category'            => new CategoryResource($this->whenLoaded('category')),
            'images'              => $this->when(
                $this->relationLoaded('images'),
                fn () => $this->images->map(fn ($img) => [
                    'id'         => $img->id,
                    'url'        => str_starts_with($img->url, 'http') ? $img->url : Storage::disk('public')->url($img->url),
                    'alt_text'   => $img->alt_text,
                    'sort_order' => $img->sort_order,
                    'is_primary' => $img->is_primary,
                ])
            ),
            'avg_rating'   => $this->reviews_avg_rating ? round((float) $this->reviews_avg_rating, 1) : null,
            'review_count' => (int) ($this->reviews_count ?? 0),
            'created_at'   => $this->created_at,
        ];
    }
}
