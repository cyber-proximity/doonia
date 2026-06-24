<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Product> */
class ProductFactory extends Factory
{
    private static int $skuCounter = 1;

    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Wireless Bluetooth Headphones', 'Smart Android TV 43"', 'iPhone 15 Pro Case',
            'Portable Power Bank 20000mAh', 'Men\'s Kente Print Shirt', 'Women\'s Ankara Dress',
            'Leather Sandals', 'Running Sneakers', 'Facial Serum Set', 'Moisturising Body Lotion',
            'Non-Stick Frying Pan', 'Rice Cooker 1.8L', 'Yoga Mat', 'Dumbbells 5kg Pair',
            'Baby Diaper Pack Size 3', 'Kids Learning Tablet', 'Premium Coffee Table',
            'Smart LED Bulb', 'Sunscreen SPF50', 'Men\'s Formal Shoes',
        ]);

        $price = fake()->randomFloat(2, 15, 600);

        return [
            'category_id'         => Category::inRandomOrder()->value('id') ?? 1,
            'name'                => $name,
            'slug'                => Str::slug($name) . '-' . self::$skuCounter,
            'description'         => fake()->paragraphs(2, true),
            'price'               => $price,
            'compare_at_price'    => fake()->boolean(50) ? round($price * fake()->randomFloat(2, 1.1, 1.5), 2) : null,
            'sku'                 => strtoupper(fake()->bothify('??##-###')) . '-' . self::$skuCounter++,
            'stock_quantity'      => fake()->numberBetween(0, 150),
            'low_stock_threshold' => 10,
            'status'              => 'active',
            'featured'            => fake()->boolean(25),
        ];
    }
}
