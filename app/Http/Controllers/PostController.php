<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function show($categorySlug, $postSlug)
    {
        $httpClient = Http::withOptions([
            'verify' => false,
        ]);
        $categoriesResponse = $httpClient->get('https://website-cms.tafaria.com/api/categories');

        if (!$categoriesResponse->successful()) {
            abort(404, 'Categories not found');
        }

        $categories = $categoriesResponse->json();
        $category = collect($categories)->firstWhere('slug', $categorySlug);

        if (!$category) {
            abort(404);
        }

        $postResponse = $httpClient->get("https://website-cms.tafaria.com/api/posts/{$postSlug}");

        if (!$postResponse->successful()) {
            abort(404, 'Post not found');
        }

        $post = $postResponse->json();

        $initialData = [
            'post' => $post,
            'categorySlug' => $categorySlug,
            'postSlug' => $postSlug
        ];

        return view('post', $initialData);
    }
}