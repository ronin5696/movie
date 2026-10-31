import https from 'https';

// CloudFront Anycast IPs for TMDB to bypass regional ISP DNS blocks (e.g., Reliance Jio/Airtel in India)
const CLOUDFRONT_IPS = [
  '3.175.86.50',
  '3.175.86.67',
  '3.175.86.103',
  '3.175.86.37',
];

let roundRobinIndex = 0;

// High-speed In-Memory Cache (15 min TTL) to eliminate redundant requests & ECONNRESET
const apiCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

export const MOVIE_GENRES = [
  { id: 28, name: 'Action', slug: 'action' },
  { id: 878, name: 'Sci-Fi', slug: 'sci-fi' },
  { id: 27, name: 'Horror', slug: 'horror' },
  { id: 53, name: 'Thriller', slug: 'thriller' },
  { id: 35, name: 'Comedy', slug: 'comedy' },
  { id: 18, name: 'Drama', slug: 'drama' },
  { id: 16, name: 'Animation', slug: 'animation' },
  { id: 12, name: 'Adventure', slug: 'adventure' },
  { id: 80, name: 'Crime', slug: 'crime' },
  { id: 10749, name: 'Romance', slug: 'romance' },
];

/**
 * Creates clean, SEO-optimized slugs with movie ID (numbers) before the movie title in the URL
 * Example: getMovieSlug(791523, "Wildwood") -> "791523-wildwood"
 */
export function getMovieSlug(id, title) {
  if (!id) return '';
  if (!title) return String(id);
  const cleanTitle = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return cleanTitle ? `${id}-${cleanTitle}` : String(id);
}

/**
 * Robustly extracts numeric TMDB movie ID from any format:
 * - Title-first slug: "wildwood-791523"
 * - ID-first slug: "791523-wildwood"
 * - Pure ID: "791523"
 */
export function extractMovieId(idParam) {
  if (!idParam) return null;
  const str = String(idParam).trim();
  
  // 1. Pure numeric ID: "791523"
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }

  // 2. Title-first slug: "wildwood-791523"
  const trailingMatch = str.match(/-(\d+)$/);
  if (trailingMatch) {
    return parseInt(trailingMatch[1], 10);
  }

  // 3. ID-first slug: "791523-wildwood"
  const leadingMatch = str.match(/^(\d+)-/);
  if (leadingMatch) {
    return parseInt(leadingMatch[1], 10);
  }

  // 4. Fallback: find any digits sequence
  const anyDigits = str.match(/\d+/);
  return anyDigits ? parseInt(anyDigits[0], 10) : null;
}

/**
 * Get next CloudFront IP in round-robin sequence to distribute socket load evenly
 */
function getNextCloudFrontIp() {
  const ip = CLOUDFRONT_IPS[roundRobinIndex % CLOUDFRONT_IPS.length];
  roundRobinIndex = (roundRobinIndex + 1) % CLOUDFRONT_IPS.length;
  return ip;
}

/**
 * Robust TMDB fetcher with IP rotation and exponential jitter backoff on ECONNRESET
 */
export async function tmdbFetch(endpoint, params = {}, retries = 3) {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  const urlParams = new URLSearchParams();
  if (!token && apiKey) {
    urlParams.set('api_key', apiKey);
  }

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      urlParams.set(key, String(val));
    }
  });

  const queryString = urlParams.toString();
  const path = `/3${endpoint}${queryString ? `?${queryString}` : ''}`;

  // Check in-memory cache first
  const cacheKey = `${endpoint}?${queryString}`;
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const targetIp = getNextCloudFrontIp();

  return new Promise((resolve, reject) => {
    const headers = {
      Host: 'api.themoviedb.org',
      'User-Agent': 'WatchRelax/1.0',
      Accept: 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      hostname: targetIp,
      port: 443,
      path,
      method: 'GET',
      headers,
      servername: 'api.themoviedb.org',
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(body);
            // Save to memory cache
            apiCache.set(cacheKey, { data, timestamp: Date.now() });
            resolve(data);
          } catch (err) {
            reject(new Error(`Failed to parse TMDB response: ${err.message}`));
          }
        } else if (res.statusCode === 404) {
          resolve(null);
        } else {
          console.error(`TMDB API error [${res.statusCode}]: ${body}`);
          reject(new Error(`TMDB error status: ${res.statusCode}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      if (retries > 0) {
        const delay = 100 + Math.random() * 100;
        setTimeout(() => {
          tmdbFetch(endpoint, params, retries - 1).then(resolve).catch(reject);
        }, delay);
        return;
      }
      reject(new Error('TMDB connection timeout'));
    });

    req.on('error', (err) => {
      if (retries > 0) {
        // Stagger retry with 120-200ms delay to clear CloudFront burst rate limits
        const delay = 120 + Math.random() * 80;
        setTimeout(() => {
          tmdbFetch(endpoint, params, retries - 1).then(resolve).catch(reject);
        }, delay);
        return;
      }
      reject(err);
    });

    req.end();
  });
}

/**
 * 1. Fetch top trending movies globally
 */
export async function getTrendingMovies(timeWindow = 'day', page = 1) {
  try {
    const data = await tmdbFetch(`/trending/movie/${timeWindow}`, { language: 'en-US', page });
    return data?.results || [];
  } catch (error) {
    console.error('Error fetching trending movies from TMDB:', error.message);
    return [];
  }
}

/**
 * 2. Fetch movies currently in theaters / now playing in the selected country
 */
export async function getNowPlayingMovies(country = 'US', page = 1) {
  try {
    const data = await tmdbFetch('/movie/now_playing', {
      region: (country || 'US').toUpperCase(),
      language: 'en-US',
      page,
    });
    return data?.results || [];
  } catch (error) {
    console.error('Error fetching now playing movies:', error.message);
    return [];
  }
}

/**
 * 3. Fetch top rated movies of all time
 */
export async function getTopRatedMovies(page = 1) {
  try {
    const data = await tmdbFetch('/movie/top_rated', {
      language: 'en-US',
      page,
    });
    return data?.results || [];
  } catch (error) {
    console.error('Error fetching top rated movies:', error.message);
    return [];
  }
}

/**
 * 4. Fetch upcoming movies in theaters / digital OTT release
 */
export async function getUpcomingMovies(country = 'US', page = 1) {
  try {
    const data = await tmdbFetch('/movie/upcoming', {
      region: (country || 'US').toUpperCase(),
      language: 'en-US',
      page,
    });
    return data?.results || [];
  } catch (error) {
    console.error('Error fetching upcoming movies:', error.message);
    return [];
  }
}

/**
 * 5. Fetch popular movies (general library)
 */
export async function getPopularMovies(page = 1) {
  try {
    const data = await tmdbFetch('/movie/popular', {
      language: 'en-US',
      page,
    });
    return data?.results || [];
  } catch (error) {
    console.error('Error fetching popular movies:', error.message);
    return [];
  }
}

/**
 * 5. Fetch movies by genre category (Action, Sci-Fi, Horror, etc.)
 */
export async function getMoviesByGenre(genreId, page = 1) {
  try {
    const data = await tmdbFetch('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      'vote_count.gte': 50,
      language: 'en-US',
      page,
    });
    return data?.results || [];
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error.message);
    return [];
  }
}

/**
 * 6. Search across TMDB's complete database of movies
 */
export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) return [];
  try {
    const data = await tmdbFetch('/search/movie', {
      query: query.trim(),
      include_adult: false,
      language: 'en-US',
      page,
    });
    return data?.results || [];
  } catch (error) {
    console.error(`Error searching movies for "${query}":`, error.message);
    return [];
  }
}

/**
 * 7. Fetch complete movie details including videos, credits, and country watch providers
 */
export async function getMovieDetails(movieId) {
  if (!movieId) return null;
  try {
    return await tmdbFetch(`/movie/${movieId}`, {
      append_to_response: 'videos,watch/providers,credits,similar',
      language: 'en-US',
    });
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error.message);
    return null;
  }
}

/**
 * Extract the primary official YouTube trailer from TMDB videos array
 */
export function extractOfficialTrailer(videos = {}) {
  const list = videos?.results || [];
  if (!list.length) return null;

  const officialTrailer = list.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  );
  if (officialTrailer) return officialTrailer;

  const anyTrailer = list.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  if (anyTrailer) return anyTrailer;

  const anyTeaser = list.find((v) => v.site === 'YouTube' && v.type === 'Teaser');
  if (anyTeaser) return anyTeaser;

  return list.find((v) => v.site === 'YouTube') || null;
}

/**
 * Extract localized legal streaming providers (flatrate, rent, buy, free) for a specific country
 */
export function extractWatchProviders(watchProviders = {}, countryCode = 'US') {
  const results = watchProviders?.results || {};
  const code = (countryCode || 'US').toUpperCase();
  const regionalData = results[code] || results['US'] || null;

  if (!regionalData) {
    return {
      flatrate: [],
      free: [],
      rent: [],
      buy: [],
      link: null,
      country: code,
    };
  }

  return {
    flatrate: regionalData.flatrate || [],
    free: regionalData.free || regionalData.ads || [],
    rent: regionalData.rent || [],
    buy: regionalData.buy || [],
    link: regionalData.link || null,
    country: code,
  };
}

/**
 * Helper to generate zero-cost CDN asset URLs directly from TMDB
 */
export function tmdbImage(path, size = 'original') {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
