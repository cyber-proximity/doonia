<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Actions\Action;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LowStockWidget extends BaseWidget
{
    protected static ?int $sort = 4;

    public static function canView(): bool
    {
        return auth()->check() && auth()->user()->hasRole('admin');
    }

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Low Stock Alert';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->where('status', 'active')
                    ->where('stock_quantity', '<=', 10)
                    ->orderBy('stock_quantity')
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Product')
                    ->searchable()
                    ->weight(\Filament\Support\Enums\FontWeight::Medium),

                Tables\Columns\TextColumn::make('sku')
                    ->label('SKU')
                    ->copyable()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->badge(),

                Tables\Columns\TextColumn::make('stock_quantity')
                    ->label('Stock')
                    ->weight(\Filament\Support\Enums\FontWeight::Bold)
                    ->color(fn (int $state): string => match (true) {
                        $state === 0 => 'danger',
                        $state <= 3  => 'warning',
                        default      => 'primary',
                    })
                    ->formatStateUsing(fn (int $state): string => $state === 0 ? 'Out of stock' : $state . ' left'),

                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->formatStateUsing(fn ($state) => 'GH₵ ' . number_format((float) $state, 2)),
            ])
            ->recordActions([
                Action::make('restock')
                    ->label('Edit')
                    ->icon('heroicon-m-pencil-square')
                    ->url(fn (Product $record) => route('filament.admin.resources.products.edit', $record)),
            ])
            ->emptyStateHeading('All products are well stocked')
            ->emptyStateIcon('heroicon-o-check-badge')
            ->paginated(false);
    }
}
