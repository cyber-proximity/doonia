<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Arr;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function afterSave(): void
    {
        $keptIds = collect(array_values($this->data['images'] ?? []))
            ->pluck('id')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->toArray();

        if (empty($keptIds)) {
            $this->record->images()->delete();
        } else {
            $this->record->images()->whereNotIn('id', $keptIds)->delete();
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('submitForReview')
                ->label('Submit for Review')
                ->color('warning')
                ->icon('heroicon-o-paper-airplane')
                ->visible(fn () => auth()->user()->hasRole('staff') && $this->record->status === 'draft')
                ->requiresConfirmation()
                ->action(function () {
                    $this->record->update(['status' => 'pending_review']);
                    Notification::make()->title('Submitted for review')->success()->send();
                    $this->refreshFormData(['status']);
                }),

            Action::make('approve')
                ->label('Approve')
                ->color('success')
                ->icon('heroicon-o-check-circle')
                ->visible(fn () => auth()->user()->hasRole('admin') && $this->record->status === 'pending_review')
                ->requiresConfirmation()
                ->action(function () {
                    $this->record->update(['status' => 'active']);
                    Notification::make()->title('Product approved and published')->success()->send();
                    $this->refreshFormData(['status']);
                }),

            Action::make('reject')
                ->label('Reject')
                ->color('danger')
                ->icon('heroicon-o-x-circle')
                ->visible(fn () => auth()->user()->hasRole('admin') && $this->record->status === 'pending_review')
                ->requiresConfirmation()
                ->action(function () {
                    $this->record->update(['status' => 'inactive']);
                    Notification::make()->title('Product rejected')->warning()->send();
                    $this->refreshFormData(['status']);
                }),

            DeleteAction::make()
                ->visible(fn () => ProductResource::canDelete($this->record)),
            ForceDeleteAction::make()
                ->visible(fn () => auth()->user()->hasRole('admin')),
            RestoreAction::make()
                ->visible(fn () => auth()->user()->hasRole('admin')),
        ];
    }
}

