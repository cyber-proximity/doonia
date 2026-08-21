<?php

namespace App\Filament\Resources\Staff\Pages;

use App\Filament\Resources\Staff\StaffResource;
use App\Mail\StaffWelcomeMail;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CreateStaff extends CreateRecord
{
    protected static string $resource = StaffResource::class;

    protected ?string $plainPassword = null;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $this->plainPassword = Str::random(8) . rand(10, 99) . '!';
        $data['password']    = bcrypt($this->plainPassword);

        return $data;
    }

    protected function afterCreate(): void
    {
        $this->record->assignRole('staff');

        if ($this->plainPassword) {
            Mail::to($this->record->email)->send(
                new StaffWelcomeMail($this->record, $this->plainPassword)
            );
        }
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
