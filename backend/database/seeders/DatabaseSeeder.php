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
        ]);

        User::factory()->create([
            'name' => 'CND Upraze Admin',
            'nickname' => 'Admin',
            'email' => env('ADMIN_EMAIL', 'cnd.upraze@gmail.com'),
            'password' => bcrypt(env('ADMIN_PASSWORD', 'password')),
            'role' => 'admin',
        ]);
    }
}
