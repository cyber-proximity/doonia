<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
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
                                FileUpload::make('url')
                                    ->label('Image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('products')
                                    ->fetchFileInformation(false)
                                    ->required(),
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
                            ->columns(2)
                            ->addActionLabel('Add image')
                            ->defaultItems(1),
                    ]),
            ]);
    }
}
