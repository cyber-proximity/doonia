<?php

namespace App\Providers;

use App\Mail\ResetPasswordMail;
use App\Models\Order;
use App\Observers\OrderObserver;
use Filament\Http\Responses\Auth\Contracts\LogoutResponse as LogoutResponseContract;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LogoutResponseContract::class, function () {
            return new class implements LogoutResponseContract {
                public function toResponse($request)
                {
                    return redirect('/admin/login');
                }
            };
        });
    }

    public function boot(): void
    {
        Order::observe(OrderObserver::class);

        // Send a branded Doonnia email instead of the default Laravel notification.
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $base = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');
            return $base . '/reset-password?token=' . $token . '&email=' . urlencode($user->getEmailForPasswordReset());
        });

        ResetPassword::toMailUsing(function ($user, string $token) {
            $base     = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');
            $resetUrl = $base . '/reset-password?token=' . $token . '&email=' . urlencode($user->getEmailForPasswordReset());
            return new ResetPasswordMail($user, $resetUrl);
        });
    }
}

