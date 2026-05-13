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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('offer_id')->nullable()->constrained()->onDelete('set null'); // The plan/package
            $table->string('plan_name')->nullable(); // In case offer is deleted or just keeping record
            $table->string('company_name')->nullable();
            $table->string('company_logo')->nullable();
            $table->text('short_description')->nullable();
            $table->text('design_preference')->nullable();
            $table->text('feature_options')->nullable();
            $table->string('status')->default('pending'); // pending, processing, completed, cancelled
            
            // Xendit payment fields
            $table->string('xendit_invoice_id')->nullable();
            $table->string('payment_url')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
