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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->decimal('price', 10, 2);
            $table->string('billing_interval', 20)->default('month');
            $table->jsonb('features')->default(json_encode([]));
            $table->string('stripe_price_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('plans');
            $table->string('stripe_id')->unique()->nullable();
            $table->string('stripe_status', 50)->nullable();
            $table->string('paymongo_id')->unique()->nullable();
            $table->integer('quantity')->default(1);
            $table->timestampTz('trial_ends_at')->nullable();
            $table->timestampTz('ends_at')->nullable();
            $table->timestampsTz();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('stripe_invoice_id')->unique()->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('PHP');
            $table->string('status', 50);
            $table->string('pdf_url', 500)->nullable();
            $table->string('billing_reason', 100)->nullable();
            $table->timestampTz('period_start')->nullable();
            $table->timestampTz('period_end')->nullable();
            $table->timestampsTz();
        });

        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title')->nullable();
            $table->jsonb('messages')->default(json_encode([]));
            $table->string('model_used', 100)->nullable();
            $table->integer('token_used')->default(0);
            $table->timestampsTz();
            
            $table->index('messages', 'idx_ai_conversations_messages', 'gin');
        });

        Schema::create('forecasting_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('file_path', 500);
            $table->string('status', 50)->default('pending')->index();
            $table->jsonb('result_json')->nullable();
            $table->text('error_msg')->nullable();
            $table->timestampsTz();
        });

        Schema::create('models_3d', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('file_path', 500);
            $table->string('file_type', 20)->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->timestampsTz();
        });

        Schema::create('image_recognition_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('image_path', 500);
            $table->string('provider', 50)->nullable();
            $table->jsonb('result_json')->nullable();
            $table->string('status', 50)->default('pending');
            $table->timestampsTz();
            
            $table->index('result_json', 'idx_image_recognition_result', 'gin');
        });

        Schema::create('qr_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('payload');
            $table->string('code', 64)->unique();
            $table->integer('scan_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestampTz('expires_at')->nullable();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_codes');
        Schema::dropIfExists('image_recognition_jobs');
        Schema::dropIfExists('models_3d');
        Schema::dropIfExists('forecasting_jobs');
        Schema::dropIfExists('ai_conversations');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('plans');
    }
};
