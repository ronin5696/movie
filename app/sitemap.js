import { 
  getTrendingMovies, 
  getNowPlayingMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getPopularMovies,
  getMoviesByGenre,
  getMovieSlug,
  MOVIE_GENRES 
} from '@/lib/tmdb';
import { getAllArticles } from '@/lib/weeklyArticles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';

// All 7 supported country tiers for programmatic global coverage
const PRIMARY_REGIONS = ['us', 'in', 'gb', 'ca', 'au', 'de', 'fr'];

// Dedicated catalog types per region
const CATALOG_TYPES = ['trending', 'now_playing', 'upcoming', 'top_rated'];

// Re-generate sitemap automatically every 12 hours with fresh upcoming & trending releases
export const revalidate = 43200;

export default async function sitemap() {
  const now = new Date();

  // Comprehensive parallel fetch across trending, upcoming, now playing, popular, top-rated & all genres
  const genrePromises = MOVIE_GENRES.flatMap((g) => [
    getMoviesByGenre(g.id, 1),
    getMoviesByGenre(g.id, 2),
  ]);

  const popularPromises = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => getPopularMovies(p));
  const topRatedPromises = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => getTopRatedMovies(p));

  const upcomingPromises = [
    getUpcomingMovies('US', 1),
    getUpcomingMovies('US', 2),
    getUpcomingMovies('US', 3),
    getUpcomingMovies('IN', 1),
    getUpcomingMovies('IN', 2),
    getUpcomingMovies('GB', 1),
  ];

  const nowPlayingPromises = [
    getNowPlayingMovies('US', 1),
    getNowPlayingMovies('US', 2),
    getNowPlayingMovies('IN', 1),
    getNowPlayingMovies('IN', 2),
    getNowPlayingMovies('GB', 1),
  ];

  const trendingPromises = [
    getTrendingMovies('day', 1),
    getTrendingMovies('day', 2),
    getTrendingMovies('week', 1),
    getTrendingMovies('week', 2),
  ];

  const allResults = await Promise.all([
    ...trendingPromises,
    ...upcomingPromises,
    ...nowPlayingPromises,
    ...popularPromises,
    ...topRatedPromises,
    ...genrePromises,
  ]);

  // Combine and deduplicate movies by numeric ID
  const uniqueMoviesMap = new Map();
  allResults.flat().forEach((m) => {
    if (m && m.id && !uniqueMoviesMap.has(m.id)) {
      uniqueMoviesMap.set(m.id, m);
    }
  });

  const uniqueMovies = Array.from(uniqueMoviesMap.values());

  // 1. Root, Regional Homepages & Mandatory Compliance Pages
  const staticRoutes = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    ...getAllArticles().map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.85,
    })),
    ...PRIMARY_REGIONS.map((region) => ({
      url: `${SITE_URL}/${region}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
    })),
  ];

  // 2. Regional Hub Types (e.g. /us?type=upcoming, /in?type=trending)
  const typeRoutes = [];
  for (const region of PRIMARY_REGIONS) {
    for (const catType of CATALOG_TYPES) {
      typeRoutes.push({
        url: `${SITE_URL}/${region}?type=${catType}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // 3. Regional Genre Category Pages (e.g. /us?genre=28, /in?genre=878)
  const categoryRoutes = [];
  for (const region of PRIMARY_REGIONS) {
    for (const genre of MOVIE_GENRES) {
      categoryRoutes.push({
        url: `${SITE_URL}/${region}?genre=${genre.id}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }
  }

  // 4. SEO Slugified Movie URLs across all 7 global regions
  // Format: https://site.com/[region]/movie/[id]-[movie-slug]
  const movieRoutes = [];
  for (const movie of uniqueMovies) {
    const movieSlug = getMovieSlug(movie.id, movie.title);

    for (const region of PRIMARY_REGIONS) {
      movieRoutes.push({
        url: `${SITE_URL}/${region}/movie/${movieSlug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...typeRoutes, ...categoryRoutes, ...movieRoutes];
}
