<?php

use Illuminate\Support\Facades\Route;

Route::get('/admin/{any?}', function () {
    return view('admin');
})->where('any', '.*')->name('admin');

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|admin).*$')->name('landing');
