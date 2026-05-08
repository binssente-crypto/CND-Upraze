<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Features\AIAssistantController;
use App\Http\Controllers\Features\ForecastingController;
use App\Http\Controllers\Features\ImageRecognitionController;
use App\Http\Controllers\Features\ThreeDManipulationController;
use App\Http\Controllers\Features\QRCodeController;
use App\Http\Controllers\SupportThreadController;
use App\Http\Controllers\SupportMessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

// Public Routes
Route::post('/public/ai-chat', [\App\Http\Controllers\PublicAIChatbotController::class, 'chat']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/set-nickname', [AuthController::class, 'setNickname']);
    
    // Profile Management
    Route::prefix('profile')->group(function () {
        Route::post('/update-nickname', [ProfileController::class, 'updateNickname']);
        Route::post('/change-password', [ProfileController::class, 'changePassword']);
    });

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/overview', [AdminController::class, 'getOverview']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole']);
        Route::patch('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
        Route::apiResource('offers', \App\Http\Controllers\OfferController::class);
    });

    // Public Offers (Read-only)
    Route::get('/offers', [\App\Http\Controllers\OfferController::class, 'index']);

    // Support Chat System
    Route::prefix('support')->group(function () {
        Route::get('/threads', [SupportThreadController::class, 'index']);
        Route::post('/threads', [SupportThreadController::class, 'store']);
        Route::get('/threads/{thread}', [SupportThreadController::class, 'show']);
        Route::post('/threads/{thread}/messages', [SupportMessageController::class, 'store']);
        Route::patch('/threads/{thread}/messages/read', [SupportMessageController::class, 'markRead']);
        Route::patch('/threads/{thread}/close', [SupportThreadController::class, 'close']);
        Route::patch('/threads/{thread}/assign', [SupportThreadController::class, 'assign']);
    });

    // Features (demo-only, index endpoints)
    Route::prefix('features')->group(function () {
        Route::apiResource('ai-assistant', AIAssistantController::class);
        Route::get('forecasting', [ForecastingController::class, 'index']);
        Route::get('image-recognition', [ImageRecognitionController::class, 'index']);
        Route::get('3d-manipulation', [ThreeDManipulationController::class, 'index']);
        Route::get('qr-codes', [QRCodeController::class, 'index']);
    });
});

// QR Code scan redirect (public)
Route::get('/q/{code}', [QRCodeController::class, 'show']);
