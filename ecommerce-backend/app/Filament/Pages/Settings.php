<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class Settings extends Page
{
    protected static $navigationIcon  = 'heroicon-o-cog-6-tooth';
    protected static string $view     = 'filament.pages.settings';
    protected static $navigationLabel = 'Settings';
    protected static $title           = 'Store Settings';
    protected static $navigationSort  = 99;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'ghs_to_usd' => Setting::get('ghs_to_usd', '0.063'),
            'ghs_to_ngn' => Setting::get('ghs_to_ngn', '15.38'),
            'ghs_to_cny' => Setting::get('ghs_to_cny', '0.45'),
        ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->statePath('data')
            ->components([
                Section::make('Currency Exchange Rates')
                    ->description('Set conversion rates from GHS (Ghana Cedis). Used to display prices in different currencies on the storefront.')
                    ->schema([
                        TextInput::make('ghs_to_usd')
                            ->label('1 GHS = ? USD')
                            ->numeric()
                            ->required()
                            ->minValue(0.0001)
                            ->step(0.0001)
                            ->suffix('USD')
                            ->placeholder('0.063'),
                        TextInput::make('ghs_to_ngn')
                            ->label('1 GHS = ? NGN')
                            ->numeric()
                            ->required()
                            ->minValue(0.01)
                            ->step(0.01)
                            ->suffix('NGN')
                            ->placeholder('15.38'),
                        TextInput::make('ghs_to_cny')
                            ->label('1 GHS = ? CNY')
                            ->numeric()
                            ->required()
                            ->minValue(0.0001)
                            ->step(0.0001)
                            ->suffix('CNY')
                            ->placeholder('0.45'),
                    ])->columns(3),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::set($key, (string) $value);
        }

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Settings')
                ->action('save')
                ->color('primary'),
        ];
    }
}
