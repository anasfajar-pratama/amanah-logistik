<?php

use App\Http\Controllers\Admin\AboutUsController;
use App\Http\Controllers\Admin\AdvantageController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\HomepageController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Api\PublicController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/site-data', [PublicController::class, 'siteData']);
Route::get('/galleries', [PublicController::class, 'galleries']);
Route::post('/contact', [PublicController::class, 'submitContact']);

// Admin auth (no auth required)
Route::post('/admin/login', [AuthController::class, 'login']);

// Admin protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/user', [AuthController::class, 'user']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    // Settings
    Route::get('/admin/settings', [SettingController::class, 'index']);
    Route::post('/admin/settings', [SettingController::class, 'update']);

    // Homepage
    Route::get('/admin/homepage', [HomepageController::class, 'show']);
    Route::post('/admin/homepage', [HomepageController::class, 'update']);

    // Services
    Route::get('/admin/services', [ServiceController::class, 'index']);
    Route::post('/admin/services', [ServiceController::class, 'store']);
    Route::post('/admin/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/admin/services/{service}', [ServiceController::class, 'destroy']);

    // About Us
    Route::get('/admin/about', [AboutUsController::class, 'show']);
    Route::post('/admin/about', [AboutUsController::class, 'update']);

    // Advantages
    Route::get('/admin/advantages', [AdvantageController::class, 'index']);
    Route::post('/admin/advantages', [AdvantageController::class, 'store']);
    Route::put('/admin/advantages/{advantage}', [AdvantageController::class, 'update']);
    Route::delete('/admin/advantages/{advantage}', [AdvantageController::class, 'destroy']);

    // Contact Info
    Route::get('/admin/contact', [ContactController::class, 'show']);
    Route::post('/admin/contact', [ContactController::class, 'update']);

    // Gallery
    Route::get('/admin/galleries', [GalleryController::class, 'index']);
    Route::post('/admin/galleries', [GalleryController::class, 'store']);
    Route::post('/admin/galleries/{gallery}', [GalleryController::class, 'update']);
    Route::delete('/admin/galleries/{gallery}', [GalleryController::class, 'destroy']);

    // Contact Submissions
    Route::get('/admin/submissions', [ContactController::class, 'submissions']);
    Route::put('/admin/submissions/{submission}/read', [ContactController::class, 'markRead']);
    Route::delete('/admin/submissions/{submission}', [ContactController::class, 'destroySubmission']);
});
