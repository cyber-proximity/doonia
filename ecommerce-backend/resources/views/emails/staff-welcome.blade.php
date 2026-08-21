@php
    $recipientEmail = $user->email;
    $subject        = 'Your Doonnia Staff Account is Ready';
    $loginUrl       = 'https://admin.doonia.store/admin/login';
    $firstName      = explode(' ', $user->name)[0];
@endphp
@extends('emails.layout')

@section('content')

{{-- Icon + Heading --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding-bottom:24px;">
      <div style="font-size:48px;line-height:1;">👋</div>
      <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#111827;">Welcome to the Team, {{ $firstName }}!</h1>
      <p style="margin:0;color:#6b7280;font-size:15px;">Your Doonnia staff account has been created. Here are your login details.</p>
    </td>
  </tr>
</table>

{{-- Credentials box --}}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;margin-bottom:28px;border:1px solid #e5e7eb;">
  <tr>
    <td style="padding:20px 24px;">
      <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#111827;">Your Login Credentials</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#6b7280;padding:6px 0;width:40%;">Email</td>
          <td style="font-size:13px;font-weight:600;color:#111827;padding:6px 0;">{{ $user->email }}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#6b7280;padding:6px 0;">Password</td>
          <td style="font-size:14px;font-weight:700;color:#00B5C8;padding:6px 0;font-family:monospace;letter-spacing:0.5px;">{{ $plainPassword }}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

{{-- Warning --}}
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin-bottom:28px;">
  <tr>
    <td style="padding:14px 20px;font-size:13px;color:#92400e;">
      ⚠️&nbsp; <strong>Please change your password</strong> after your first login for security purposes.
    </td>
  </tr>
</table>

{{-- CTA --}}
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center">
      <a href="{{ $loginUrl }}"
         style="display:inline-block;background:#00B5C8;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:12px;">
        Go to Admin Login
      </a>
      <p style="margin:16px 0 0;font-size:13px;color:#9ca3af;">
        If the button doesn't work, copy this link:<br />
        <span style="color:#00B5C8;">{{ $loginUrl }}</span>
      </p>
    </td>
  </tr>
</table>

@endsection
