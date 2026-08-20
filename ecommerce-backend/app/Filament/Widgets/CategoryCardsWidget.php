<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\Storage;

class CategoryCardsWidget extends Widget
{
    protected static string $view = 'filament.widgets.category-cards-widget';

    protected int|string|array $columnSpan = 'full';

    protected static bool $isLazy = false;

    public function getCategories(): \Illuminate\Database\Eloquent\Collection
    {
        return Category::whereNull('parent_id')
            ->where('status', 'active')
            ->withCount('products')
            ->orderBy('sort_order')
            ->take(6)
            ->get();
    }

    public function getImageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
