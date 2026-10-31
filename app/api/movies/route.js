import { NextResponse } from 'next/server';
import {
  getPopularMovies,
  getMoviesByGenre,
  getTrendingMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
} from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'popular';
    const page = parseInt(searchParams.get('page') || '2', 10);
    const genreId = searchParams.get('genreId');
    const query = searchParams.get('query');
    const country = searchParams.get('country') || 'us';

    let movies = [];

    switch (type) {
      case 'genre':
        if (genreId) {
          movies = await getMoviesByGenre(genreId, page);
        }
        break;
      case 'search':
        if (query) {
          movies = await searchMovies(query, page);
        }
        break;
      case 'trending':
        movies = await getTrendingMovies('day', page);
        break;
      case 'now_playing':
        movies = await getNowPlayingMovies(country, page);
        break;
      case 'upcoming':
        movies = await getUpcomingMovies(country, page);
        break;
      case 'top_rated':
        movies = await getTopRatedMovies(page);
        break;
      case 'popular':
      default:
        movies = await getPopularMovies(page);
        break;
    }

    return NextResponse.json({
      success: true,
      page,
      movies,
      hasMore: movies && movies.length > 0 && page < 500,
    });
  } catch (error) {
    console.error('Error in /api/movies pagination route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies', message: error.message },
      { status: 500 }
    );
  }
}
