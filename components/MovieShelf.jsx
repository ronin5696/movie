'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieShelf({
  title,
  subtitle,
  movies = [],
  country = 'us',
  seeAllHref,
}) {
  const scrollRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const distance = 460;
    scrollRef.current.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className="space-y-3.5 sm:space-y-4">
      {/* IMDb-Style Shelf Header with Vertical Gold Accent Bar */}
      <div className="flex items-end justify-between border-b border-white/[0.08] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-1 pl-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Navigation & Explore Next Link */}
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-xs font-semibold text-[#f5c518] hover:underline transition-colors hidden sm:flex items-center gap-1 mr-2"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Previous Button */}
          <button
            type="button"
            onClick={() => handleScroll('prev')}
            aria-label="Previous Movies"
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => handleScroll('next')}
            aria-label="Next Movies"
            className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Shelf with Mobile Touch Scroll */}
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {movies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              className="w-[135px] sm:w-[165px] md:w-[185px] flex-shrink-0 snap-start"
            >
              <MovieCard movie={movie} country={country} priority={index < 4} />
            </div>
          ))}

          {/* End-of-shelf "See More" Card */}
          {seeAllHref && (
            <div className="w-[135px] sm:w-[165px] md:w-[185px] flex-shrink-0 snap-start">
              <Link
                href={seeAllHref}
                className="group/more flex flex-col items-center justify-center h-full min-h-[220px] sm:min-h-[260px] rounded-xl bg-[#14151b] border border-dashed border-white/20 hover:border-[#f5c518]/60 p-4 sm:p-6 text-center transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-full bg-white/5 text-[#f5c518] group-hover/more:bg-[#f5c518] group-hover/more:text-black flex items-center justify-center mb-3 transition-colors shadow-lg">
                  <ArrowRight className="w-5 h-5 group-hover/more:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-white group-hover/more:text-[#f5c518]">
                  Explore All
                </span>
                <span className="text-[10px] text-zinc-400 mt-1">
                  Full Catalog →
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
