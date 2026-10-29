import Image from 'next/image';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import { tmdbImage, getMovieSlug } from '@/lib/tmdb';

export default function MovieCard({ movie, country = 'us', priority = false }) {
  if (!movie) return null;

  const poster = tmdbImage(movie.poster_path, 'w500');
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const countryCode = country.toLowerCase();
  const movieSlug = getMovieSlug(movie.id, movie.title);

  return (
    <Link
      href={`/${countryCode}/movie/${movieSlug}`}
      className="group relative rounded-xl overflow-hidden bg-[#14151b] border border-white/[0.08] flex flex-col flex-shrink-0 transition-all duration-300 hover:scale-[1.03] hover:border-[#f5c518]/50 hover:shadow-xl hover:shadow-black/50 hover:z-10"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 185px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-xs text-zinc-500 p-2 text-center bg-zinc-950">
            <span className="font-semibold text-zinc-300">{movie.title}</span>
            <span className="text-[10px] mt-1 text-zinc-600">No Poster Available</span>
          </div>
        )}

        {/* IMDb-Style Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-[11px] font-bold text-[#f5c518] border border-white/10 shadow-lg">
            <Star className="w-3 h-3 fill-[#f5c518]" />
            {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-[#f5c518] text-black flex items-center justify-center shadow-xl shadow-yellow-500/30 transform group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-black ml-0.5" />
          </div>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between space-y-1 bg-[#14151b]">
        <h3 className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-[#f5c518] transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>{year || 'Soon'}</span>
          <span className="text-[#f5c518] font-medium text-[11px] group-hover:underline">
            Trailer &amp; Stream
          </span>
        </div>
      </div>
    </Link>
  );
}
