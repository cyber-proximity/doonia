<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Wishlist::where('user_id', $request->user()->id)
            ->with('product.images')
            ->get()
            ->filter(fn ($w) => $w->product !== null)
            ->map(fn ($w) => $this->formatProduct($w->product))
            ->values();

        return response()->json(['status' => 'success', 'data' => $items]);
    }

    public function add(Request $request, int $productId): JsonResponse
    {
        Product::findOrFail($productId);

        Wishlist::firstOrCreate([
            'user_id'    => $request->user()->id,
            'product_id' => $productId,
        ]);

        return response()->json(['status' => 'success'], 201);
    }

    public function remove(Request $request, int $productId): JsonResponse
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['status' => 'success']);
    }

    public function sync(Request $request): JsonResponse
    {
        $request->validate([
            'product_ids'   => ['array'],
            'product_ids.*' => ['integer'],
        ]);

        $productIds = collect($request->input('product_ids', []))->unique();
        $existing   = Product::whereIn('id', $productIds)->pluck('id');

        foreach ($existing as $productId) {
            Wishlist::firstOrCreate([
                'user_id'    => $request->user()->id,
                'product_id' => $productId,
            ]);
        }

        $items = Wishlist::where('user_id', $request->user()->id)
            ->with('product.images')
            ->get()
            ->filter(fn ($w) => $w->product !== null)
            ->map(fn ($w) => $this->formatProduct($w->product))
            ->values();

        return response()->json(['status' => 'success', 'data' => $items]);
    }

    private function formatProduct(Product $product): array
    {
        $image = $product->images->where('is_primary', true)->first() ?? $product->images->first();
        $url   = $image?->url;
        if ($url && !str_starts_with($url, 'http')) {
            $url = Storage::disk('public')->url($url);
        }

        return [
            'id'             => $product->id,
            'name'           => $product->name,
            'slug'           => $product->slug,
            'price'          => (float) $product->price,
            'compareAtPrice' => $product->compare_at_price ? (float) $product->compare_at_price : null,
            'imageUrl'       => $url,
        ];
    }
}
