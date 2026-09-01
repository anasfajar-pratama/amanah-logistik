<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Route;

Route::get('/storage/{path}', function (string $path) {
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    $mime = mime_content_type($filePath);
    return response()->file($filePath, ['Content-Type' => $mime]);
})->where('path', '.*');

Route::get('/admin/{any?}', function () {
    return view('admin', ['settings' => Setting::all()->pluck('value', 'key')]);
})->where('any', '.*')->name('admin');

Route::get('/{any?}', function () {
    return view('app', ['settings' => Setting::all()->pluck('value', 'key')]);
})->where('any', '^(?!api|admin).*$')->name('landing');


