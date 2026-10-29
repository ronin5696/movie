'use client';

import { useState, useEffect } from 'react';
import { Loader2, PlusCircle, Sparkles } from 'lucide-react';
import MovieCard from './MovieCard';

export default function InfiniteMovieGrid({
  initialMovies = [],
  type = 'popular',
  genreId = null,
  query = null,
  country = 'us',
  emptyMessage = 'No movies available in this selection.',
}) {
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length >= 12);
  const [error, setError] = useState(null);

  // Synchronize state immediately when switching categories, genres, or queries
  useEffect(() => {
    setMovies(initialMovies);
    setPage(1);
    setHasMore(initialMovies.length >= 12);
    setLoading(false);
    setError(null);
  }, [genreId, query, type, country, initialMovies]);

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    const nextPage = page + 1;

    try {
      const urlParams = new URLSearchParams({
        type,
        page: String(nextPage),
        country,
      });

      if (genreId) urlParams.set('genreId', String(genreId));
      if (query) urlParams.set('query', query);

      const res = await fetch(`/api/movies?${urlParams.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newMovies = data.movies || [];

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        // Filter out duplicate movies by ID
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNew = newMovies.filter((m) => !existingIds.has(m.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
        setHasMore(data.hasMore !== false && nextPage < 500);
      }
    } catch (err) {
      console.error('Error loading more movies:', err);
      setError('Unable to load more movies right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center rounded-2xl glass-panel text-slate-400 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Movie Grid (2 columns on mobile, scaling up to 6 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${index}`}
            movie={movie}
            country={country}
            priority={index < 4}
          />
        ))}
      </div>

      {/* Endless Load More Controller */}
      <div className="pt-2 sm:pt-4 flex flex-col items-center justify-center space-y-3">
        {hasMore ? (
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#f5c518] hover:bg-[#e2b616] text-black font-bold text-xs sm:text-sm shadow-xl shadow-yellow-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Loading More Movies...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Show More Movies (Next Page {page + 1})</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>You have reached the end of this catalog.</span>
          </div>
        )}

        {/* Live Movie Counter Badge */}
        <p className="text-xs text-slate-500 text-center">
          Showing <span className="text-slate-300 font-semibold">{movies.length}</span> titles • Page {page} of endless catalog
        </p>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
