import { 
  getMovieDetails, 
  extractWatchProviders, 
  extractMovieId, 
  tmdbImage, 
  getMovieSlug 
} from '@/lib/tmdb';
import { getStreamingTimeline, getPostCreditsGuide } from '@/lib/trafficEngine';

export const dynamic = 'force-dynamic';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const movieId = extractMovieId(slug);

  if (!movieId) {
    return new Response('Invalid Movie Story Identifier', { status: 400 });
  }

  const movie = await getMovieDetails(movieId);
  if (!movie) {
    return new Response('Movie Story Not Found', { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';
  const movieSlug = getMovieSlug(movie.id, movie.title);
  const storyUrl = `${siteUrl}/stories/${movieSlug}`;
  const movieUrl = `${siteUrl}/us/movie/${movieSlug}`;

  const posterUrl = movie.poster_path
    ? tmdbImage(movie.poster_path, 'w780')
    : `${siteUrl}/icon.png`;
  const backdropUrl = movie.backdrop_path
    ? tmdbImage(movie.backdrop_path, 'w1280')
    : posterUrl;

  const timeline = getStreamingTimeline(movie.release_date, movie.production_companies);
  const postCredits = getPostCreditsGuide(movie);
  const providers = extractWatchProviders(movie['watch/providers'], 'US');

  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '2026';
  const ratingText = movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : 'Not Yet Rated';
  const genresText = (movie.genres || []).map((g) => g.name).slice(0, 3).join(' • ');
  const platformsText = (providers.flatrate || [])
    .map((p) => p.provider_name)
    .slice(0, 4)
    .join(', ');

  const titleEsc = escapeHtml(movie.title);
  const overviewEsc = escapeHtml(
    movie.overview && movie.overview.length > 280
      ? movie.overview.substring(0, 277) + '...'
      : movie.overview || 'Discover official trailers, release dates, and streaming guide on WatchRelax.'
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: storyUrl,
    headline: `${movie.title}: Official 4K Trailer, OTT Release & Streaming Guide`,
    datePublished: movie.release_date ? `${movie.release_date}T00:00:00Z` : new Date().toISOString(),
    dateModified: new Date().toISOString(),
    description: movie.overview,
    image: [posterUrl, backdropUrl],
    author: {
      '@type': 'Organization',
      name: 'WatchRelax Editorial Desk',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WatchRelax',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.png`,
      },
    },
  };

  const ampHtml = `<!doctype html>
<html ⚡ lang="en">
<head>
  <meta charset="utf-8">
  <title>${titleEsc} - Official 4K Trailer &amp; Where to Stream | WatchRelax Web Story</title>
  <link rel="canonical" href="${storyUrl}">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>

  <style amp-custom>
    amp-story {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #ffffff;
    }
    amp-story-page {
      background-color: #0e1015;
    }
    .scrim {
      background: linear-gradient(180deg, rgba(14,16,21,0.2) 0%, rgba(14,16,21,0.7) 50%, rgba(14,16,21,0.98) 100%);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      box-sizing: border-box;
    }
    .dark-scrim {
      background: linear-gradient(180deg, rgba(14,16,21,0.6) 0%, rgba(14,16,21,0.85) 60%, rgba(14,16,21,0.98) 100%);
      padding: 36px 24px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      box-sizing: border-box;
    }
    .brand-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(245, 197, 24, 0.15);
      border: 1px solid rgba(245, 197, 24, 0.4);
      color: #f5c518;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
      align-self: flex-start;
    }
    .badge-emerald {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
    }
    .badge-rose {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fb7185;
    }
    h1.title {
      font-size: 28px;
      line-height: 1.15;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 10px 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    }
    h2.slide-heading {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px 0;
    }
    p.desc {
      font-size: 14px;
      line-height: 1.5;
      color: #d1d5db;
      margin: 0 0 16px 0;
    }
    .meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 16px;
    }
    .rating-pill {
      background: #f5c518;
      color: #000000;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
    }
    .card-box {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #f5c518;
      margin-bottom: 6px;
    }
    .card-val {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
    }
    .tap-hint {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      margin-top: 8px;
    }
    .cta-btn {
      display: block;
      background: #f5c518;
      color: #000000;
      font-weight: 800;
      font-size: 14px;
      text-align: center;
      padding: 14px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(245, 197, 24, 0.35);
      margin-top: 8px;
    }
  </style>

  <script type="application/ld+json">
    ${JSON.stringify(jsonLd)}
  </script>
</head>
<body>
  <amp-story
    standalone
    title="${titleEsc} - 4K Trailer &amp; Streaming Guide"
    publisher="WatchRelax"
    publisher-logo-src="${siteUrl}/icon.png"
    poster-portrait-src="${posterUrl}"
  >
    <!-- SLIDE 1: Cover Slide -->
    <amp-story-page id="slide-1">
      <amp-story-grid-layer template="fill">
        <amp-img src="${posterUrl}" width="720" height="1280" layout="responsive" alt="${titleEsc} Poster"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="scrim">
        <div class="brand-badge">⚡ WatchRelax Official Guide</div>
        <h1 class="title">${titleEsc}</h1>
        <div class="meta-row">
          <span class="rating-pill">★ ${ratingText}</span>
          <span>${releaseYear}</span>
          <span>•</span>
          <span>${genresText}</span>
        </div>
        <p class="desc">Where to watch, official studio 4K trailer, OTT premiere schedule, and post-credits scene details.</p>
        <div class="tap-hint">Tap to see streaming release →</div>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- SLIDE 2: Streaming Availability & Timeline -->
    <amp-story-page id="slide-2">
      <amp-story-grid-layer template="fill">
        <amp-img src="${backdropUrl}" width="1280" height="720" layout="responsive" alt="${titleEsc} Backdrop"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="dark-scrim">
        <div class="brand-badge">Streaming Availability</div>
        <h2 class="slide-heading">Where Can You Watch It?</h2>
        
        <div class="card-box">
          <div class="card-title">Release Status</div>
          <div class="card-val">${escapeHtml(timeline.statusBadge)}</div>
        </div>

        <div class="card-box">
          <div class="card-title">Streaming &amp; VOD Platforms</div>
          <div class="card-val">
            ${platformsText ? escapeHtml(platformsText) : 'Coming to digital streaming platforms (Netflix, Prime, Disney+)'}
          </div>
        </div>

        <div class="tap-hint">Tap to view plot breakdown →</div>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- SLIDE 3: Storyline Premise -->
    <amp-story-page id="slide-3">
      <amp-story-grid-layer template="fill">
        <amp-img src="${posterUrl}" width="720" height="1280" layout="responsive" alt="${titleEsc} Premise"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="dark-scrim">
        <div class="brand-badge">Storyline &amp; Premise</div>
        <h2 class="slide-heading">${titleEsc} Synopsis</h2>
        <div class="card-box">
          <p class="desc" style="margin: 0; font-size: 13px; line-height: 1.6;">${overviewEsc}</p>
        </div>
        <div class="tap-hint">Tap for post-credits spoiler alert →</div>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- SLIDE 4: Post-Credits Scene Detector -->
    <amp-story-page id="slide-4">
      <amp-story-grid-layer template="fill">
        <amp-img src="${backdropUrl}" width="1280" height="720" layout="responsive" alt="${titleEsc} Post Credits"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="dark-scrim">
        <div class="brand-badge ${postCredits.hasPostCredits ? 'badge-emerald' : 'badge-rose'}">
          ${postCredits.hasPostCredits ? '✓ Post-Credits Alert' : '✕ No Post-Credits'}
        </div>
        <h2 class="slide-heading">Should You Stay Till the End?</h2>
        
        <div class="card-box">
          <div class="card-title">Stinger Status</div>
          <div class="card-val">${escapeHtml(postCredits.badgeText)}</div>
        </div>

        <p class="desc" style="font-size: 13px; line-height: 1.5;">${escapeHtml(postCredits.advice)}</p>

        <div class="tap-hint">Tap for official 4K trailer →</div>
      </amp-story-grid-layer>
    </amp-story-page>

    <!-- SLIDE 5: Watch Official Trailer & CTA -->
    <amp-story-page id="slide-5">
      <amp-story-grid-layer template="fill">
        <amp-img src="${posterUrl}" width="720" height="1280" layout="responsive" alt="${titleEsc} Watch Trailer"></amp-img>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" class="dark-scrim">
        <div class="brand-badge">Full Hub Available</div>
        <h2 class="slide-heading">Watch the Official 4K Trailer</h2>
        <p class="desc">Stream the verified studio trailer, browse cast details, and explore verified legal watch options on WatchRelax.</p>
        
        <div class="card-box" style="text-align: center;">
          <div class="card-title">Explore on WatchRelax</div>
          <div style="font-size: 13px; color: #d1d5db; margin-top: 4px;">Swipe up or click below to launch the streaming guide.</div>
        </div>
      </amp-story-grid-layer>

      <amp-story-page-outlink layout="nodisplay">
        <a href="${movieUrl}" target="_blank">Watch 4K Trailer &amp; Guide on WatchRelax</a>
      </amp-story-page-outlink>
    </amp-story-page>
  </amp-story>
</body>
</html>`;

  return new Response(ampHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600',
    },
  });
}

