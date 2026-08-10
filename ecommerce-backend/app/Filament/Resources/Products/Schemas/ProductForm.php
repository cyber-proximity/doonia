<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Product Details')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state) =>
                                $set('slug', Str::slug($state ?? ''))
                            )
                            ->columnSpanFull(),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Select::make('category_id')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        RichEditor::make('description')
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold', 'italic', 'underline',
                                'bulletList', 'orderedList', 'undo', 'redo',
                            ]),
                    ]),

                Section::make('Pricing & Inventory')
                    ->columns(2)
                    ->schema([
                        TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('GH₵')
                            ->minValue(0),
                        TextInput::make('compare_at_price')
                            ->numeric()
                            ->prefix('GH₵')
                            ->minValue(0),
                        TextInput::make('sku')
                            ->label('SKU')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(100),
                        TextInput::make('stock_quantity')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        TextInput::make('low_stock_threshold')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(10),
                    ]),

                Section::make('Visibility')
                    ->columns(2)
                    ->schema([
                        Select::make('status')
                            ->options(fn () => auth()->user()->hasRole('admin')
                                ? \App\Models\Product::STATUSES
                                : ['draft' => 'Draft', 'pending_review' => 'Pending Review']
                            )
                            ->default(fn () => auth()->user()->hasRole('admin') ? 'active' : 'draft')
                            ->disabled(fn () => auth()->user()->hasRole('staff'))
                            ->dehydrated()
                            ->required(),
                        Toggle::make('featured')
                            ->label('Featured product')
                            ->default(false)
                            ->hidden(fn () => auth()->user()->hasRole('staff')),
                    ]),

                Section::make('Images')
                    ->schema([
                        Repeater::make('images')
                            ->relationship()
                            ->schema([
                                // Stash the existing URL in Livewire state so we can restore it
                                // if the admin saves without uploading a replacement.
                                TextInput::make('_existing_url')
                                    ->hidden(),

                                // Static preview of the currently saved image (no FilePond restore).
                                Placeholder::make('image_preview')
                                    ->label('Current Image')
                                    ->content(fn (Get $get): HtmlString => $get('_existing_url')
                                        ? new HtmlString('<img src="' . Storage::disk('public')->url($get('_existing_url')) . '" style="max-width:180px;max-height:140px;object-fit:contain;border-radius:6px;">')
                                        : new HtmlString('<span style="font-size:.875rem;color:#6b7280">No image yet</span>')
                                    )
                                    ->columnSpan(2),

                                FileUpload::make('url')
                                    ->label(fn (Get $get): string => $get('_existing_url') ? 'Replace Image' : 'Upload Image')
                                    ->helperText(fn (Get $get): string => $get('_existing_url') ? 'Leave empty to keep the current image' : '')
                                    ->image()
                                    ->disk('public')
                                    ->directory('products')
                                    ->required(fn (Get $get): bool => empty($get('_existing_url'))),

                                TextInput::make('alt_text')
                                    ->label('Alt text')
                                    ->maxLength(255),
                                Toggle::make('is_primary')
                                    ->label('Primary image'),
                                TextInput::make('sort_order')
                                    ->label('Sort order')
                                    ->numeric()
                                    ->default(0),
                            ])
                            // Runs once on initial page load: moves the stored URL into _existing_url
                            // and clears `url` so FilePond starts empty (no restore request → no loading).
                            ->mutateRelationshipDataBeforeFillUsing(function (array $data): array {
                                $data['_existing_url'] = $data['url'] ?? null;
                                $data['url'] = null;
                                return $data;
                            })
                            // Runs before updating an existing image record: if no new file was
                            // uploaded (url still null), restore the original path from _existing_url.
                            ->mutateRelationshipDataBeforeSaveUsing(function (array $data): array {
                                if (empty($data['url'])) {
                                    $data['url'] = $data['_existing_url'] ?? null;
                                }
                                unset($data['_existing_url']);
                                return $data;
                            })
                            // Runs before creating a new image record: just strip _existing_url.
                            ->mutateRelationshipDataBeforeCreateUsing(function (array $data): array {
                                unset($data['_existing_url']);
                                return $data;
                            })
                            ->columns(2)
                            ->addActionLabel('Add image')
                            ->defaultItems(1),
                    ]),
            ]);
    }
}
