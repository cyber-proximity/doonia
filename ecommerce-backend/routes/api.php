<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/v1/health', fn () => response()->json(['status' => 'ok']));
Route::get('/v1/settings/currencies', [SettingsController::class, 'currencies']);

// Auth
Route::prefix('v1/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'updatePassword']);
    });
});

// Catalog — fixed routes must come before {slug} wildcard
Route::prefix('v1')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}/products', [CategoryController::class, 'products']);

    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/suggestions', [ProductController::class, 'suggestions']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/products/{slug}/reviews', [ReviewController::class, 'store']);
    });
});

// Orders & Payments
Route::prefix('v1')->group(function () {
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
    Route::get('/payments/verify/{reference}', [PaymentController::class, 'verify']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
    });
});

// Wishlist (all auth required)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/sync', [WishlistController::class, 'sync']); // must precede {productId}
    Route::post('/wishlist/{productId}', [WishlistController::class, 'add']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'remove']);
});

// Account (all auth required)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('/addresses', AddressController::class)->except(['show']);
});
