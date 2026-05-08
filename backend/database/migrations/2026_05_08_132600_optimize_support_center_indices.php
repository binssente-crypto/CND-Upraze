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
        Schema::table('support_messages', function (Blueprint $table) {
            $table->index('is_read');
            $table->index('sender_id');
        });

        Schema::table('support_threads', function (Blueprint $table) {
            $table->index('assigned_admin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('support_threads', function (Blueprint $table) {
            $table->dropIndex(['assigned_admin_id']);
        });

        Schema::table('support_messages', function (Blueprint $table) {
            $table->dropIndex(['sender_id']);
            $table->dropIndex(['is_read']);
        });
    }
};
