<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        try {
            $baseUrl = config('app.url', 'https://www.tafaria.com');
            $apiBaseUrl = 'https://website-cms.tafaria.com/api';

            $httpClient = Http::withOptions(['verify' => false]);

            $categoriesResponse = $httpClient->get("{$apiBaseUrl}/categories");
            $categories = $categoriesResponse->json() ?? [];

            $imagesResponse = $httpClient->get("{$apiBaseUrl}/images");
            $images = $imagesResponse->json() ?? [];

            $entries = [
                [
                    'url' => $baseUrl,
                    'lastmod' => now()->toAtomString(),
                    'changefreq' => 'daily',
                    'priority' => '1.0',
                    'images' => [],
                    'videos' => [],
                ]
            ];

            foreach ($categories as $category) {
                $entries[] = [
                    'url' => "{$baseUrl}/{$category['slug']}",
                    'lastmod' => now()->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.8',
                    'images' => isset($category['image_path']) ? [$category['image_path']] : [],
                    'videos' => [],
                ];

                foreach ($category['posts'] ?? [] as $post) {
                    $postImages = $this->extractImageUrlsFromHtml($post['content'] ?? '');
                    $postImages = array_values(array_filter($postImages));

                    $entries[] = [
                        'url' => "{$baseUrl}/{$category['slug']}/{$post['slug']}",
                        'lastmod' => isset($post['updated_at']) ? date('c', strtotime($post['updated_at'])) : date('c', strtotime($post['created_at'])),
                        'changefreq' => 'weekly',
                        'priority' => '0.6',
                        'images' => $postImages,
                        'videos' => [],
                    ];
                }
            }

            foreach ($images as $image) {
                $entries[] = [
                    'url' => "{$baseUrl}/image?id={$image['id']}",
                    'lastmod' => date('c', strtotime($image['updated_at'])),
                    'changefreq' => 'weekly',
                    'priority' => '0.5',
                    'images' => isset($image['image_path']) ? [$image['image_path']] : [],
                    'videos' => [],
                ];
            }

            return response()->view('sitemap', [
                'entries' => $entries,
                'baseUrl' => $baseUrl,
            ])->header('Content-Type', 'text/xml');

        } catch (\Exception $e) {
            \Log::error('Sitemap generation error: ' . $e->getMessage());
            return response('Error generating sitemap', 500);
        }
    }

    private function extractImageUrlsFromHtml($htmlContent)
    {
        if (!$htmlContent || trim($htmlContent) === '') {
            return [];
        }

        try {
            preg_match_all('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $htmlContent, $matches);

            if (!empty($matches[1])) {
                return array_unique($matches[1]);
            }

            $dom = new \DOMDocument();
            libxml_use_internal_errors(true);

            $dom->loadHTML(mb_convert_encoding($htmlContent, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR | LIBXML_NOWARNING);
            libxml_clear_errors();

            $images = $dom->getElementsByTagName('img');
            $imageUrls = [];

            foreach ($images as $img) {
                if ($img instanceof \DOMElement) {
                    $src = $img->getAttribute('src');
                    if ($src) {
                        $imageUrls[] = $src;
                    }
                }
            }

            return array_unique($imageUrls);

        } catch (\Exception $e) {
            \Log::warning('Image extraction failed: ' . $e->getMessage());
            return [];
        }
    }
}