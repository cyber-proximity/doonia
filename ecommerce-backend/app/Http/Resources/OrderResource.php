<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'order_number'        => $this->order_number,
            'customer_name'       => $this->customer_name,
            'customer_email'      => $this->customer_email,
            'customer_phone'      => $this->customer_phone,
            'shipping_address'    => $this->shipping_address,
            'subtotal'            => (float) $this->subtotal,
            'shipping_fee'        => (float) $this->shipping_fee,
            'discount_amount'     => (float) $this->discount_amount,
            'total'               => (float) $this->total,
            'payment_status'      => $this->payment_status,
            'order_status'        => $this->order_status,
            'paystack_reference'  => $this->paystack_reference,
            'notes'               => $this->notes,
            'created_at'          => $this->created_at,
            'items'               => OrderItemResource::collection($this->whenLoaded('items')),
            'payment'             => $this->whenLoaded('payment', fn () => [
                'status'         => $this->payment?->status,
                'payment_method' => $this->payment?->payment_method,
            ]),
        ];
    }
}
