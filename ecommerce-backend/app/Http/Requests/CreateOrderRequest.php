<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // guest checkout allowed
    }

    public function rules(): array
    {
        return [
            'customer_name'            => ['required', 'string', 'max:100'],
            'customer_email'           => ['required', 'email', 'max:150'],
            'customer_phone'           => ['nullable', 'string', 'max:20'],
            'shipping_address'         => ['required', 'array'],
            'shipping_address.street'  => ['required', 'string', 'max:200'],
            'shipping_address.city'    => ['required', 'string', 'max:100'],
            'shipping_address.region'  => ['nullable', 'string', 'max:100'],
            'items'                    => ['required', 'array', 'min:1'],
            'items.*.product_id'       => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'         => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'               => 'Your cart is empty.',
            'items.*.product_id.exists'    => 'One or more products in your cart no longer exist.',
        ];
    }
}
