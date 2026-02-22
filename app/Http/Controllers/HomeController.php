<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $httpClient = Http::withOptions([
            'verify' => false,
        ]);
        $aboutsResponse = $httpClient->get('https://website-cms.tafaria.com/api/abouts');
        $abouts = $aboutsResponse->json();
        $categoriesResponse = $httpClient->get('https://website-cms.tafaria.com/api/categories');
        $categories = $categoriesResponse->json();
        $imagesResponse = $httpClient->get('https://website-cms.tafaria.com/api/images');
        $images = $imagesResponse->json();
        $heroSectionResponse = $httpClient->get('https://website-cms.tafaria.com/api/hero-sections');
        $heroSection = $heroSectionResponse->json();
        $offersResponse = $httpClient->get('https://website-cms.tafaria.com/api/offers');
        $offers = $offersResponse->json();
        $additionalDetailsResponse = $httpClient->get('https://website-cms.tafaria.com/api/additional-details');
        $additionalDetails = $additionalDetailsResponse->json()['data'] ?? [];
        $schoolProgramsResponse = $httpClient->get('https://website-cms.tafaria.com/api/school-programs');
        $schoolPrograms = $schoolProgramsResponse->json()['data'] ?? [];
        $packagesResponse = $httpClient->get('https://website-cms.tafaria.com/api/packages');
        $packages = $packagesResponse->json()['data'] ?? [];


        $description = $this->extractFromHtml($abouts[0]['content'] ?? '');

        $metadata = [
            'title' => 'Tafaria Castle & Center for the Arts',
            'description' => $description,
            'keywords' => [
                'Tafaria Castle',
                'Tafaria Kenya',
                'Country Lodge',
                'archery Kenya',
                'horse riding Nyeri',
                '5 star hotels in Mt. Kenya',
                'art gallery Nyeri',
                'Weekend getaway',
                'Museum',
                'adventure tourism Nyeri',
                'Wedding venues near Nyeri',
                'castle weddings Kenya',
                'Wedding venues Kenya',
                'Castle wedding Kenya',
                'Art centers',
                'Art residencies in Kenya',
                'restaurants Nyeri',
                'Conference venue in nyeri',
                'Conference venue in Nyahururu',
                'Conference venue in Laikipia',
                'Conference venue in Nanyuki',
                'Conference venue in mt kenya region',
                'Hotels in Nanyuki',
                'Hotels in Laikipia',
                'Hotels in Nyahururu',
                'Hotels in nyeri',
                'Hotels in mt kenya region',
            ],
            'openGraph' => [
                'title' => 'Tafaria Castle & Center for the Arts',
                'description' => $description,
                'url' => 'https://www.tafaria.com',
                'type' => 'website',
                'images' => [
                    [
                        'url' => 'https://website-cms.tafaria.com/storage/images/1758908742_Castle%20Image.jpg',
                        'width' => 1200,
                        'height' => 630,
                        'alt' => 'Tafaria Castle',
                    ],
                ],
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => 'Tafaria Castle & Center for the Arts',
                'description' => $description,
                'images' => [
                    'https://website-cms.tafaria.com/storage/images/1758908742_Castle%20Image.jpg',
                ],
            ],
            'alternates' => ['canonical' => 'https://tafaria.com'],
        ];

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

        $localBusinessSchema = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'Hotel',
            'name' => 'Tafaria Castle & Center for the Arts',
            'url' => 'https://www.tafaria.com',
            'telephone' => '+254 700151480',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => '1910 Park Rise, off Nyeri-Nyahururu Road',
                'addressLocality' => 'Nyahururu',
                'addressRegion' => 'Laikipia County',
                'addressCountry' => 'KE',
                'postalCode' => 10101,
            ],
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => '-0.1164533',
                'longitude' => '36.6279602',
            ],
            'image' => 'https://www.tafaria.com/logo.png',
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

        $siteNavigationSchema = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'SiteNavigationElement',
            'about' => 'Main Navigation',
            'description' => 'Primary navigation links for Tafaria Castle website',
            'hasPart' => collect($categories)
                ->filter(fn($category) => isset($category['slug']) && isset($category['name']))
                ->map(fn($category, $index) => [
                    '@type' => 'SiteNavigationElement',
                    '@id' => "https://www.tafaria.com/{$category['slug']}",
                    'about' => $category['name'],
                    'description' => substr($category['description'] ?? '', 0, 200) ?: "Explore {$category['name']} at Tafaria Castle",
                    'url' => "https://www.tafaria.com/{$category['slug']}",
                    'position' => $index + 1,
                ])
                ->values()
                ->toArray(),
        ]);

        $jsonLd = json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'about' => 'Tafaria Castle & Center for the Arts',
            'url' => 'https://www.tafaria.com',
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'Tafaria Castle & Center for the Arts',
            ],
            'mainEntity' => [
                '@type' => 'ItemList',
                'name' => 'Tafaria Image Gallery',
                'description' => 'Collection of images from Tafaria Castle and its facilities',
                'itemListElement' => collect($images)->map(fn($image) => [
                    '@type' => 'ImageObject',
                    '@id' => "https://www.tafaria.com/image?id={$image['id']}",
                    'name' => $image['title'],
                    'description' => $image['description'],
                    'caption' => $image['description'],
                    'contentUrl' => $image['image_path'],
                    'width' => $image['width'],
                    'height' => $image['height'],
                    'encodingFormat' => "image/{$image['extension']}",
                    'contentSize' => $image['file_size'],
                ])->toArray(),
            ],
        ]);

        return Inertia::render('Home', [
            'abouts' => $abouts,
            'categories' => $categories,
            'images' => $images,
            'metadata' => $metadata,
            'offers' => $offers,
            'additionalDetails' => $additionalDetails,
            'schoolPrograms' => $schoolPrograms,
            'packages' => $packages,
            'heroSection' => $heroSection,
            'schemas' => [
                'organization' => $organizationSchema,
                'localBusiness' => $localBusinessSchema,
                'breadcrumb' => $breadcrumbSchema,
                'siteNavigation' => $siteNavigationSchema,
                'jsonLd' => $jsonLd,
            ],
        ]);
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
}