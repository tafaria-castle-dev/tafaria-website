<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function show($slug)
    {
        $httpClient = Http::withOptions([
            'verify' => false,
        ]);
        $categoriesResponse = $httpClient->get('https://website-cms.tafaria.com/api/categories');
        $categories = $categoriesResponse->json();
        $schoolProgramsResponse = $httpClient->get('https://website-cms.tafaria.com/api/school-programs');
        $schoolPrograms = $schoolProgramsResponse->json()['data'] ?? [];
        $packagesResponse = $httpClient->get('https://website-cms.tafaria.com/api/packages');
        $packages = $packagesResponse->json()['data'] ?? [];
        $eventsResponse = $httpClient->get('https://website-cms.tafaria.com/api/events');
        $events = $eventsResponse->json()['data'] ?? [];
        $amenitiesResponse = $httpClient->get('https://website-cms.tafaria.com/api/amenities');
        $amenities = $amenitiesResponse->json()['data'] ?? [];
        $diningResponse = $httpClient->get('https://website-cms.tafaria.com/api/dining');
        $dining = $diningResponse->json()['data'] ?? [];
        $schoolAdditionalResponse = $httpClient->get('https://website-cms.tafaria.com/api/school-additional');
        $schoolAdditional = $schoolAdditionalResponse->json()['data'] ?? [];

        $aboutUsResponse = $httpClient->get('https://website-cms.tafaria.com/api/about-us');
        $aboutUs = $aboutUsResponse->json()['data'] ?? [];
        $tafariaPhilosophyResponse = $httpClient->get('https://website-cms.tafaria.com/api/tafaria-philosophy');
        $tafariaPhilosophy = $tafariaPhilosophyResponse->json()['data'] ?? [];


        $eventAddonsResponse = $httpClient->get('https://website-cms.tafaria.com/api/event-addons');
        $eventAddons = $eventAddonsResponse->json()['data'] ?? [];


        $category = collect($categories)->firstWhere('slug', $slug);

        if (!$category) {
            abort(404);
        }

        $metadata = $this->generateCategoryMetadata($category);
        $schemas = $this->generateCategorySchemas($category, $slug);
        $videosResponse = $httpClient->get('https://website-cms.tafaria.com/api/videos');
        $videos = $videosResponse->json();

        $filteredVideos = collect($videos)->filter(function ($video) use ($slug) {
            return stripos($video['title'], $slug) !== false;
        })->values();
        return Inertia::render('Category/Show', [
            'category' => $category,
            'metadata' => $metadata,
            'schemas' => $schemas,
            'categories' => $categories,
            'videos' => $filteredVideos,
            'events' => $events,
            'eventAddons' => $eventAddons,
            'amenities' => $amenities,
            'dining' => $dining,
            'schoolAdditional' => $schoolAdditional,
            'schoolPrograms' => $schoolPrograms,
            'packages' => $packages,
            'aboutUs' => $aboutUs,
            'tafariaPhilosophy' => $tafariaPhilosophy,
        ]);
    }

    public function showPost($categorySlug, $postSlug)
    {
        $httpClient = Http::withOptions([
            'verify' => false,
        ]);
        $categoriesResponse = $httpClient->get('https://website-cms.tafaria.com/api/categories');
        $categories = $categoriesResponse->json();

        $category = collect($categories)->firstWhere('slug', $categorySlug);

        if (!$category) {
            abort(404);
        }

        $post = collect($category['posts'])->firstWhere('slug', $postSlug);

        if (!$post) {
            abort(404);
        }

        $imagesResponse = $httpClient->get('https://website-cms.tafaria.com/api/images');
        $images = $imagesResponse->json();

        $metadata = $this->generatePostMetadata($category, $post, $images);
        $schemas = $this->generatePostSchemas($category, $post, $categorySlug, $postSlug, $images);

        return Inertia::render('BlogPost/Show', [
            'category' => $category,
            'post' => $post,
            'metadata' => $metadata,
            'schemas' => $schemas,
            'categories' => $categories,
        ]);
    }

    private function generateCategoryMetadata($category)
    {
        return [
            'title' => $category['name'],
            'description' => $this->extractFromHtml($category['description']),
            'openGraph' => [
                'title' => $category['name'],
                'description' => $this->extractFromHtml($category['description']),
                'images' => $category['image_path'] ? [
                    [
                        'url' => $category['image_path'],
                        'width' => 800,
                        'height' => 600,
                        'alt' => $category['name'],
                    ],
                ] : [],
                'url' => "https://www.tafaria.com/{$category['slug']}",
                'type' => 'website',
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => "{$category['name']} | Tafaria Castle & Center for the Arts",
                'description' => $this->extractFromHtml($category['description']),
                'images' => $category['image_path'] ? [
                    $category['image_path'],
                ] : [],
            ],
            'alternates' => [
                'canonical' => "https://tafaria.com/{$category['slug']}",
            ],
        ];
    }

    private function generatePostMetadata($category, $post, $images)
    {
        $contentText = $this->extractFromHtml($post['content']);
        $postImages = $this->extractPostImages($post, );

        return [
            'title' => $post['title'],
            'description' => $contentText ?: $post['title'],
            'openGraph' => [
                'title' => $post['title'],
                'description' => $contentText ?: $post['title'],
                'images' => $postImages,
                'url' => "https://www.tafaria.com/{$category['slug']}/{$post['slug']}",
                'type' => 'article',
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => $post['title'],
                'description' => $contentText ?: $post['title'],
                'images' => array_column($postImages, 'url'),
            ],
            'alternates' => [
                'canonical' => "https://tafaria.com/{$category['slug']}/{$post['slug']}",
            ],
        ];
    }

    private function generateCategorySchemas($category, $slug)
    {
        $breadcrumbSchema = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Home',
                    'item' => 'https://www.tafaria.com',
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => $category['name'],
                    'item' => "https://www.tafaria.com/{$slug}",
                ],
            ],
        ]);

        $jsonLd = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'CollectionPage',
            'name' => $category['name'],
            'description' => $this->extractFromHtml($category['description']),
            'url' => "https://www.tafaria.com/{$slug}",
            'image' => $category['image_path'] ?? null,
            'mainEntity' => [
                '@type' => 'ItemList',
                'itemListElement' => collect($category['posts'])->map(function ($post, $index) use ($category, $slug) {
                    $contentText = $this->extractFromHtml($post['content']);
                    $description = $contentText ?: "Read about {$post['title']} in our {$category['name']} collection";
                    $postImages = $this->extractPostImages($post, );
                    return [
                        '@type' => 'BlogPosting',
                        '@id' => "https://www.tafaria.com/{$slug}/{$post['slug']}",
                        'headline' => $post['title'],
                        'description' => $description,
                        'image' => collect($postImages)->map(function ($img) {
                            return [
                                '@type' => 'ImageObject',
                                'url' => $img['url'],
                                'width' => $img['width'],
                                'height' => $img['height'],
                            ];
                        })->toArray(),
                        'url' => "https://www.tafaria.com/{$slug}/{$post['slug']}",
                        'position' => $index + 1,
                        'author' => [
                            '@type' => 'Organization',
                            'name' => 'Tafaria Castle & Center for the Arts',
                        ],
                        'publisher' => [
                            '@type' => 'Organization',
                            'name' => 'Tafaria',
                            'logo' => [
                                '@type' => 'ImageObject',
                                'url' => 'https://www.tafaria.com/logo.png',
                            ],
                        ],
                    ];
                })->toArray(),
            ],
        ]);

        return [
            'breadcrumb' => $breadcrumbSchema,
            'jsonLd' => $jsonLd,
        ];
    }

    private function generatePostSchemas($category, $post, $categorySlug, $postSlug, $images)
    {
        $breadcrumbSchema = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Home',
                    'item' => 'https://www.tafaria.com',
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => $category['name'],
                    'item' => "https://www.tafaria.com/{$categorySlug}",
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 3,
                    'name' => $post['title'],
                    'item' => "https://www.tafaria.com/{$categorySlug}/{$postSlug}",
                ],
            ],
        ]);

        $postImages = $this->extractPostImages($post, );

        $jsonLd = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            '@id' => "https://www.tafaria.com/{$categorySlug}/{$postSlug}",
            'headline' => $post['title'],
            'description' => $this->extractFromHtml($post['content']) ?: $post['title'],
            'image' => collect($postImages)->map(function ($img) {
                return [
                    '@type' => 'ImageObject',
                    'url' => $img['url'],
                    'width' => $img['width'],
                    'height' => $img['height'],
                ];
            })->toArray(),
            'url' => "https://www.tafaria.com/{$categorySlug}/{$postSlug}",
            'datePublished' => $post['created_at'],
            'author' => [
                '@type' => 'Organization',
                'name' => 'Tafaria Castle & Center for the Arts',
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'Tafaria',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => 'https://www.tafaria.com/logo.png',
                    'width' => 600,
                    'height' => 60,
                ],
            ],
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => "https://www.tafaria.com/{$categorySlug}/{$postSlug}",
            ],
        ]);

        return [
            'breadcrumb' => $breadcrumbSchema,
            'jsonLd' => $jsonLd,
        ];
    }

    private function extractFromHtml($content)
    {
        $fallback = 'Tafaria Castle is a country lodge, a conference center and a center for the arts located between Nyeri & Nyahururu in Kenya near the scenic Aberdare foothills of the Mt Kenya region, just 65km from Nyeri along the Nyeri-Nyahururu Road. It offers accommodation, dining, conferencing and recreational activities including museum, farm & herbarium tours, horse riding, carriage driving, archery and swimming. As a Center for the Arts, Tafaria offers art residencies and features virtual and performing arts studios and educational programs for students in life skills, leadership and the arts.';

        if (!$content || trim($content) === '') {
            return $fallback;
        }

        $text = strip_tags($content);
        $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text) ?: $fallback;
    }

    private function extractPostImages($post, )
    {
        $imageUrls = $this->extractImageUrlsFromHtml($post['content']);

        if (!empty($imageUrls)) {
            return array_map(function ($url) use ($post) {
                return [
                    'url' => $url,
                    'width' => 800,
                    'height' => 600,
                    'alt' => $post['title'],
                ];
            }, $imageUrls);
        }
        return [];


    }

    private function extractImageUrlsFromHtml($htmlContent)
    {
        if (!$htmlContent || trim($htmlContent) === '') {
            return [];
        }

        $dom = new \DOMDocument();
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="utf-8" ?>' . $htmlContent, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
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
    }
}