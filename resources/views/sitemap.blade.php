@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
    @foreach ($entries as $entry)
        <url>
            <loc>{{ $entry['url'] }}</loc>
            <lastmod>{{ $entry['lastmod'] }}</lastmod>
            <changefreq>{{ $entry['changefreq'] }}</changefreq>
            <priority>{{ $entry['priority'] }}</priority>
            @if (!empty($entry['images']))
                @foreach ($entry['images'] as $image)
                    @if ($image)
                        <image:image>
                            <image:loc>{{ $image }}</image:loc>
                        </image:image>
                    @endif
                @endforeach
            @endif
            @if (!empty($entry['videos']))
                @foreach ($entry['videos'] as $video)
                    <video:video>
                        <video:content_loc>{{ $video['content_loc'] }}</video:content_loc>
                        <video:thumbnail_loc>{{ $video['thumbnail_loc'] }}</video:thumbnail_loc>
                        <video:title>{{ htmlspecialchars($video['title']) }}</video:title>
                        <video:description>{{ htmlspecialchars($video['description']) }}</video:description>
                    </video:video>
                @endforea
            @endif
        </url>
    @endforeach
</urlset>