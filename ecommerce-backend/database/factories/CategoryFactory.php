<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Category> */
class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Electronics', 'Fashion', 'Home & Living', 'Beauty & Health',
            'Sports & Fitness', 'Kids & Baby', 'Food & Drinks', 'Books & Stationery',
            'Automotive', 'Phones & Tablets',
        ]);

        return [
            'name'        => $name,
            'slug'        => Str::slug($name),
            'description' => fake()->sentence(),
            'image'       => null,
            'status'      => 'active',
            'sort_order'  => fake()->numberBetween(0, 10),
        ];
    }
}
