<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingReviewWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Products Awaiting Approval';

    public static function canView(): bool
    {
        return auth()->check() && auth()->user()->hasRole('admin');
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->where('status', 'pending_review')
                    ->with(['creator', 'category'])
                    ->latest()
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Product')
                    ->weight(FontWeight::Medium)
                    ->searchable(),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->badge(),

                Tables\Columns\TextColumn::make('creator.name')
                    ->label('Submitted by')
                    ->default('—'),

                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->formatStateUsing(fn ($state) => 'GH₵ ' . number_format((float) $state, 2)),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Submitted')
                    ->since()
                    ->sortable(),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Approve')
                    ->color('success')
                    ->icon('heroicon-m-check-circle')
                    ->requiresConfirmation()
                    ->action(function (Product $record) {
                        $record->update(['status' => 'active']);
                        Notification::make()->title('Product approved and published')->success()->send();
                    }),

                Action::make('reject')
                    ->label('Reject')
                    ->color('danger')
                    ->icon('heroicon-m-x-circle')
                    ->requiresConfirmation()
                    ->action(function (Product $record) {
                        $record->update(['status' => 'inactive']);
                        Notification::make()->title('Product rejected')->warning()->send();
                    }),

                Action::make('view')
                    ->label('Full Review')
                    ->icon('heroicon-m-eye')
                    ->url(fn (Product $record) => route('filament.admin.resources.products.edit', $record)),
            ])
            ->emptyStateHeading('No products awaiting approval')
            ->emptyStateIcon('heroicon-o-check-badge')
            ->paginated(false);
    }
}
