<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Order Information')
                ->schema([
                    Grid::make(2)->schema([
                        Placeholder::make('order_number')
                            ->label('Order Number')
                            ->content(fn ($record) => $record?->order_number ?? '—'),
                        Placeholder::make('created_at')
                            ->label('Date')
                            ->content(fn ($record) => $record?->created_at?->format('d M Y, H:i') ?? '—'),
                        Placeholder::make('customer_name')
                            ->label('Customer')
                            ->content(fn ($record) => $record?->customer_name ?? '—'),
                        Placeholder::make('customer_email')
                            ->label('Email')
                            ->content(fn ($record) => $record?->customer_email ?? '—'),
                        Placeholder::make('customer_phone')
                            ->label('Phone')
                            ->content(fn ($record) => $record?->customer_phone ?? '—'),
                        Placeholder::make('total')
                            ->label('Order Total')
                            ->content(fn ($record) => $record ? 'GH₵ ' . number_format($record->total, 2) : '—'),
                    ]),
                ]),

            Section::make('Update Status')
                ->schema([
                    Grid::make(2)->schema([
                        Select::make('order_status')
                            ->options([
                                'pending'    => 'Pending',
                                'processing' => 'Processing',
                                'shipped'    => 'Shipped',
                                'delivered'  => 'Delivered',
                                'cancelled'  => 'Cancelled',
                            ])
                            ->required(),
                        Select::make('payment_status')
                            ->options([
                                'pending'  => 'Pending',
                                'paid'     => 'Paid',
                                'failed'   => 'Failed',
                                'refunded' => 'Refunded',
                            ])
                            ->required(),
                    ]),
                    Textarea::make('notes')
                        ->rows(3)
                        ->placeholder('Internal notes…'),
                ]),
        ]);
    }
}
