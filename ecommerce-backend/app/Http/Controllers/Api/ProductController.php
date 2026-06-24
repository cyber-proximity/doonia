<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->where('status', 'active')
            ->with(['images', 'category'])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)]);

        $sortApplied = false;

        if ($search = trim((string) $request->query('search', ''))) {
            if (mb_strlen($search) >= 3) {
                $boolean = $this->toBooleanSearch($search);
                $query->whereRaw('MATCH(name, description) AGAINST(? IN BOOLEAN MODE)', [$boolean]);

                // Default sort: relevance. Explicit sorts (price, discount) override this.
                if (! $request->query('sort') || $request->query('sort') === 'newest') {
                    $query->orderByRaw(
                        'MATCH(name, description) AGAINST(? IN BOOLEAN MODE) DESC',
                        [$boolean]
                    );
                    $sortApplied = true;
                }
            } else {
                $query->where(fn ($q) => $q
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                );
            }
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($min = $request->query('min_price')) {
            $query->where('price', '>=', (float) $min);
        }

        if ($max = $request->query('max_price')) {
            $query->where('price', '<=', (float) $max);
        }

        // on_sale=1 → only products with an active discount
        if ($request->query('on_sale')) {
            $query->whereNotNull('compare_at_price')
                  ->whereColumn('compare_at_price', '>', 'price');
        }

        if (! $sortApplied) {
            match ($request->query('sort')) {
                'price_asc'  => $query->orderBy('price'),
                'price_desc' => $query->orderByDesc('price'),
                // Sort by discount % descending: (compare_at_price - price) / compare_at_price
                'discount'   => $query->whereNotNull('compare_at_price')
                                      ->orderByRaw('(compare_at_price - price) / compare_at_price DESC'),
                default      => $query->latest(),
            };
        }

        $products = $query->paginate(20);

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

    public function featured(): JsonResponse
    {
        $products = Cache::remember('products.featured', 300, function () {
            return Product::query()
                ->where('status', 'active')
                ->where('featured', true)
                ->with(['images', 'category'])
                ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
                ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
                ->latest()
                ->limit(8)
                ->get();
        });

        return response()->json([
            'status' => 'success',
            'data'   => ProductResource::collection($products),
        ]);
    }

    public function suggestions(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['status' => 'success', 'data' => ['products' => [], 'categories' => []]]);
        }

        $cacheKey = 'suggestions.v2.' . md5(strtolower($q));

        $results = Cache::remember($cacheKey, 60, function () use ($q) {
            $products = Product::query()
                ->where('status', 'active')
                ->where(fn ($query) => $query
                    ->where('name', 'like', "{$q}%")
                    ->orWhere('name', 'like', "% {$q}%")
                    ->orWhere('name', 'like', "%{$q}%")
                )
                ->select(['id', 'name', 'slug', 'price'])
                ->with(['images' => fn ($query) => $query
                    ->where('is_primary', true)
                    ->select(['id', 'product_id', 'url'])
                ])
                ->orderByRaw('CASE WHEN name LIKE ? THEN 0 ELSE 1 END', ["{$q}%"])
                ->orderBy('name')
                ->limit(5)
                ->get()
                ->map(fn ($p) => [
                    'id'    => $p->id,
                    'name'  => $p->name,
                    'slug'  => $p->slug,
                    'price' => (float) $p->price,
                    'image' => $p->images->first()?->url,
                ])
                ->values();

            $categories = \App\Models\Category::query()
                ->where('status', 'active')
                ->where('name', 'like', "%{$q}%")
                ->select(['id', 'name', 'slug'])
                ->orderByRaw('CASE WHEN name LIKE ? THEN 0 ELSE 1 END', ["{$q}%"])
                ->limit(3)
                ->get()
                ->map(fn ($c) => [
                    'id'   => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                ])
                ->values();

            return ['products' => $products, 'categories' => $categories];
        });

        return response()->json(['status' => 'success', 'data' => $results]);
    }

    public function search(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        $sortApplied = false;

        $query = Product::query()
            ->where('status', 'active')
            ->with(['images', 'category'])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)]);

        if ($q !== '') {
            if (mb_strlen($q) >= 3) {
                $boolean = $this->toBooleanSearch($q);
                $query->whereRaw('MATCH(name, description) AGAINST(? IN BOOLEAN MODE)', [$boolean]);
                $query->orderByRaw(
                    'MATCH(name, description) AGAINST(? IN BOOLEAN MODE) DESC',
                    [$boolean]
                );
                $sortApplied = true;
            } else {
                $query->where(fn ($query) => $query
                    ->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%")
                );
            }
        }

        if (! $sortApplied) {
            $query->latest();
        }

        $products = $query->paginate(20);

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

    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('status', 'active')
            ->with(['images', 'category'])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
            ->firstOrFail();

        $related = Product::query()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->with(['images', 'category'])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
            ->limit(4)
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => array_merge(
                (new ProductResource($product))->toArray(request()),
                ['related' => ProductResource::collection($related)]
            ),
        ]);
    }

    /**
     * Convert a plain search string to MySQL FULLTEXT Boolean Mode syntax.
     * "samsung galaxy" → "+samsung* +galaxy*"
     */
    private function toBooleanSearch(string $query): string
    {
        // Strip MySQL boolean operators to prevent injection
        $safe  = preg_replace('/[+\-><()\~*"@]+/', ' ', $query);
        $terms = array_filter(array_map('trim', explode(' ', $safe)));

        return implode(' ', array_map(fn ($term) => '+' . $term . '*', $terms));
    }
}
