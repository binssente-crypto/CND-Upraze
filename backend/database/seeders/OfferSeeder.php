<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $offers = [
            [
                'name' => 'Package 1A',
                'price' => '3,500',
                'features' => json_encode(['1 Feature', 'Domain & Hosting', 'Maintenance']),
                'type' => 'Standard'
            ],
            [
                'name' => 'Package 1B',
                'price' => '6,500',
                'features' => json_encode(['2-3 Features', 'Domain & Hosting', 'Maintenance', 'Priority Support']),
                'type' => 'Popular'
            ],
            [
                'name' => 'Package 1C',
                'price' => '12,000',
                'features' => json_encode(['4-5 Features', 'Domain & Hosting', 'Maintenance', 'Priority Support', 'Extended SLA']),
                'type' => 'Standard'
            ],
            [
                'name' => 'Package 2A',
                'price' => '22,000',
                'features' => json_encode(['Full Customization', '2-3 Features', 'Full Branding Suite', 'Domain & Hosting', 'Maintenance']),
                'type' => 'Standard'
            ],
            [
                'name' => 'Package 2B',
                'price' => '40,000',
                'features' => json_encode(['Full Customization', '4-5 Features', 'Full Branding Suite', 'Image Recognition', 'Domain & Hosting', 'Dedicated Manager']),
                'type' => 'Premium'
            ],
        ];

        foreach ($offers as $offer) {
            \App\Models\Offer::create($offer);
        }
    }
}
