<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@doonia.test'],
            [
                'name'     => 'Doonia Admin',
                'email'    => 'admin@doonia.test',
                'password' => Hash::make('Admin@1234'),
                'phone'    => '+233 20 000 0000',
            ]
        );
    }
}
