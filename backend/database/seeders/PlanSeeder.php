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
                'name' => 'Starter Package',
                'slug' => 'starter-package',
                'price' => 3500.00,
                'features' => [
                    '1 core feature of choice',
                    'Basic setup and support',
                    'Cloud-based access',
                    '5 accounts + 1 admin account',
                    '3 months free maintenance',
                    'Domain and Hosting'
                ],
            ],
            [
                'name' => 'Pro Package',
                'slug' => 'pro-package',
                'price' => 10500.00,
                'features' => [
                    'Up to 3 features of choice',
                    'Priority support',
                    'System customization',
                    'Analytics dashboard',
                    '25 accounts + 5 admin accounts',
                    '6 months free maintenance',
                    'Custom Domain and Hosting'
                ],
            ],
            [
                'name' => 'Enterprise Package',
                'slug' => 'enterprise-package',
                'price' => 18000.00,
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
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
