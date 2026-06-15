<?php

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
    return view('admin');
})->where('any', '.*')->name('admin');

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|admin).*$')->name('landing');


