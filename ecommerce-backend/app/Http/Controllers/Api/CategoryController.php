<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->where('status', 'active')
            ->withCount(['products' => fn ($q) => $q->where('status', 'active')])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => CategoryResource::collection($categories),
        ]);
    }

    public function products(Request $request, string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)->where('status', 'active')->firstOrFail();

        $products = Product::query()
            ->where('category_id', $category->id)
            ->where('status', 'active')
            ->with(['images', 'category'])
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data'   => ProductResource::collection($products),
            'meta'   => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
            ],
        ]);
    }
}
