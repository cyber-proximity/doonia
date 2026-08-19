@php
    $recipientEmail = $user->email;
    $subject        = 'Welcome to Doonnia!';
    $frontendUrl    = config('app.frontend_url');
    $firstName      = explode(' ', $user->name)[0];
@endphp
@extends('emails.layout')

@section('content')

{{-- Icon + Heading --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding-bottom:24px;">
      <div style="font-size:48px;line-height:1;">🎉</div>
      <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#111827;">Welcome to Doonnia, {{ $firstName }}!</h1>
      <p style="margin:0;color:#6b7280;font-size:15px;">Your account has been created. Happy shopping!</p>
    </td>
  </tr>
</table>

{{-- What you can do --}}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;margin-bottom:28px;">
  <tr>
    <td style="padding:20px 24px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#111827;">Here's what you can do on Doonnia:</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#374151;">🛍️&nbsp; Browse thousands of products</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#374151;">📦&nbsp; Track your orders in real time</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#374151;">❤️&nbsp; Save favourites to your wishlist</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#374151;">🚚&nbsp; Free delivery on orders over GH₵200</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

{{-- Account details --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
  <tr>
    <td style="font-size:13px;color:#6b7280;padding:4px 0;">Name</td>
    <td align="right" style="font-size:13px;font-weight:600;color:#111827;padding:4px 0;">{{ $user->name }}</td>
  </tr>
  <tr>
    <td style="font-size:13px;color:#6b7280;padding:4px 0;">Email</td>
    <td align="right" style="font-size:13px;font-weight:600;color:#111827;padding:4px 0;">{{ $user->email }}</td>
  </tr>
</table>

{{-- CTA --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center">
      <a href="{{ $frontendUrl }}"
         style="display:inline-block;background:#00B5C8;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:12px;">
        Start Shopping
      </a>
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
        Need help? Just reply to this email.
      </p>
    </td>
  </tr>
</table>

@endsection
