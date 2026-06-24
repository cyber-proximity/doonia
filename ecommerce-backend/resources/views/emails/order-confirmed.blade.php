@php
    $order          = $order;
    $recipientEmail = $order->customer_email;
    $subject        = "Order Confirmed – {$order->order_number}";
    $frontendUrl    = config('app.frontend_url');
@endphp
@extends('emails.layout')

@section('content')

{{-- Icon + Heading --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding-bottom:24px;">
      <div style="width:56px;height:56px;background:#ecfdf5;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;line-height:56px;text-align:center;">✅</div>
      <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#111827;">Order Confirmed!</h1>
      <p style="margin:0;color:#6b7280;font-size:15px;">Hi {{ $order->customer_name }}, your order has been placed successfully.</p>
    </td>
  </tr>
</table>

{{-- Order meta --}}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;margin-bottom:24px;">
  <tr>
    <td style="padding:16px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#6b7280;">Order Number</td>
          <td align="right" style="font-size:13px;font-weight:700;color:#111827;">{{ $order->order_number }}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#6b7280;padding-top:6px;">Date</td>
          <td align="right" style="font-size:13px;color:#374151;padding-top:6px;">{{ $order->created_at->format('d M Y, g:i A') }}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#6b7280;padding-top:6px;">Payment</td>
          <td align="right" style="padding-top:6px;">
            <span style="font-size:12px;font-weight:600;color:#065f46;background:#d1fae5;padding:2px 10px;border-radius:20px;">Paid</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

{{-- Items --}}
<h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 12px;">Items Ordered</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
  <thead>
    <tr style="background:#f3f4f6;">
      <th style="text-align:left;padding:10px 12px;font-size:12px;font-weight:600;color:#6b7280;border-radius:8px 0 0 8px;">Product</th>
      <th style="text-align:center;padding:10px 8px;font-size:12px;font-weight:600;color:#6b7280;">Qty</th>
      <th style="text-align:right;padding:10px 12px;font-size:12px;font-weight:600;color:#6b7280;border-radius:0 8px 8px 0;">Price</th>
    </tr>
  </thead>
  <tbody>
    @foreach ($order->items as $item)
    <tr style="border-bottom:1px solid #f3f4f6;">
      <td style="padding:12px;font-size:14px;color:#374151;">
        {{ $item->product_name }}<br />
        <span style="font-size:12px;color:#9ca3af;">{{ $item->product_sku }}</span>
      </td>
      <td style="padding:12px 8px;text-align:center;font-size:14px;color:#374151;">{{ $item->quantity }}</td>
      <td style="padding:12px;text-align:right;font-size:14px;font-weight:600;color:#111827;">GH₵{{ number_format($item->total_price, 2) }}</td>
    </tr>
    @endforeach
  </tbody>
</table>

{{-- Totals --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="font-size:13px;color:#6b7280;padding:4px 0;">Subtotal</td>
    <td align="right" style="font-size:13px;color:#374151;padding:4px 0;">GH₵{{ number_format($order->subtotal, 2) }}</td>
  </tr>
  <tr>
    <td style="font-size:13px;color:#6b7280;padding:4px 0;">Shipping</td>
    <td align="right" style="font-size:13px;color:#374151;padding:4px 0;">
      {{ $order->shipping_fee == 0 ? 'Free' : 'GH₵' . number_format($order->shipping_fee, 2) }}
    </td>
  </tr>
  @if ($order->discount_amount > 0)
  <tr>
    <td style="font-size:13px;color:#059669;padding:4px 0;">Discount</td>
    <td align="right" style="font-size:13px;color:#059669;padding:4px 0;">-GH₵{{ number_format($order->discount_amount, 2) }}</td>
  </tr>
  @endif
  <tr>
    <td colspan="2" style="padding:8px 0 0;border-top:2px solid #e5e7eb;"></td>
  </tr>
  <tr>
    <td style="font-size:16px;font-weight:700;color:#111827;padding:4px 0;">Total</td>
    <td align="right" style="font-size:16px;font-weight:700;color:#00B5C8;padding:4px 0;">GH₵{{ number_format($order->total, 2) }}</td>
  </tr>
</table>

{{-- Shipping address --}}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdff;border:1px solid #cffafe;border-radius:12px;margin-bottom:28px;">
  <tr>
    <td style="padding:16px 20px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0e7490;">Delivering To</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
        {{ $order->customer_name }}<br />
        {{ $order->shipping_address['street'] ?? '' }}<br />
        {{ $order->shipping_address['city'] ?? '' }}{{ isset($order->shipping_address['region']) ? ', ' . $order->shipping_address['region'] : '' }}, Ghana
      </p>
    </td>
  </tr>
</table>

{{-- CTA --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center">
      <a href="{{ $frontendUrl }}/account/orders/{{ $order->order_number }}"
         style="display:inline-block;background:#00B5C8;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:12px;">
        View Order Details
      </a>
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
        We&apos;ll notify you when your order ships.
      </p>
    </td>
  </tr>
</table>

@endsection
