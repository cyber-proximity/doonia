<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->where('status', 'active')->firstOrFail();

        $reviews = $product->reviews()
            ->where('is_approved', true)
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        // Rating distribution: count per star value
        $distributionRaw = $product->reviews()
            ->where('is_approved', true)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating');

        $distribution = [];
        for ($i = 1; $i <= 5; $i++) {
            $distribution[$i] = (int) ($distributionRaw[$i] ?? 0);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $reviews->map(fn ($r) => [
                'id'         => $r->id,
                'rating'     => $r->rating,
                'title'      => $r->title,
                'body'       => $r->body,
                'user'       => ['id' => $r->user->id, 'name' => $r->user->name],
                'created_at' => $r->created_at,
            ]),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
            'summary' => [
                'avg_rating'   => $product->reviews()->where('is_approved', true)->avg('rating')
                    ? round((float) $product->reviews()->where('is_approved', true)->avg('rating'), 1)
                    : null,
                'total'        => $reviews->total(),
                'distribution' => $distribution,
            ],
        ]);
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->where('status', 'active')->firstOrFail();

        $validated = $request->validate([
            'rating' => 'required|integer|between:1,5',
            'title'  => 'nullable|string|max:255',
            'body'   => 'nullable|string|max:2000',
        ]);

        if ($product->reviews()->where('user_id', auth()->id())->exists()) {
            return response()->json(['message' => 'You have already reviewed this product.'], 422);
        }

        $review = $product->reviews()->create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        $review->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'         => $review->id,
                'rating'     => $review->rating,
                'title'      => $review->title,
                'body'       => $review->body,
                'user'       => ['id' => $review->user->id, 'name' => $review->user->name],
                'created_at' => $review->created_at,
            ],
        ], 201);
    }
}
