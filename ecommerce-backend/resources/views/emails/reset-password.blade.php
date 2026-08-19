@php
    $recipientEmail = $user->email;
    $subject        = 'Reset Your Doonnia Password';
    $firstName      = explode(' ', $user->name)[0];
@endphp
@extends('emails.layout')

@section('content')

{{-- Icon + Heading --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding-bottom:24px;">
      <div style="font-size:48px;line-height:1;">🔐</div>
      <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#111827;">Password Reset Request</h1>
      <p style="margin:0;color:#6b7280;font-size:15px;">Hi {{ $firstName }}, we received a request to reset your password.</p>
    </td>
  </tr>
</table>

{{-- Info box --}}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;margin-bottom:28px;">
  <tr>
    <td style="padding:20px 24px;">
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
        Click the button below to set a new password. This link is valid for <strong>60 minutes</strong>
        and can only be used once.
      </p>
    </td>
  </tr>
</table>

{{-- CTA --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
  <tr>
    <td align="center">
      <a href="{{ $resetUrl }}"
         style="display:inline-block;background:#00B5C8;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:12px;">
        Reset My Password
      </a>
    </td>
  </tr>
</table>

{{-- Fallback link --}}
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
  <tr>
    <td style="font-size:12px;color:#9ca3af;text-align:center;">
      <p style="margin:0 0 6px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="margin:0;word-break:break-all;color:#00B5C8;">{{ $resetUrl }}</p>
    </td>
  </tr>
</table>

{{-- Didn't request? --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="border-top:1px solid #f3f4f6;padding-top:20px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#9ca3af;">
        If you didn't request a password reset, you can safely ignore this email —<br />
        your password will not change.
      </p>
    </td>
  </tr>
</table>

@endsection
