<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class RevenueStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    public static function canView(): bool
    {
        return auth()->check() && auth()->user()->hasRole('admin');
    }

    protected function getStats(): array
    {
        $now = Carbon::now();

        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');

        $monthRevenue = Order::where('payment_status', 'paid')
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->sum('total');

        $todayOrders = Order::whereDate('created_at', $now->toDateString())->count();
        $totalOrders = Order::count();

        $pendingOrders = Order::where('order_status', 'pending')
            ->where('payment_status', 'paid')
            ->count();

        // Sparkline: last 7 days revenue
        $last7 = collect(range(6, 0))->map(fn ($days) => (float) Order::where('payment_status', 'paid')
            ->whereDate('created_at', $now->copy()->subDays($days)->toDateString())
            ->sum('total')
        )->toArray();

        return [
            Stat::make('Total Revenue', 'GH₵ ' . number_format((float) $totalRevenue, 2))
                ->description('All-time confirmed payments')
                ->descriptionIcon('heroicon-m-banknotes')
                ->chart($last7)
                ->color('success'),

            Stat::make('Revenue This Month', 'GH₵ ' . number_format((float) $monthRevenue, 2))
                ->description($now->format('F Y'))
                ->descriptionIcon('heroicon-m-calendar-days')
                ->color('primary'),

            Stat::make('Total Orders', number_format($totalOrders))
                ->description($todayOrders . ' new today')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('primary'),

            Stat::make('Awaiting Processing', $pendingOrders)
                ->description('Paid but not yet dispatched')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingOrders > 0 ? 'warning' : 'success'),
        ];
    }
}
