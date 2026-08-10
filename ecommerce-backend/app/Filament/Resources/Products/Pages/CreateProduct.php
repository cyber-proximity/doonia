<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Resources\Pages\CreateRecord;

class CreateProduct extends CreateRecord
{
    protected static string $resource = ProductResource::class;

    private ?string $newImagePath = null;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $this->newImagePath = $data['new_primary_image'] ?? null;
        unset($data['new_primary_image']);

        $data['created_by'] = auth()->id();

        if (auth()->user()->hasRole('staff')) {
            $data['status'] = 'draft';
        }

        return $data;
    }

    protected function afterCreate(): void
    {
        if ($this->newImagePath) {
            $this->record->images()->create([
                'url'        => $this->newImagePath,
                'is_primary' => true,
                'sort_order' => 0,
                'alt_text'   => $this->record->name,
            ]);
        }
    }
}

