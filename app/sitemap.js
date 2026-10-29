import { 
  getTrendingMovies, 
  getNowPlayingMovies, 
  getTopRatedMovies, 
  getPopularMovies,
  getMovieSlug,
  MOVIE_GENRES 
} from '@/lib/tmdb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';

// Primary country tiers for programmatic global coverage
const PRIMARY_REGIONS = ['us', 'gb', 'ca', 'in', 'au'];

export default async function sitemap() {
  const now = new Date();

  // Fetch diverse movie pools in parallel to maximize Google Search & Discover indexation
  const [trendingDay, trendingWeek, nowPlaying, topRated, popular1, popular2] = await Promise.all([
    getTrendingMovies('day', 1),
    getTrendingMovies('week', 1),
    getNowPlayingMovies('US', 1),
    getTopRatedMovies(1),
    getPopularMovies(1),
    getPopularMovies(2),
  ]);

  // Combine and deduplicate movies by ID
  const allMovies = [...trendingDay, ...trendingWeek, ...nowPlaying, ...topRated, ...popular1, ...popular2];
  const uniqueMoviesMap = new Map();
  allMovies.forEach((m) => {
    if (m && m.id && !uniqueMoviesMap.has(m.id)) {
      uniqueMoviesMap.set(m.id, m);
    }
  });

  const uniqueMovies = Array.from(uniqueMoviesMap.values());

  // 1. Root and Regional Homepages
  const staticRoutes = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    ...PRIMARY_REGIONS.map((region) => ({
      url: `${SITE_URL}/${region}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
    })),
  ];

  // 2. Regional Genre Category Pages (e.g. /us?genre=28, /gb?genre=878)
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

  // 3. SEO Slugified Movie URLs across primary global regions
  // Format: https://site.com/[region]/movie/[id]-[movie-slug]
  const movieRoutes = [];
  for (const movie of uniqueMovies) {
    const movieSlug = getMovieSlug(movie.id, movie.title);
    const movieLastModified = movie.release_date ? new Date(movie.release_date) : now;

    for (const region of PRIMARY_REGIONS) {
      movieRoutes.push({
        url: `${SITE_URL}/${region}/movie/${movieSlug}`,
        lastModified: movieLastModified,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }

  return [...staticRoutes, ...categoryRoutes, ...movieRoutes];
}
