<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');

        $products = [
            // Electronics
            ['cat' => 'electronics', 'name' => 'Wireless Bluetooth Headphones', 'price' => 279,  'compare' => 389,  'featured' => true,  'stock' => 45, 'img' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
            ['cat' => 'electronics', 'name' => '4K Action Camera',              'price' => 489,  'compare' => 589,  'featured' => true,  'stock' => 18, 'img' => 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop'],
            ['cat' => 'electronics', 'name' => 'Portable Power Bank 20000mAh',  'price' => 129,  'compare' => null, 'featured' => false, 'stock' => 60, 'img' => 'https://images.unsplash.com/photo-1609592806645-4d3e5e8a8b1e?w=600&h=600&fit=crop'],
            ['cat' => 'electronics', 'name' => 'Smart LED Desk Lamp',           'price' => 89,   'compare' => 119,  'featured' => false, 'stock' => 32, 'img' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop'],
            // Fashion
            ['cat' => 'fashion', 'name' => "Men's Classic Kente Shirt",  'price' => 89,  'compare' => 129,  'featured' => true,  'stock' => 60, 'img' => 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&h=600&fit=crop'],
            ['cat' => 'fashion', 'name' => "Women's Ankara Print Dress", 'price' => 149, 'compare' => 199,  'featured' => false, 'stock' => 40, 'img' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'],
            ['cat' => 'fashion', 'name' => 'Running Sneakers Ultra',     'price' => 349, 'compare' => 459,  'featured' => true,  'stock' => 50, 'img' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
            ['cat' => 'fashion', 'name' => 'Leather Sandals Classic',    'price' => 119, 'compare' => null, 'featured' => false, 'stock' => 35, 'img' => 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&h=600&fit=crop'],
            // Home & Living
            ['cat' => 'home-living', 'name' => 'Smart Blender Pro 1.5L', 'price' => 199, 'compare' => null, 'featured' => true,  'stock' => 30, 'img' => 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop'],
            ['cat' => 'home-living', 'name' => 'Premium Coffee Table',   'price' => 569, 'compare' => null, 'featured' => true,  'stock' => 8,  'img' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop'],
            ['cat' => 'home-living', 'name' => 'Non-Stick Cookware Set', 'price' => 249, 'compare' => 319,  'featured' => false, 'stock' => 22, 'img' => 'https://images.unsplash.com/photo-1584990347449-c5c24e8dde08?w=600&h=600&fit=crop'],
            ['cat' => 'home-living', 'name' => 'Decorative Wall Mirror', 'price' => 179, 'compare' => 229,  'featured' => false, 'stock' => 15, 'img' => 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop'],
            // Beauty & Health
            ['cat' => 'beauty-health', 'name' => 'Ladies Skincare Gift Set',   'price' => 229, 'compare' => 299,  'featured' => true,  'stock' => 25, 'img' => 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
            ['cat' => 'beauty-health', 'name' => 'Vitamin C Brightening Serum','price' => 89,  'compare' => null, 'featured' => false, 'stock' => 48, 'img' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'],
            ['cat' => 'beauty-health', 'name' => 'Natural Shea Body Butter',   'price' => 49,  'compare' => 65,   'featured' => false, 'stock' => 70, 'img' => 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop'],
            ['cat' => 'beauty-health', 'name' => 'SPF 50 Sunscreen Lotion',    'price' => 65,  'compare' => null, 'featured' => false, 'stock' => 55, 'img' => 'https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=600&h=600&fit=crop'],
            // Sports & Fitness
            ['cat' => 'sports-fitness', 'name' => 'Professional Yoga Mat',    'price' => 129, 'compare' => 169,  'featured' => false, 'stock' => 38, 'img' => 'https://images.unsplash.com/photo-1601925228184-21565476b34a?w=600&h=600&fit=crop'],
            ['cat' => 'sports-fitness', 'name' => 'Adjustable Dumbbells Set', 'price' => 299, 'compare' => null, 'featured' => false, 'stock' => 20, 'img' => 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop'],
            ['cat' => 'sports-fitness', 'name' => 'Sports Water Bottle 1L',   'price' => 39,  'compare' => 55,   'featured' => false, 'stock' => 90, 'img' => 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&h=600&fit=crop'],
            ['cat' => 'sports-fitness', 'name' => 'Resistance Bands Set',     'price' => 59,  'compare' => 79,   'featured' => true,  'stock' => 65, 'img' => 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=600&h=600&fit=crop'],
        ];

        foreach ($products as $index => $data) {
            $category = $categories->get($data['cat']);
            if (! $category) {
                continue;
            }

            $product = Product::firstOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id'         => $category->id,
                    'name'                => $data['name'],
                    'slug'                => Str::slug($data['name']),
                    'description'         => "Quality {$data['name']} available at Doonia. Fast delivery across Ghana.",
                    'price'               => $data['price'],
                    'compare_at_price'    => $data['compare'],
                    'sku'                 => strtoupper(substr($data['cat'], 0, 4)) . '-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                    'stock_quantity'      => $data['stock'],
                    'low_stock_threshold' => 10,
                    'status'              => 'active',
                    'featured'            => $data['featured'],
                ]
            );

            if ($product->wasRecentlyCreated) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url'        => $data['img'],
                    'alt_text'   => $data['name'],
                    'sort_order' => 0,
                    'is_primary' => true,
                ]);
            }
        }
    }
}
