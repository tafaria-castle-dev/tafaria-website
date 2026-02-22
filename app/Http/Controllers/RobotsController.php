<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function index()
    {
        $baseUrl = config('app.url', 'https://www.tafaria.com');

        $robotsContent = <<<EOD
User-agent: *
Allow: /
Disallow: /api/
Disallow: /providers
Disallow: /hooks

User-agent: Googlebot
Allow: /

Sitemap: {$baseUrl}/sitemap.xml
EOD;

        return response($robotsContent, 200)
            ->header('Content-Type', 'text/plain');
    }
}