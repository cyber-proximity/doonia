<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\ProductImage;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Database\Eloquent\Model;
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
                                // Show the currently saved image. Uses a DB look-up so it always
                                // reflects what's actually in the database, regardless of form state.
                                Placeholder::make('current_image')
                                    ->label('Current Image')
                                    ->content(function (Get $get): HtmlString {
                                        $id = $get('id');
                                        if (! $id) {
                                            return new HtmlString(
                                                '<span style="font-size:.875rem;color:#6b7280">No image saved yet</span>'
                                            );
                                        }
                                        $image = ProductImage::find($id);
                                        if (! $image?->url) {
                                            return new HtmlString(
                                                '<span style="font-size:.875rem;color:#6b7280">No image saved yet</span>'
                                            );
                                        }
                                        $src = Storage::disk('public')->url($image->url);
                                        return new HtmlString(
                                            "<img src=\"{$src}\" style=\"max-width:180px;max-height:140px;object-fit:contain;border-radius:6px;\">"
                                        );
                                    })
                                    ->columnSpan(2),

                                FileUpload::make('url')
                                    ->label(fn (Get $get): string => $get('id') ? 'Replace Image' : 'Upload Image')
                                    ->helperText(fn (Get $get): string => $get('id') ? 'Leave empty to keep the current image' : '')
                                    ->image()
                                    ->disk('public')
                                    ->directory('products')
                                    ->required(fn (Get $get): bool => ! $get('id')),

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
                            // Runs once on initial page load. Clears `url` so FilePond starts
                            // empty (no file to restore → no "loading / waiting for size").
                            ->mutateRelationshipDataBeforeFillUsing(function (array $data): array {
                                $data['url'] = null;
                                return $data;
                            })
                            // Before updating an existing image record: if the admin didn't upload
                            // a new file (url is still null), keep the original path from the DB.
                            ->mutateRelationshipDataBeforeSaveUsing(function (array $data, Model $record): array {
                                if (empty($data['url'])) {
                                    $data['url'] = $record->url;
                                }
                                return $data;
                            })
                            ->columns(2)
                            ->addActionLabel('Add image')
                            ->defaultItems(1),
                    ]),
            ]);
    }
}
