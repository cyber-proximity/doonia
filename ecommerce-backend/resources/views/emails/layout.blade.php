<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ $subject ?? 'Doonia' }}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          {{-- Header --}}
          <tr>
            <td style="background:#00B5C8;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
              <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Doonia</span>
              <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0;">Ghana&apos;s Online Marketplace</p>
            </td>
          </tr>

          {{-- Body --}}
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              @yield('content')
            </td>
          </tr>

          {{-- Footer --}}
          <tr>
            <td style="background:#f9fafb;border-radius:0 0 16px 16px;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; {{ date('Y') }} Doonia &mdash; All rights reserved.<br />
                This email was sent to <strong>{{ $recipientEmail ?? '' }}</strong> regarding your order.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
