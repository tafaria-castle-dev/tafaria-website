<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'metadata' => [
                'title' => 'Tafaria Castle & Center for the Arts',
                'description' => 'Tafaria Castle is a country lodge, a conference center and a center for the arts located between Nyeri & Nyahururu in Kenya near the scenic Aberdare foothills of the Mt Kenya region, just 65km from Nyeri along the Nyeri-Nyahururu Road. It offers accommodation, dining, conferencing and recreational activities including museum, farm & herbarium tours, horse riding, carriage driving, archery and swimming. As a Center for the Arts, Tafaria offers art residencies and features virtual and performing arts studios and educational programs for students in life skills, leadership and the arts.',
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
                    'description' => 'Tafaria Castle is a country lodge, a conference center and a center for the arts located between Nyeri & Nyahururu in Kenya near the scenic Aberdare foothills of the Mt Kenya region, just 65km from Nyeri along the Nyeri-Nyahururu Road. It offers accommodation, dining, conferencing and recreational activities including museum, farm & herbarium tours, horse riding, carriage driving, archery and swimming. As a Center for the Arts, Tafaria offers art residencies and features virtual and performing arts studios and educational programs for students in life skills, leadership and the arts.',
                    'url' => 'https://www.tafaria.com',
                    'siteName' => 'Tafaria Castle',
                    'images' => [
                        [
                            'url' => 'https://tafariabucket.fra1.digitaloceanspaces.com/images/RAuu4tE4lVkBrMS6slhpPA.png',
                            'width' => 1200,
                            'height' => 630,
                            'alt' => 'Tafaria Castle & Center for the Arts in Nyahururu, Kenya',
                        ],
                    ],
                    'locale' => 'en_US',
                    'type' => 'website',
                ],
                'twitter' => [
                    'card' => 'summary_large_image',
                    'title' => 'Tafaria Castle & Center for the Arts',
                    'description' => 'Tafaria Castle is a country lodge, a conference center and a center for the arts located between Nyeri & Nyahururu in Kenya near the scenic Aberdare foothills of the Mt Kenya region, just 65km from Nyeri along the Nyeri-Nyahururu Road. It offers accommodation, dining, conferencing and recreational activities including museum, farm & herbarium tours, horse riding, carriage driving, archery and swimming. As a Center for the Arts, Tafaria offers art residencies and features virtual and performing arts studios and educational programs for students in life skills, leadership and the arts.',
                    'creator' => '@TafariaCastle',
                    'site' => '@TafariaCastle',
                    'images' => [
                        'https://tafariabucket.fra1.digitaloceanspaces.com/images/RAuu4tE4lVkBrMS6slhpPA.png',
                    ],
                ],
                'robots' => [
                    'index' => true,
                    'follow' => true,
                    'nocache' => false,
                    'googleBot' => [
                        'index' => true,
                        'follow' => true,
                        'noimageindex' => false,
                        'max-video-preview' => -1,
                        'max-image-preview' => 'large',
                        'max-snippet' => -1,
                    ],
                ],
                'icons' => [
                    'icon' => [
                        ['url' => '/favicon.ico', 'sizes' => 'any'],
                        ['url' => '/favicon-16x16.png', 'sizes' => '16x16', 'type' => 'image/png'],
                        ['url' => '/favicon-32x32.png', 'sizes' => '32x32', 'type' => 'image/png'],
                    ],
                    'apple' => '/apple-touch-icon.png',
                ],
            ],
        ]);
    }
}