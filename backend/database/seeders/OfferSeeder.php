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
        \App\Models\Offer::truncate();

        $offers = [
            [
                'name' => 'Starter Package',
                'price' => 3500,
                'features' => [
                    '1 core feature of choice',
                    'Basic setup and support',
                    'Cloud-based access',
                    '5 accounts + 1 admin account',
                    '3 months free maintenance',
                    'Domain and Hosting'
                ],
                'type' => 'Starter'
            ],
            [
                'name' => 'Pro Package',
                'price' => 10500,
                'features' => [
                    'Up to 3 features of choice',
                    'Priority support',
                    'System customization',
                    'Analytics dashboard',
                    '25 accounts + 5 admin accounts',
                    '6 months free maintenance',
                    'Custom Domain and Hosting'
                ],
                'type' => 'Pro'
            ],
            [
                'name' => 'Enterprise Package',
                'price' => 18000,
                'features' => [
                    'Up to 5 integrated features',
                    'Advanced customization',
                    'Priority support',
                    'Dedicated technical support',
                    'Scalable cloud infrastructure',
                    'Unlimited accounts',
                    '1 year free maintenance',
                    'Custom Domain and Hosting'
                ],
                'type' => 'Enterprise'
            ]
        ];

        foreach ($offers as $offer) {
            \App\Models\Offer::create($offer);
        }
    }
}
