<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'price' => 499.00,
                'features' => ['ai_assistant', 'qr_code'],
            ],
            [
                'name' => 'Growth',
                'slug' => 'growth',
                'price' => 999.00,
                'features' => ['ai_assistant', 'qr_code', 'forecasting', 'image_recognition'],
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'price' => 2499.00,
                'features' => ['ai_assistant', 'qr_code', 'forecasting', 'image_recognition', '3d_manipulation'],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
