<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ImageController extends Controller
{
    public function show(Request $request)
    {
        $id = $request->query('id');

        if (!$id) {
            return Inertia::render('image', [
                'error' => 'No image ID provided.',
                'metadata' => [
                    'title' => 'Image Not Found | Tafaria Castle & Center for the Arts',
                    'description' => 'No image ID provided.',
                ],
            ]);
        }

        try {
            $httpClient = Http::withOptions([
                'verify' => false,
            ]);

            $response = $httpClient->get("https://website-cms.tafaria.com/api/images/{$id}");
            $data = $response->json();
            $categoriesResponse = $httpClient->get('https://website-cms.tafaria.com/api/categories');
            $categories = $categoriesResponse->json();
            if (!$data) {
                return Inertia::render('image', [
                    'error' => 'No image found',
                    'metadata' => [
                        'title' => 'Image Not Found | Tafaria Castle & Center for the Arts',
                        'description' => 'No image found for the provided ID.',
                    ],
                ]);
            }

            $pageTitle = $data['title'] ?? 'Tafaria Castle Image';
            $pageDescription = $data['description'] ?? 'View this amazing image at Tafaria Castle.';
            $pageImage = $data['image_path'] ?? 'https://www.tafaria.com/logo.png';
            $pageUrl = "https://www.tafaria.com/image?id={$id}";
            $imageWidth = $data['width'] ?? 500;
            $imageHeight = $data['height'] ?? 500;
            $imageExtension = $data['extension'] ?? 'jpeg';

            $metadata = [
                'title' => $pageTitle,
                'description' => $pageDescription,
                'keywords' => [
                    $pageTitle,
                    'Tafaria Castle',
                    'Tafaria Kenya',
                    'Art Gallery',
                    'Country Lodge',
                    'Mt. Kenya',
                    'Nyeri',
                    'Nyahururu',
                    'Kenya Tourism',
                    'Center for the Arts'
                ],
                'openGraph' => [
                    'title' => $pageTitle,
                    'description' => $pageDescription,
                    'url' => $pageUrl,
                    'type' => 'website',
                    'images' => [
                        [
                            'url' => $pageImage,
                            'width' => $imageWidth,
                            'height' => $imageHeight,
                            'alt' => $pageTitle,
                        ],
                    ],
                    'siteName' => 'Tafaria Castle',
                ],
                'twitter' => [
                    'card' => 'summary_large_image',
                    'title' => $pageTitle,
                    'description' => $pageDescription,
                    'images' => [$pageImage],
                    'creator' => '@TafariaCastle',
                    'site' => '@TafariaCastle',
                ],
                'alternates' => [
                    'canonical' => $pageUrl,
                ],
            ];

            $imageSchema = json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'ImageObject',
                'name' => $pageTitle,
                'description' => $pageDescription,
                'url' => $pageImage,
                'width' => $imageWidth,
                'height' => $imageHeight,
                'encodingFormat' => "image/{$imageExtension}",
                'contentUrl' => $pageUrl,
                'creator' => [
                    '@type' => 'Organization',
                    'name' => 'Tafaria Castle',
                    'url' => 'https://www.tafaria.com',
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'Tafaria Castle & Center for the Arts',
                    'url' => 'https://www.tafaria.com',
                    'logo' => 'https://www.tafaria.com/logo.png',
                ],
                'datePublished' => $data['created_at'] ?? now()->toISOString(),
                'dateModified' => $data['updated_at'] ?? now()->toISOString(),
            ]);

            $organizationSchema = json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => 'Tafaria Castle & Center for the Arts',
                'url' => 'https://www.tafaria.com',
                'logo' => 'https://www.tafaria.com/logo.png',
                'contactPoint' => [
                    '@type' => 'ContactPoint',
                    'telephone' => '+254 700151480',
                    'contactType' => 'Customer Service',
                ],
                'sameAs' => [
                    'https://x.com/tafariacastle',
                    'https://www.facebook.com/TafariaCaslteArts',
                    'https://www.instagram.com/tafaria.castle',
                ],
            ]);

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
                    
                ],
            ]);

            return Inertia::render('image', [
                'image' => $data,
                'metadata' => $metadata,
                'categories' => $categories,
                'schemas' => [
                    'image' => $imageSchema,
                    'organization' => $organizationSchema,
                    'breadcrumb' => $breadcrumbSchema,
                ],
            ]);

        } catch (\Exception $e) {
            return Inertia::render('image', [
                'error' => 'Error loading image: ' . $e->getMessage(),
                'metadata' => [
                    'title' => 'Error | Tafaria Castle & Center for the Arts',
                    'description' => 'Error loading image details.',
                ],
            ]);
        }
    }
}