<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    public function currencies(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data'   => [
                'ghs_to_usd' => (float) (Setting::get('ghs_to_usd') ?? 0.063),
                'ghs_to_ngn' => (float) (Setting::get('ghs_to_ngn') ?? 15.38),
                'ghs_to_cny' => (float) (Setting::get('ghs_to_cny') ?? 0.45),
            ],
        ]);
    }
}
