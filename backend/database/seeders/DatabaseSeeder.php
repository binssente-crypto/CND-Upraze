<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlanSeeder::class,
            OfferSeeder::class,
        ]);

        // Create Superadmin
        User::factory()->create([
            'name' => 'CND Upraze Superadmin',
            'nickname' => 'Superadmin',
            'email' => env('ADMIN_EMAIL', 'admin@example.com'),
            'password' => bcrypt(env('ADMIN_PASSWORD', 'changeme')),
            'role' => 'superadmin',
        ]);

        // Create Admin
        User::factory()->create([
            'name' => 'CND Upraze Admin',
            'nickname' => 'Admin',
            'email' => env('STAFF_EMAIL', 'staff@example.com'),
            'password' => bcrypt(env('STAFF_PASSWORD', 'changeme')),
            'role' => 'admin',
        ]);

        // Create Regular User
        User::factory()->create([
            'name' => 'Test User',
            'nickname' => 'Tester',
            'email' => env('USER_EMAIL', 'user@example.com'),
            'password' => bcrypt(env('USER_PASSWORD', 'changeme')),
            'role' => 'user',
        ]);
    }
}
