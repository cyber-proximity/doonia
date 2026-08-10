<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    private bool $hasAnyImagesInForm = false;
    private array $imageIdsInForm = [];
    private array $existingImageUrls = [];

    protected function beforeSave(): void
    {
        $this->existingImageUrls = $this->record->images()->pluck('url', 'id')->toArray();
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $images = array_values($data['images'] ?? []);
        $this->hasAnyImagesInForm = ! empty($images);
        $this->imageIdsInForm = collect($images)
            ->pluck('id')
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->toArray();

        return $data;
    }

    protected function afterSave(): void
    {
        // Safety net: restore URLs cleared by afterStateHydrated when no new file was uploaded
        foreach ($this->existingImageUrls as $id => $url) {
            $this->record->images()
                ->where('id', $id)
                ->whereNull('url')
                ->update(['url' => $url]);
        }

        // Sync deletes: remove images the user removed from the Repeater
        if (! $this->hasAnyImagesInForm) {
            $this->record->images()->delete();
        } elseif (! empty($this->imageIdsInForm)) {
            $this->record->images()->whereNotIn('id', $this->imageIdsInForm)->delete();
        }

        // Clean up any null-URL images (new rows where no file was uploaded)
        $this->record->images()->where(function ($q) {
            $q->whereNull('url')->orWhere('url', '');
        })->delete();
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

