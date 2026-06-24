<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'image'         => $this->image ? $this->resolveUrl($this->image) : null,
            'status'        => $this->status,
            'sort_order'    => $this->sort_order,
            'product_count' => $this->whenCounted('products'),
        ];
    }

    private function resolveUrl(string $path): string
    {
        return str_starts_with($path, 'http') ? $path : Storage::url($path);
    }
}
