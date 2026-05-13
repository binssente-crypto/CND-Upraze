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
                'name' => 'Package A',
                'price' => 3500,
                'features' => [
                    'Best for small startups and basic operations',
                    '1 core feature of choice',
                    'Basic setup and support',
                    'Cloud-based access',
                    'Options: QR Implementation, Basic Forecasting, AI Chatbot, 3D Viewer'
                ],
                'type' => 'Starter'
            ],
            [
                'name' => 'Package B',
                'price' => 10500,
                'features' => [
                    'Designed for growing businesses needing advanced operational tools',
                    'Up to 3 features of choice',
                    'Priority support',
                    'System customization',
                    'Analytics dashboard',
                    'Options: AI Chatbot/Report, AI-Assisted Forecasting, QR Ordering, Image Recognition, 3D Viewer'
                ],
                'type' => 'Pro'
            ],
            [
                'name' => 'Package C',
                'price' => 18000,
                'features' => [
                    'For large establishments requiring highly customized systems',
                    'Up to 5 integrated features',
                    'Advanced customization',
                    'Dedicated technical support',
                    'Scalable cloud infrastructure',
                    'Options: AI Chatbot/Report, Adv. Forecasting, QR Access, Image Recognition, 3D Customization'
                ],
                'type' => 'Enterprise'
            ]
        ];

        foreach ($offers as $offer) {
            \App\Models\Offer::create($offer);
        }
    }
}
