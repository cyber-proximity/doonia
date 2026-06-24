<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'product_id'   => $this->product_id,
            'product_name' => $this->product_name,
            'product_sku'  => $this->product_sku,
            'quantity'     => $this->quantity,
            'unit_price'   => (float) $this->unit_price,
            'total_price'  => (float) $this->total_price,
            'product_image'=> $this->whenLoaded('product', function () {
                $img = $this->product?->images->firstWhere('is_primary', true)
                    ?? $this->product?->images->first();
                return $img?->url;
            }),
        ];
    }
}
