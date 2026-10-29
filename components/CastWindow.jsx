'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { tmdbImage } from '@/lib/tmdb';

export default function CastWindow({ credits = {} }) {
  const scrollRef = useRef(null);

  const cast = credits?.cast || [];
  const crew = credits?.crew || [];

  if (!cast || cast.length === 0) return null;

  // Extract key directors
  const directors = crew.filter((c) => c.job === 'Director').map((d) => d.name);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const distance = 420;
    scrollRef.current.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="rounded-2xl p-6 bg-[#16171d] border border-white/[0.08] space-y-4 shadow-lg">
      {/* Header with IMDb-Style Gold Accent & Carousel Navigation */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Top Cast
            </h3>
            {directors.length > 0 && (
              <p className="text-xs text-zinc-400 mt-0.5">
                Directed by <strong className="text-zinc-200">{directors.join(', ')}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('prev')}
            aria-label="Previous Cast"
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('next')}
            aria-label="Next Cast"
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cast Cards Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {cast.slice(0, 18).map((actor) => {
            const photoUrl = tmdbImage(actor.profile_path, 'w185');

            return (
              <div
                key={actor.id}
                className="w-[120px] sm:w-[135px] flex-shrink-0 snap-start flex flex-col space-y-2 group"
              >
                {/* Actor Photo */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-[#f5c518]/50 transition-colors shadow-md">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={actor.name}
                      fill
                      sizes="(max-width: 640px) 120px, 135px"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 bg-zinc-900">
                      <User className="w-8 h-8 mb-1" />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Actor & Character Info */}
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-[#f5c518] transition-colors truncate">
                    {actor.name}
                  </h4>
                  {actor.character && (
                    <p className="text-[11px] text-zinc-400 truncate">
                      {actor.character}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
