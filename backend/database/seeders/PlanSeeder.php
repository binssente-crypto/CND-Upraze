<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            // Tier 1 — Prebuilt / Template Systems
            [
                'name' => 'Package 1A',
                'slug' => 'package-1a',
                'price' => 3500.00,
                'features' => [
                    'tier' => 'prebuilt',
                    'feature_count' => 1,
                    'custom_branding' => false,
                    'customization' => false,
                    'domain_hosting' => true,
                    'maintenance' => true,
                ],
            ],
            [
                'name' => 'Package 1B',
                'slug' => 'package-1b',
                'price' => 6500.00,
                'features' => [
                    'tier' => 'prebuilt',
                    'feature_count' => '2-3',
                    'custom_branding' => false,
                    'customization' => false,
                    'domain_hosting' => true,
                    'maintenance' => true,
                ],
            ],
            [
                'name' => 'Package 1C',
                'slug' => 'package-1c',
                'price' => 12000.00,
                'features' => [
                    'tier' => 'prebuilt',
                    'feature_count' => '4-5',
                    'custom_branding' => false,
                    'customization' => false,
                    'domain_hosting' => true,
                    'maintenance' => true,
                ],
            ],
            // Tier 2 — Custom Systems with Full Branding
            [
                'name' => 'Package 2A',
                'slug' => 'package-2a',
                'price' => 22000.00,
                'features' => [
                    'tier' => 'custom',
                    'feature_count' => '2-3',
                    'custom_branding' => true,
                    'customization' => true,
                    'domain_hosting' => true,
                    'maintenance' => true,
                ],
            ],
            [
                'name' => 'Package 2B',
                'slug' => 'package-2b',
                'price' => 40000.00,
                'features' => [
                    'tier' => 'custom',
                    'feature_count' => '4-5',
                    'custom_branding' => true,
                    'customization' => true,
                    'domain_hosting' => true,
                    'maintenance' => true,
                ],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
