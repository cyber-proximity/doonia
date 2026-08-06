<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Mail\OrderDeliveredMail;
use App\Mail\OrderShippedMail;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Mail;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    private string $previousOrderStatus = '';

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $this->previousOrderStatus = $this->record->order_status ?? '';
        return $data;
    }

    protected function afterSave(): void
    {
        $newStatus = $this->record->order_status;

        if ($newStatus === $this->previousOrderStatus) {
            return;
        }

        $order = $this->record->load('items');

        match ($newStatus) {
            'shipped'   => Mail::to($order->customer_email)->sendNow(new OrderShippedMail($order)),
            'delivered' => Mail::to($order->customer_email)->sendNow(new OrderDeliveredMail($order)),
            default     => null,
        };
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
