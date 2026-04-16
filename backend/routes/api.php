<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Features\AIAssistantController;
use App\Http\Controllers\Features\ForecastingController;
use App\Http\Controllers\Features\ImageRecognitionController;
use App\Http\Controllers\Features\ThreeDManipulationController;
use App\Http\Controllers\Features\QRCodeController;
use Illuminate\Support\Facades\Route;

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Features
    Route::prefix('features')->group(function () {
        Route::apiResource('ai-assistant', AIAssistantController::class);
        Route::apiResource('forecasting', ForecastingController::class);
        Route::apiResource('image-recognition', ImageRecognitionController::class);
        Route::apiResource('3d-manipulation', ThreeDManipulationController::class);
        Route::apiResource('qr-codes', QRCodeController::class);
    });
});

Route::get('/q/{code}', [QRCodeController::class, 'show']);
