import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Play, 
  Tv, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Star, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  Share2
} from 'lucide-react';
import { 
  getMovieDetails, 
  extractOfficialTrailer, 
  extractWatchProviders, 
  tmdbImage, 
  extractMovieId, 
  getMovieSlug 
} from '@/lib/tmdb';
import { 
  getStreamingTimeline, 
  getPostCreditsGuide, 
  generateMovieFaqs, 
  getDownloadGuide, 
  generateMovieEditorialBlog 
} from '@/lib/trafficEngine';
import StreamingTimeline from '@/components/StreamingTimeline';
import PostCreditsBadge from '@/components/PostCreditsBadge';
import MovieFaqAccordion from '@/components/MovieFaqAccordion';
import CastWindow from '@/components/CastWindow';
import DownloadGuide from '@/components/DownloadGuide';
import MovieEditorialBlog from '@/components/MovieEditorialBlog';

const EDITORIAL_BASE_URL = process.env.NEXT_PUBLIC_EDITORIAL_SITE_URL || 'https://editorial-moviesite.com';

/**
 * High-Intent Programmatic SEO Metadata
 * Targets exact search queries: "[Movie] OTT Release Date, Where to Watch & Streaming Guide ([Country])"
 */
export async function generateMetadata({ params }) {
  const { country, id } = await params;
  const movieId = extractMovieId(id);
  const movie = await getMovieDetails(movieId);

  if (!movie) {
    return {
      title: 'Movie Not Found | WatchRelax',
    };
  }

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
  const countryUpper = (country || 'US').toUpperCase();
  const backdropUrl = tmdbImage(movie.backdrop_path, 'w1280') || tmdbImage(movie.poster_path, 'w780');

  // Exact high-volume query format targeting streaming, downloading, and editorial reviews
  const title = `${movie.title} (${releaseYear}) OTT Release Date, Where to Watch & Download in ${countryUpper}`;
  const description = `Find where to stream or legally download ${movie.title} (${releaseYear}) offline on Netflix, Prime Video, or Apple TV in ${countryUpper}. Read verified OTT release dates, ending explained analysis, post-credits guide, and official 4K trailer.`;

  return {
    title,
    description,
    keywords: [
      `${movie.title} where to watch online`,
      `where to watch ${movie.title} in ${countryUpper}`,
      `${movie.title} ott release date`,
      `${movie.title} ott release date and platform`,
      `is ${movie.title} on netflix`,
      `is ${movie.title} on prime video`,
      `${movie.title} streaming release date`,
      `where can i stream ${movie.title} free`,
      `${movie.title} full movie stream hd`,
      `how to download ${movie.title} legally offline`,
      `${movie.title} offline viewing guide`,
      `does ${movie.title} have a post credits scene`,
      `${movie.title} mid credits scene explained`,
      `${movie.title} ending explained spoiler breakdown`,
      `${movie.title} review and rating`,
      `${movie.title} official 4k trailer youtube`,
      `${movie.title} cast and director`,
    ],
    openGraph: {
      title,
      description,
      type: 'video.movie',
      images: backdropUrl ? [{ url: backdropUrl, width: 1280, height: 720, alt: movie.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: backdropUrl ? [backdropUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site'}/${(country || 'us').toLowerCase()}/movie/${getMovieSlug(movie.id, movie.title)}`,
    },
  };
}

export default async function MovieDetailPage({ params }) {
  const { country, id } = await params;
  const movieId = extractMovieId(id);
  const movie = await getMovieDetails(movieId);

  if (!movie) {
    notFound();
  }

  const countryUpper = (country || 'US').toUpperCase();
  const countryCode = (country || 'us').toLowerCase();
  const trailer = extractOfficialTrailer(movie.videos);
  const providers = extractWatchProviders(movie['watch/providers'], countryUpper);
  const backdropUrl = tmdbImage(movie.backdrop_path, 'w1280');
  const posterUrl = tmdbImage(movie.poster_path, 'w780');
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const runtimeHours = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  // Key Crew & Cast for IMDb-style Factsheet
  const directors = movie.credits?.crew?.filter((c) => c.job === 'Director') || [];
  const writers = movie.credits?.crew?.filter((c) => ['Screenplay', 'Writer', 'Story', 'Novel'].includes(c.job)) || [];
  const topCast = movie.credits?.cast?.slice(0, 4) || [];

  // Programmatic Traffic Engines
  const timeline = getStreamingTimeline(movie.release_date, movie.production_companies);
  const postCredits = getPostCreditsGuide(movie);
  const faqs = generateMovieFaqs(movie, countryUpper, timeline, postCredits, providers);
  const downloadGuide = getDownloadGuide(movie, providers, timeline, countryUpper);
  const editorialBlog = generateMovieEditorialBlog(movie, timeline, postCredits, providers, countryUpper);

  // Destination CTA link to editorial monetized review site
  const editorialSlug = encodeURIComponent(
    `${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ending-explained-spoiler-review`
  );
  const editorialRedirectUrl = `${EDITORIAL_BASE_URL}/reviews/${movie.id}-${editorialSlug}?utm_source=watchrelax&utm_medium=referral&utm_campaign=hub_bridge`;

  // Comprehensive Schema.org: Movie + VideoObject + FAQPage + BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Movie',
        name: movie.title,
        description: movie.overview,
        image: backdropUrl || posterUrl,
        datePublished: movie.release_date,
        aggregateRating: movie.vote_average
          ? {
              '@type': 'AggregateRating',
              ratingValue: movie.vote_average.toFixed(1),
              bestRating: '10',
              worstRating: '1',
              ratingCount: movie.vote_count,
            }
          : undefined,
        trailer: trailer
          ? {
              '@type': 'VideoObject',
              name: `${movie.title} Official Trailer`,
              description: `Watch the official trailer for ${movie.title}`,
              thumbnailUrl: `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`,
              embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
              uploadDate: trailer.published_at || movie.release_date,
            }
          : undefined,
      },
      {
        '@type': 'BlogPosting',
        headline: editorialBlog.headline,
        description: movie.overview,
        articleBody: editorialBlog.sections.map((s) => `${s.heading}: ${s.content}`).join('\n\n'),
        author: {
          '@type': 'Organization',
          name: 'WatchRelax Editorial Desk',
          url: 'https://watchrelax.site',
        },
        publisher: {
          '@type': 'Organization',
          name: 'WatchRelax',
          logo: {
            '@type': 'ImageObject',
            url: 'https://watchrelax.site/favicon.ico',
          },
        },
        datePublished: movie.release_date || '2026-01-01',
        dateModified: new Date().toISOString(),
        image: backdropUrl || posterUrl,
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="relative min-h-screen pb-24 bg-[#0e1015] text-slate-100">
        {/* ATMOSPHERIC SUBTLE BACKDROP GLOW (Never pushes content down) */}
        {backdropUrl && (
          <div className="absolute top-0 inset-x-0 h-[480px] overflow-hidden pointer-events-none opacity-20 filter blur-2xl">
            <Image
              src={backdropUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0e1015]/80 to-[#0e1015]" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
          
          {/* TOP BREADCRUMB NAVIGATION */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Link
                href={`/${countryCode}`}
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Movies</span>
              </Link>
              <span>/</span>
              <span className="text-zinc-500 uppercase">{countryUpper}</span>
              <span>/</span>
              <span className="text-zinc-200 font-medium truncate max-w-[200px] sm:max-w-xs">
                {movie.title}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Verified Streaming Radar</span>
            </div>
          </nav>

          {/* IMDB-STYLE TITLE & RATING HEADER */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="space-y-2 max-w-4xl">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-300">
                <span className="font-semibold text-white">{releaseYear}</span>
                <span className="text-zinc-600">•</span>
                {runtimeHours && (
                  <>
                    <span>{runtimeHours}</span>
                    <span className="text-zinc-600">•</span>
                  </>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-200 font-medium text-xs border border-white/10">
                  {timeline.status === 'in_theaters'
                    ? 'In Theaters'
                    : timeline.status === 'streaming_now'
                    ? 'Streaming Now'
                    : 'Digital Premiere'}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 text-xs">
                  Region: <strong className="text-white uppercase">{countryUpper}</strong>
                </span>
              </div>
            </div>

            {/* IMDB / TMDB RATING BLOCK */}
            <div className="flex items-center gap-6 self-start md:self-end">
              {movie.vote_average > 0 && (
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    IMDb / TMDB Rating
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-[#f5c518] text-[#f5c518]" />
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-black text-white">
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="text-xs text-zinc-400 font-normal">/10</span>
                    </div>
                  </div>
                  {movie.vote_count > 0 && (
                    <span className="text-[11px] text-zinc-400">
                      {movie.vote_count > 999
                        ? `${(movie.vote_count / 1000).toFixed(1)}K votes`
                        : `${movie.vote_count} votes`}
                    </span>
                  )}
                </div>
              )}

              {/* Status / Quick Action Badge */}
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Watch Availability
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{providers.flatrate.length > 0 ? 'On Subscription' : timeline.status === 'in_theaters' ? 'In Cinemas' : 'VOD / Rent'}</span>
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* ZERO-SCROLL ABOVE-THE-FOLD MEDIA HERO */}
          {/* Desktop: Vertical Poster + 4K YouTube Trailer Side-by-Side */}
          {/* Mobile: Full-Width Trailer Directly at the Top! No Scrolling Required! */}
          <section aria-label="Media Trailer and Poster" className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
              
              {/* DESKTOP POSTER CARD (Left 3.5 cols) */}
              <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#16171d]">
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      priority
                      sizes="(max-width: 1280px) 320px, 360px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                      No Poster Available
                    </div>
                  )}

                  {/* Subtle Poster Badge */}
                  <div className="absolute bottom-3 inset-x-3 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-center">
                    <span className="text-xs font-semibold text-zinc-200">
                      Official Theatrical Poster
                    </span>
                  </div>
                </div>
              </div>

              {/* 4K YOUTUBE TRAILER PLAYER (Right 8.5 cols on desktop, 100% full-width on mobile) */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-between">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/95 shadow-2xl border border-white/10">
                  {trailer ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&modestbranding=1&playsinline=1`}
                      title={`${movie.title} Official Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  ) : backdropUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={backdropUrl}
                        alt={movie.title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#f5c518] text-black flex items-center justify-center shadow-xl shadow-yellow-500/20 mb-3">
                          <Play className="w-7 h-7 fill-black ml-1" />
                        </div>
                        <p className="text-white font-bold text-lg">Official Studio Trailer Coming Soon</p>
                        <p className="text-xs text-zinc-300 mt-1 max-w-sm">
                          Explore confirmed OTT streaming dates and legal download options below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-6 text-center">
                      <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
                      <p className="text-sm font-semibold text-zinc-300">Official trailer currently unavailable.</p>
                    </div>
                  )}
                </div>

                {/* Video Subtitle & Quality Bar */}
                <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-400 px-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                    <span className="font-semibold text-white truncate">
                      {trailer ? trailer.name : `${movie.title} Official Trailer`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-medium text-zinc-300">
                      4K Ultra HD
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-medium text-zinc-300">
                      Official Audio
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* MOBILE ONLY: Compact Poster + Tagline + Film Personnel Quick Card */}
            <div className="flex lg:hidden items-start gap-3.5 p-3.5 rounded-xl bg-[#16171d] border border-white/[0.08] mt-3">
              {posterUrl && (
                <div className="relative aspect-[2/3] w-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-md bg-zinc-900">
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                {movie.tagline && (
                  <p className="italic text-zinc-300 font-light line-clamp-2">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
                {directors.length > 0 && (
                  <p className="text-zinc-400">
                    Director: <strong className="text-white font-medium">{directors.map(d => d.name).join(', ')}</strong>
                  </p>
                )}
                {topCast.length > 0 && (
                  <p className="text-zinc-400 line-clamp-1">
                    Stars: <span className="text-zinc-200">{topCast.map(c => c.name).join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* GENRE PILLS & WEB STORY BAR */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Link
              href={`/stories/${getMovieSlug(movie.id, movie.title)}`}
              target="_blank"
              className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#f5c518]/15 hover:bg-[#f5c518]/25 text-[#f5c518] border border-[#f5c518]/30 transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Web Story</span>
            </Link>
            {movie.genres && movie.genres.map((g) => (
              <Link
                key={g.id}
                href={`/${countryCode}?genre=${g.id}`}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#1c1e26] hover:bg-[#252834] text-zinc-200 border border-white/[0.08] hover:border-[#f5c518]/50 transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>

          {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* LEFT 8 COLUMNS: Storyline, Streaming Radar, Cast, Timeline, Download, FAQs */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* STORYLINE & KEY FILM PERSONNEL (IMDb Trademark Section) */}
              <section className="p-6 rounded-2xl bg-[#16171d] border border-white/[0.08] space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 bg-[#f5c518] rounded-full" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Storyline</h2>
                </div>
                
                <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                  {movie.overview || 'No synopsis provided for this title.'}
                </p>

                {movie.tagline && (
                  <p className="text-xs sm:text-sm italic text-zinc-400 border-l-2 border-[#f5c518] pl-3 py-0.5">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}

                {/* Director, Writers, and Stars Rows (Classic IMDb Format) */}
                <div className="divide-y divide-white/[0.08] pt-2 text-xs sm:text-sm">
                  {directors.length > 0 && (
                    <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="font-bold text-white min-w-[90px]">Director</span>
                      <span className="text-zinc-300">{directors.map(d => d.name).join(', ')}</span>
                    </div>
                  )}
                  {writers.length > 0 && (
                    <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="font-bold text-white min-w-[90px]">Writers</span>
                      <span className="text-zinc-300">{writers.slice(0, 3).map(w => w.name).join(', ')}</span>
                    </div>
                  )}
                  {topCast.length > 0 && (
                    <div className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="font-bold text-white min-w-[90px]">Stars</span>
                      <span className="text-zinc-300">{topCast.map(c => c.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* POST-CREDITS SCENE DETECTOR */}
              <PostCreditsBadge guide={postCredits} />

              {/* WHERE TO STREAM IN [COUNTRY] (JUSTWATCH VERIFIED LEGAL RADAR) */}
              <section className="p-6 rounded-2xl bg-[#16171d] border border-white/[0.08] space-y-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-[#f5c518] rounded-full" />
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Where to Watch in {countryUpper}
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Verified legal platforms. No pirated mirrors or deceptive download links.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold self-start sm:self-auto">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Legal</span>
                  </div>
                </div>

                {/* Subscription Streaming (Flatrate) */}
                {providers.flatrate.length > 0 ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      <span>Subscription Streaming</span>
                      <span className="text-emerald-400 font-semibold text-[11px]">HD / 4K Ultra HD</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {providers.flatrate.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#f5c518]/40 hover:bg-white/[0.07] transition-all"
                        >
                          {provider.logo_path && (
                            <Image
                              src={tmdbImage(provider.logo_path, 'w92')}
                              alt={provider.provider_name}
                              width={36}
                              height={36}
                              className="rounded-lg shadow-sm flex-shrink-0"
                            />
                          )}
                          <span className="text-xs font-semibold text-white truncate">
                            {provider.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400 text-center">
                    Not currently available on subscription services in {countryUpper}. Check verified digital rent or purchase options below.
                  </div>
                )}

                {/* Free with Ads (Tubi, Pluto, Freevee) */}
                {providers.free && providers.free.length > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Watch 100% Free Legally (With Ads)</span>
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {providers.free.map((provider) => (
                        <div
                          key={provider.provider_id}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30"
                        >
                          {provider.logo_path && (
                            <Image
                              src={tmdbImage(provider.logo_path, 'w92')}
                              alt={provider.provider_name}
                              width={32}
                              height={32}
                              className="rounded-lg"
                            />
                          )}
                          <span className="text-xs font-semibold text-emerald-300 truncate">
                            {provider.provider_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Digital Rent or Buy */}
                {(providers.rent.length > 0 || providers.buy.length > 0) && (
                  <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Digital Rent or Buy
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {[...providers.rent, ...providers.buy]
                        .filter((v, i, a) => a.findIndex((t) => t.provider_id === v.provider_id) === i)
                        .map((provider) => (
                          <div
                            key={provider.provider_id}
                            className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]"
                          >
                            {provider.logo_path && (
                              <Image
                                src={tmdbImage(provider.logo_path, 'w92')}
                                alt={provider.provider_name}
                                width={26}
                                height={26}
                                className="rounded"
                              />
                            )}
                            <span className="text-xs font-medium text-zinc-300 pr-1">
                              {provider.provider_name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {providers.link && (
                  <div className="pt-2 text-center border-t border-white/[0.06]">
                    <a
                      href={providers.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Streaming data powered by JustWatch &amp; TMDB</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </section>

              {/* TOP CAST & CREW WINDOW (IMDb Style) */}
              <CastWindow credits={movie.credits} />

              {/* OTT & STREAMING RELEASE TIMELINE TRACKER */}
              <StreamingTimeline timeline={timeline} title={movie.title} />

              {/* OFFLINE DOWNLOAD GUIDE */}
              <DownloadGuide guide={downloadGuide} title={movie.title} />

              {/* EDITORIAL DISCUSSION BRIDGE */}
              <section className="rounded-2xl bg-gradient-to-r from-[#181a22] to-[#1e202c] border border-white/[0.08] p-6 sm:p-7 shadow-lg">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 text-zinc-300 text-xs font-medium border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-[#f5c518]" />
                    <span>Film Breakdown &amp; Analysis</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Looking for a deeper breakdown of {movie.title}?
                  </h3>
                  <p className="text-sm text-zinc-300">
                    Explore ending analysis, narrative themes, and hidden Easter eggs decoded by film critics.
                  </p>
                  <div className="pt-2">
                    <a
                      href={editorialRedirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f5c518] hover:bg-[#e2b616] text-black font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-[1.01]"
                    >
                      <span>Read Ending Explained &amp; Spoilers</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </section>

              {/* IN-DEPTH EDITORIAL MOVIE GUIDE & BLOG */}
              <MovieEditorialBlog blog={editorialBlog} title={movie.title} />

              {/* GOOGLE FAQ ACCORDION */}
              <MovieFaqAccordion faqs={faqs} />
            </div>

            {/* RIGHT 4 COLUMNS: Sticky Details & Specs Sidebar (IMDb Style) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* MOVIE DETAILS & SPECS (IMDb Box) */}
              <div className="rounded-2xl p-5 bg-[#16171d] border border-white/[0.08] space-y-4 shadow-lg lg:sticky lg:top-24">
                <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-3">
                  <div className="w-1.5 h-5 bg-[#f5c518] rounded-full" />
                  <h3 className="text-base font-bold text-white tracking-tight">Movie Details</h3>
                </div>

                <div className="divide-y divide-white/[0.06] text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-zinc-400">Release Date</span>
                    <span className="font-semibold text-white">{movie.release_date || 'TBA'}</span>
                  </div>
                  {movie.runtime > 0 && (
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-zinc-400">Runtime</span>
                      <span className="font-semibold text-white">{runtimeHours}</span>
                    </div>
                  )}
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="font-semibold text-emerald-400 capitalize">
                      {timeline.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {movie.original_language && (
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-zinc-400">Original Language</span>
                      <span className="font-semibold text-white uppercase">{movie.original_language}</span>
                    </div>
                  )}
                  {movie.budget > 0 && (
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-zinc-400">Budget</span>
                      <span className="font-semibold text-white">${(movie.budget / 1000000).toFixed(1)} Million</span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-zinc-400">Box Office</span>
                      <span className="font-semibold text-white">${(movie.revenue / 1000000).toFixed(1)} Million</span>
                    </div>
                  )}
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="py-2.5 flex flex-col gap-1">
                      <span className="text-zinc-400">Production</span>
                      <span className="font-semibold text-white">
                        {movie.production_companies.slice(0, 3).map(p => p.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick legal streaming callout */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% Verified Legal Guide</span>
                  </span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    WatchRelax partners with TMDB &amp; JustWatch to ensure all streams, theatrical dates, and downloads are official.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </article>
    </>
  );
}
