@php
    $order          = $order;
    $recipientEmail = $order->customer_email;
    $subject        = "Your Order Is On Its Way – {$order->order_number}";
    $frontendUrl    = config('app.frontend_url');
@endphp
@extends('emails.layout')

@section('content')

{{-- Icon + Heading --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding-bottom:24px;">
      <div style="font-size:48px;line-height:1;">🚚</div>
      <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#111827;">Your Order Is On Its Way!</h1>
      <p style="margin:0;color:#6b7280;font-size:15px;">Hi {{ $order->customer_name }}, your order has been shipped and is heading to you.</p>
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
          <td style="font-size:13px;color:#6b7280;padding-top:6px;">Order Total</td>
          <td align="right" style="font-size:13px;font-weight:700;color:#00B5C8;padding-top:6px;">GH₵{{ number_format($order->total, 2) }}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

{{-- Items summary --}}
<h2 style="font-size:15px;font-weight:700;color:#111827;margin:0 0 12px;">Items Being Delivered</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  @foreach ($order->items as $item)
  <tr style="border-bottom:1px solid #f3f4f6;">
    <td style="padding:10px 0;font-size:14px;color:#374151;">{{ $item->product_name }}</td>
    <td align="right" style="padding:10px 0;font-size:14px;color:#6b7280;">× {{ $item->quantity }}</td>
  </tr>
  @endforeach
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
        Track My Order
      </a>
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
        Questions? Reply to this email and we&apos;ll be happy to help.
      </p>
    </td>
  </tr>
</table>

@endsection
