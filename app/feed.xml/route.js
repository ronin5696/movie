import { getTrendingMovies, getMovieSlug } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';
  const movies = await getTrendingMovies('day', 1);

  const rssItems = movies.slice(0, 30).map((movie) => {
    const slug = getMovieSlug(movie.id, movie.title);
    const movieUrl = `${siteUrl}/us/movie/${slug}`;
    const pubDate = new Date().toUTCString();
    const cleanOverview = (movie.overview || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const cleanTitle = (movie.title || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return `
    <item>
      <title>${cleanTitle} - Official 4K Trailer &amp; Where to Stream</title>
      <link>${movieUrl}</link>
      <guid isPermaLink="true">${movieUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${cleanOverview}]]></description>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WatchRelax | Official Movie Trailers &amp; Streaming Guide</title>
    <link>${siteUrl}</link>
    <description>Latest trending official 4K movie trailers, OTT streaming dates on Netflix, Prime &amp; Disney+, and offline download guides.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
