import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  TrendingUp, 
  Star, 
  ShieldCheck, 
  Clapperboard, 
  Sparkles, 
  Flame, 
  Rocket, 
  Ghost,
  Film,
  Search,
  ArrowRight
} from 'lucide-react';
import { 
  getTrendingMovies, 
  getNowPlayingMovies, 
  getTopRatedMovies, 
  getMoviesByGenre, 
  getPopularMovies,
  searchMovies,
  tmdbImage,
  MOVIE_GENRES,
  getMovieSlug 
} from '@/lib/tmdb';
import MovieShelf from '@/components/MovieShelf';
import SearchBar from '@/components/SearchBar';
import InfiniteMovieGrid from '@/components/InfiniteMovieGrid';

export const revalidate = 3600; // Edge cached for 1 hour

export async function generateMetadata({ params, searchParams }) {
  const { country } = await params;
  const { q, genre, type } = await searchParams;
  const countryUpper = (country || 'US').toUpperCase();

  if (q) {
    return {
      title: `Search results for "${q}" | WatchRelax`,
      description: `Watch official trailers and find legal streaming platforms for "${q}" in ${countryUpper} on WatchRelax.`,
    };
  }

  if (genre) {
    const matchedGenre = MOVIE_GENRES.find((g) => String(g.id) === String(genre) || g.slug === genre);
    const genreName = matchedGenre ? matchedGenre.name : 'Category';
    return {
      title: `${genreName} Movies & OTT Releases in ${countryUpper} | WatchRelax`,
      description: `Browse top ${genreName} movies, official studio trailers, and where to stream them in ${countryUpper}.`,
    };
  }

  if (type === 'trending') {
    return {
      title: `Trending Movies & 4K Trailers in ${countryUpper} | WatchRelax`,
      description: `Explore all trending movies today with official trailers and legal streams on WatchRelax.`,
    };
  }

  return {
    title: `WatchRelax | Official 4K Movie Trailers, OTT Release Dates & Legal Streams in ${countryUpper}`,
    description: `Browse trending, now playing, top-rated, and categorized movies in ${countryUpper}. Verified Netflix, Disney+, and Prime Video streaming guide.`,
  };
}

export default async function CountryHomePage({ params, searchParams }) {
  const { country } = await params;
  const { q, genre, type } = await searchParams;
  const countryCode = (country || 'us').toLowerCase();
  const countryUpper = countryCode.toUpperCase();

  // 1. SEARCH RESULTS (With endless pagination)
  if (q) {
    const searchResults = await searchMovies(q, 1);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link href={`/${countryCode}`} className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Search</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 font-heading">
                <Search className="w-6 h-6 text-cyan-400" />
                <span>Results for &ldquo;{q}&rdquo;</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Explore endless matching movies across TMDB database on WatchRelax
              </p>
            </div>
            <div className="w-full sm:w-80">
              <SearchBar defaultValue={q} />
            </div>
          </div>
        </div>

        <InfiniteMovieGrid
          key={`search-${q}`}
          initialMovies={searchResults}
          type="search"
          query={q}
          country={countryCode}
          emptyMessage={`No movies found matching "${q}". Try a different title or franchise.`}
        />
      </div>
    );
  }

  // 2. DEDICATED GENRE CATEGORY (With endless pagination)
  if (genre) {
    const matchedGenre = MOVIE_GENRES.find((g) => String(g.id) === String(genre) || g.slug === genre);
    const genreId = matchedGenre ? matchedGenre.id : genre;
    const genreName = matchedGenre ? matchedGenre.name : 'Category';

    const genreMovies = await getMoviesByGenre(genreId, 1);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link href={`/${countryCode}`} className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Genres</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">{genreName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 font-heading">
                <Flame className="w-6 h-6 text-cyan-400" />
                <span>{genreName} Movies</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Endless catalog of top-rated and trending {genreName.toLowerCase()} titles in {countryUpper}
              </p>
            </div>
            <Link
              href={`/${countryCode}`}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ← Back to Main Hub
            </Link>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Link
            href={`/${countryCode}`}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0"
          >
            All Movies
          </Link>
          {MOVIE_GENRES.map((g) => {
            const isActive = String(g.id) === String(genreId);
            return (
              <Link
                key={g.id}
                href={`/${countryCode}?genre=${g.id}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-[#f5c518] text-black shadow-md font-bold'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#f5c518]/40'
                }`}
              >
                {g.name}
              </Link>
            );
          })}
        </div>

        <InfiniteMovieGrid
          key={`genre-${genreId}`}
          initialMovies={genreMovies}
          type="genre"
          genreId={genreId}
          country={countryCode}
          emptyMessage={`No movies currently found in ${genreName}.`}
        />
      </div>
    );
  }

  // 3. DEDICATED TYPE CATEGORY (e.g. ?type=trending, ?type=now_playing, ?type=top_rated)
  if (type) {
    let typeTitle = 'Featured Movies';
    let initialTypeMovies = [];

    if (type === 'trending') {
      typeTitle = 'Endless Trending Movies Today';
      initialTypeMovies = await getTrendingMovies('day', 1);
    } else if (type === 'now_playing') {
      typeTitle = `In Theaters & Now Playing in ${countryUpper}`;
      initialTypeMovies = await getNowPlayingMovies(countryCode, 1);
    } else if (type === 'top_rated') {
      typeTitle = 'All-Time Highest Rated Masterpieces';
      initialTypeMovies = await getTopRatedMovies(1);
    }

    if (initialTypeMovies.length > 0) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
              <Link href={`/${countryCode}`} className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white">{typeTitle}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading">{typeTitle}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Click &ldquo;Show More Movies&rdquo; at the bottom for endless titles
                </p>
              </div>
              <Link
                href={`/${countryCode}`}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                ← Back to Main Hub
              </Link>
            </div>
          </div>

          <InfiniteMovieGrid
            key={`type-${type}`}
            initialMovies={initialTypeMovies}
            type={type}
            country={countryCode}
          />
        </div>
      );
    }
  }

  // 4. DEFAULT MULTI-SECTION ENTERTAINMENT SHOWCASE
  const [
    trending,
    nowPlaying,
    topRated,
    sciFiMovies,
    horrorMovies,
    allPopular
  ] = await Promise.all([
    getTrendingMovies('day', 1),
    getNowPlayingMovies(countryCode, 1),
    getTopRatedMovies(1),
    getMoviesByGenre(878, 1), // Sci-Fi
    getMoviesByGenre(27, 1),  // Horror
    getPopularMovies(1),
  ]);

  const featured = trending[0] || allPopular[0] || null;

  return (
    <div className="space-y-8 sm:space-y-12 pb-20 sm:pb-24">
      {/* FEATURED #1 TRENDING HERO BANNER */}
      {featured && (
        <section className="relative w-full h-[55vh] sm:h-[65vh] min-h-[460px] max-h-[700px] overflow-hidden flex items-end">
          {featured.backdrop_path && (
            <Image
              src={tmdbImage(featured.backdrop_path, 'original')}
              alt={featured.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-top opacity-35 filter brightness-75 scale-105 transform motion-safe:animate-pulse"
              style={{ animationDuration: '8s' }}
            />
          )}

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e1015] via-transparent to-transparent" />

          {/* Featured Content Overlay */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 w-full space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5c518]/15 text-[#f5c518] border border-[#f5c518]/30 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Worldwide</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-3xl drop-shadow-lg font-heading leading-tight">
              {featured.title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl line-clamp-2 sm:line-clamp-3">
              {featured.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href={`/${countryCode}/movie/${getMovieSlug(featured.id, featured.title)}`}
                className="inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#f5c518] hover:bg-[#e2b616] text-black font-bold text-xs sm:text-sm shadow-xl shadow-yellow-500/20 transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Watch Trailer &amp; Guide</span>
              </Link>

              {featured.vote_average > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-[#f5c518] bg-[#f5c518]/10 px-3 py-2 rounded-xl border border-[#f5c518]/25 font-bold">
                  <Star className="w-3.5 h-3.5 fill-[#f5c518]" />
                  <span>{featured.vote_average.toFixed(1)} / 10</span>
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SEARCH & INTERACTIVE CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        <div className="block md:hidden">
          <SearchBar placeholder="Search any movie, franchise, or title..." />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Browse by Category</span>
            <span className="text-[11px] text-[#f5c518]">Instant Filter</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Link
              href={`/${countryCode}`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#f5c518] text-black shadow-md flex-shrink-0"
            >
              All Movies
            </Link>
            {MOVIE_GENRES.map((g) => (
              <Link
                key={g.id}
                href={`/${countryCode}?genre=${g.id}`}
                className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-white/10 transition-all flex-shrink-0"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: TRENDING TODAY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MovieShelf
          title="Trending Today"
          subtitle="Top movies capturing viral audience attention right now"
          iconName="trending"
          movies={trending}
          country={countryCode}
          seeAllHref={`/${countryCode}?type=trending`}
        />
      </div>

      {/* SECTION 2: IN THEATERS & NOW PLAYING */}
      {nowPlaying.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MovieShelf
            title={`Now Playing in Theaters (${countryUpper})`}
            subtitle="The latest big-screen studio releases hitting cinemas"
            iconName="clapperboard"
            movies={nowPlaying}
            country={countryCode}
            seeAllHref={`/${countryCode}?type=now_playing`}
          />
        </div>
      )}

      {/* SECTION 3: TOP RATED MASTERPIECES */}
      {topRated.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MovieShelf
            title="All-Time Classics & Top Rated"
            subtitle="Critically acclaimed cinematic masterpieces ranked by viewers worldwide"
            iconName="star"
            movies={topRated}
            country={countryCode}
            seeAllHref={`/${countryCode}?type=top_rated`}
          />
        </div>
      )}

      {/* SECTION 4: SCI-FI & FANTASY */}
      {sciFiMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MovieShelf
            title="Sci-Fi & Futuristic Thrillers"
            subtitle="Mind-bending concepts, outer space, and AI adventures"
            iconName="rocket"
            movies={sciFiMovies}
            country={countryCode}
            seeAllHref={`/${countryCode}?genre=878`}
          />
        </div>
      )}

      {/* SECTION 5: HORROR & SUSPENSE */}
      {horrorMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MovieShelf
            title="Horror & Psychological Chillers"
            subtitle="Paranormal hauntings, dark mysteries, and adrenaline rushes"
            iconName="ghost"
            movies={horrorMovies}
            country={countryCode}
            seeAllHref={`/${countryCode}?genre=27`}
          />
        </div>
      )}

      {/* SECTION 6: NEVER-ENDING "EXPLORE ALL MOVIES" WITH NEXT BUTTON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 pt-4 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Explore All Movies (Never-Ending Library)
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 pl-4">
              Browse the complete movie catalog. Click &ldquo;Show More Movies&rdquo; to load endless titles.
            </p>
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Legal Streaming Guide</span>
          </div>
        </div>

        {/* Endless Movie Grid with Next/Show More button */}
        <InfiniteMovieGrid
          key="popular-all"
          initialMovies={allPopular}
          type="popular"
          country={countryCode}
        />
      </section>

      {/* VALUE PROPOSITION FOOTER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-6 sm:p-8 bg-[#16171d] border border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left shadow-lg">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-[#f5c518] flex items-center justify-center mx-auto md:mx-0">
              <Play className="w-5 h-5 fill-[#f5c518]" />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">Direct 4K Studio Trailers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zero compression loss. Instant official teaser and trailer streams directly from Sony, Warner Bros, Universal, and Marvel.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">100% Legal Streaming</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Find where films are actually streaming on Netflix, Prime Video, Disney+, Apple TV+, and ad-supported free channels.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#f5c518] flex items-center justify-center mx-auto md:mx-0">
              <Sparkles className="w-5 h-5 text-[#f5c518]" />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">In-Depth Editorial Analysis</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Confused by what you just watched? Access comprehensive spoiler breakdowns, director explanations, and hidden clues.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
