'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Bookmark, Trash2, Play, Star, ArrowLeft, Clapperboard } from 'lucide-react';
import { getStoredWatchlist, saveStoredWatchlist } from '@/components/WatchlistButton';
import { tmdbImage, getMovieSlug } from '@/lib/tmdb';

export default function WatchlistPage() {
  const params = useParams() || {};
  const countryCode = (params.country || 'us').toLowerCase();
  const [movies, setMovies] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMovies(getStoredWatchlist());

    const handler = (e) => {
      setMovies(e.detail || getStoredWatchlist());
    };

    window.addEventListener('watchlist-updated', handler);
    return () => window.removeEventListener('watchlist-updated', handler);
  }, []);

  const handleRemove = (id) => {
    const updated = movies.filter((m) => String(m.id) !== String(id));
    setMovies(updated);
    saveStoredWatchlist(updated);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire watchlist?')) {
      setMovies([]);
      saveStoredWatchlist([]);
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-white/10 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 min-h-[70vh]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <Link
            href={`/${countryCode}`}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#f5c518] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Movies</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f5c518]/15 text-[#f5c518] flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-[#f5c518]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">
                My Movie Watchlist
              </h1>
              <p className="text-xs text-zinc-400">
                {movies.length} {movies.length === 1 ? 'movie' : 'movies'} saved for weekend streaming
              </p>
            </div>
          </div>
        </div>

        {movies.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-auto text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/15 text-zinc-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {movies.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 text-zinc-500 flex items-center justify-center mx-auto">
            <Clapperboard className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white font-heading">Your Watchlist is Empty</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Whenever you discover a movie with an awesome trailer or upcoming OTT date, click the &ldquo;+ Watchlist&rdquo; button to save it here for later.
          </p>
          <div className="pt-2">
            <Link
              href={`/${countryCode}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f5c518] text-black font-bold text-xs shadow-lg shadow-yellow-500/20 hover:bg-[#e2b616] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Explore Trending Movies</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Movie Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => {
            const movieSlug = getMovieSlug(movie.id, movie.title);
            const posterSrc = movie.poster_path
              ? tmdbImage(movie.poster_path, 'w500')
              : null;
            const releaseYear = movie.release_date
              ? movie.release_date.substring(0, 4)
              : null;

            return (
              <div
                key={movie.id}
                className="group relative rounded-2xl bg-[#16171d] border border-white/[0.08] overflow-hidden hover:border-[#f5c518]/50 transition-all flex flex-col"
              >
                {/* Poster Link */}
                <Link
                  href={`/${countryCode}/movie/${movieSlug}`}
                  className="relative aspect-[2/3] w-full bg-zinc-900 block overflow-hidden"
                >
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                      No Poster
                    </div>
                  )}

                  {/* Rating Tag */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[#f5c518] text-[11px] font-bold flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 fill-[#f5c518]" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#f5c518] text-black flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>
                </Link>

                {/* Content Box */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                  <Link
                    href={`/${countryCode}/movie/${movieSlug}`}
                    className="font-bold text-white text-xs sm:text-sm line-clamp-1 hover:text-[#f5c518] transition-colors"
                  >
                    {movie.title}
                  </Link>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                    <span className="text-zinc-400">{releaseYear || 'TBA'}</span>
                    <button
                      onClick={() => handleRemove(movie.id)}
                      className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove from Watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
