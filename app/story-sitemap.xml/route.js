import { 
  getTrendingMovies, 
  getUpcomingMovies, 
  getNowPlayingMovies, 
  getMovieSlug 
} from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';
  const now = new Date().toISOString();

  const [trendingDay, trendingWeek, upcomingUS, upcomingIN, nowPlaying] = await Promise.all([
    getTrendingMovies('day', 1),
    getTrendingMovies('week', 1),
    getUpcomingMovies('US', 1),
    getUpcomingMovies('IN', 1),
    getNowPlayingMovies('US', 1),
  ]);

  const storyMap = new Map();
  [...trendingDay, ...trendingWeek, ...upcomingUS, ...upcomingIN, ...nowPlaying].forEach((m) => {
    if (m && m.id && !storyMap.has(m.id)) {
      storyMap.set(m.id, m);
    }
  });

  const uniqueStories = Array.from(storyMap.values()).slice(0, 100);

  const urlEntries = uniqueStories
    .map((movie) => {
      const slug = getMovieSlug(movie.id, movie.title);
      return `  <url>
    <loc>${siteUrl}/stories/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

