<?php

namespace App\Providers;

use App\Models\Order;
use App\Observers\OrderObserver;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Order::observe(OrderObserver::class);

        // Point password reset links at the Next.js frontend, not the Laravel backend.
        ResetPassword::createUrlUsing(function ($user, string $token) {
            $base = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');
            return $base . '/reset-password?token=' . $token . '&email=' . urlencode($user->getEmailForPasswordReset());
        });
    }
}

