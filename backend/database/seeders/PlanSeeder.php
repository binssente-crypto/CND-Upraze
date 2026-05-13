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
                'name' => 'Package A',
                'slug' => 'package-a',
                'price' => 3500.00,
                'features' => [
                    'Best for small startups and basic operations',
                    '1 core feature of choice',
                    'Basic setup and support',
                    'Cloud-based access',
                    'Options: QR Implementation, Basic Forecasting, AI Chatbot, 3D Viewer'
                ],
            ],
            [
                'name' => 'Package B',
                'slug' => 'package-b',
                'price' => 10500.00,
                'features' => [
                    'Designed for growing businesses needing advanced operational tools',
                    'Up to 3 features of choice',
                    'Priority support',
                    'System customization',
                    'Analytics dashboard',
                    'Options: AI Chatbot/Report, AI-Assisted Forecasting, QR Ordering, Image Recognition, 3D Viewer'
                ],
            ],
            [
                'name' => 'Package C',
                'slug' => 'package-c',
                'price' => 18000.00,
                'features' => [
                    'For large establishments requiring highly customized systems',
                    'Up to 5 integrated features',
                    'Advanced customization',
                    'Dedicated technical support',
                    'Scalable cloud infrastructure',
                    'Options: AI Chatbot/Report, Adv. Forecasting, QR Access, Image Recognition, 3D Customization'
                ],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
