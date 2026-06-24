<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Electronics',
                'slug'        => 'electronics',
                'description' => 'Phones, laptops, accessories and more.',
                'image'       => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Fashion',
                'slug'        => 'fashion',
                'description' => 'Clothing, shoes and accessories for everyone.',
                'image'       => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Home & Living',
                'slug'        => 'home-living',
                'description' => 'Furniture, kitchenware and home décor.',
                'image'       => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Beauty & Health',
                'slug'        => 'beauty-health',
                'description' => 'Skincare, haircare and wellness products.',
                'image'       => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Sports & Fitness',
                'slug'        => 'sports-fitness',
                'description' => 'Equipment and apparel for an active lifestyle.',
                'image'       => 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop',
                'sort_order'  => 5,
            ],
        ];

        foreach ($categories as $data) {
            Category::firstOrCreate(['slug' => $data['slug']], array_merge($data, ['status' => 'active']));
        }
    }
}
