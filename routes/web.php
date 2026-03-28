<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
Route::get('/', [HomeController::class, 'index']);
Route::get('/our-story', [HomeController::class, 'index']);
Route::get('/rates', function () {
    return Inertia::render(component: 'Rates');
})->name('rates');
Route::get('/qr-code-generator', function () {
    return Inertia::render(component: 'CustomQRGenerator');
})->name('CustomQRGenerator');
Route::get('/image', [ImageController::class, 'show'])->name('image.show');
Route::get('/robots.txt', [RobotsController::class, 'index']);
Route::get('/sitemap.xml', [SitemapController::class, 'index']);

Route::get('/videos', function () {
    return Inertia::render(component: 'videos');
})->name('videos');
Route::get('/restaurant-menu', function () {
    return Inertia::render(component: 'restaurant-menu');
})->name('restaurant-menu');

Route::get('/appc/filesview/{id}', function ($id) {
    return Inertia::render('Narrations', [
        'id' => $id,
    ]);
})->name('Narrations');
Route::get('/videos/{id}', function ($id) {
    return Inertia::render('VideoDisplay', [
        'id' => $id,
    ]);
})->name('videos');

Route::get('/{slug}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/{categorySlug}/{postSlug}', [CategoryController::class, 'showPost'])->name('post.show');

