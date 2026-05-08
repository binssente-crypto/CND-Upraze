<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        \App\Models\User::where('email', env('ADMIN_EMAIL', 'cnd.upraze@gmail.com'))
            ->update(['role' => 'superadmin']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \App\Models\User::where('email', env('ADMIN_EMAIL', 'cnd.upraze@gmail.com'))
            ->update(['role' => 'admin']);
    }
};
