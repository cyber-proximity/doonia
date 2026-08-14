<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Category Details')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state) =>
                                $set('slug', Str::slug($state ?? ''))
                            ),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Select::make('parent_id')
                            ->label('Parent category')
                            ->relationship('parent', 'name')
                            ->searchable()
                            ->preload()
                            ->placeholder('None (top-level)'),
                        Select::make('status')
                            ->options(['active' => 'Active', 'inactive' => 'Inactive'])
                            ->default('active')
                            ->required(),
                        Textarea::make('description')
                            ->columnSpanFull(),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ]),

                Section::make('Image')
                    ->schema([
                        Placeholder::make('current_image')
                            ->label('Current Image')
                            ->content(function (Get $get): HtmlString {
                                $id = $get('id');
                                if (! $id) {
                                    return new HtmlString('<span style="font-size:.875rem;color:#6b7280">No image saved yet</span>');
                                }
                                $category = \App\Models\Category::find($id);
                                if (! $category?->image) {
                                    return new HtmlString('<span style="font-size:.875rem;color:#6b7280">No image saved yet</span>');
                                }
                                $src = str_starts_with($category->image, 'http')
                                    ? $category->image
                                    : Storage::disk('public')->url($category->image);
                                return new HtmlString("<img src=\"{$src}\" style=\"max-width:180px;max-height:140px;object-fit:contain;border-radius:6px;\">");
                            }),
                        FileUpload::make('image')
                            ->label(fn (Get $get): string => $get('id') ? 'Replace Image' : 'Upload Image')
                            ->helperText(fn (Get $get): string => $get('id') ? 'Leave empty to keep the current image' : '')
                            ->image()
                            ->disk('public')
                            ->directory('categories')
                            ->maxSize(2048),
                    ]),
            ]);
    }
}
