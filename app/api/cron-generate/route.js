import { NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/tmdb';
import { generateTrendingHooksWithBedrock } from '@/lib/bedrock';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Max execution time for cron operations

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    const secret = searchParams.get('secret') || (authHeader ? authHeader.replace('Bearer ', '') : null);

    const EXPECTED_SECRET = process.env.CRON_SECRET;

    // Validate security secret to prevent unauthorized execution
    if (EXPECTED_SECRET && secret !== EXPECTED_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid CRON_SECRET' },
        { status: 401 }
      );
    }

    console.log('[Cron] Starting trend curation and Bedrock Llama 3.3 pipeline...');

    // 1. Fetch top 10 global trending movies from TMDB
    const trendingMovies = await getTrendingMovies('day');
    const top10 = trendingMovies.slice(0, 10);

    if (!top10.length) {
      return NextResponse.json(
        { error: 'No trending movies retrieved from TMDB' },
        { status: 502 }
      );
    }

    // 2. Generate non-clickbait, high-CTR burning questions via Bedrock Llama 3.3 70B
    const aiCuratedHooks = await generateTrendingHooksWithBedrock(top10);

    // 3. Assemble Social Media & Editorial Traffic Targets
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';
    const editorialSiteUrl = process.env.NEXT_PUBLIC_EDITORIAL_SITE_URL || 'https://editorial-moviesite.com';

    const distributionTargets = top10.map((movie) => {
      const hookData = aiCuratedHooks.find((h) => h.id === movie.id) || {
        burningQuestion: `Did you catch the hidden clue in the new ${movie.title} trailer?`,
        debateAngle: `Fans are debating the revelation in ${movie.title}`,
        socialHook: `The ending twist of ${movie.title} explained:`,
      };

      const hubUrl = `${siteUrl}/us/movie/${movie.id}`;
      const editorialBridgeUrl = `${editorialSiteUrl}/reviews/${movie.id}?utm_source=social_hijack`;

      return {
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        rating: movie.vote_average,
        hub_url: hubUrl,
        editorial_bridge_url: editorialBridgeUrl,
        social_hooks: {
          x_twitter: `${hookData.burningQuestion}\n\nWatch official 4K trailer & where to stream: ${hubUrl} #movies #${movie.title.replace(/[^a-zA-Z0-9]/g, '')}`,
          reddit_thread_prompt: `[Discussion] ${hookData.debateAngle} - Thoughts after watching the trailer?`,
          tiktok_caption: `${hookData.socialHook} Full breakdown & official stream info in bio! #movieclips #${movie.title.replace(/[^a-zA-Z0-9]/g, '')}`,
        },
      };
    });

    // 4. Trigger automated Google Sitemap Ping for rapid indexation
    let sitemapPingStatus = 'skipped';
    try {
      const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`);
      const storySitemapUrl = encodeURIComponent(`${siteUrl}/story-sitemap.xml`);
      await Promise.allSettled([
        fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`, { signal: AbortSignal.timeout(4000) }),
        fetch(`https://www.google.com/ping?sitemap=${storySitemapUrl}`, { signal: AbortSignal.timeout(4000) }),
      ]);
      sitemapPingStatus = 'success';
    } catch (e) {
      sitemapPingStatus = `ping_error: ${e.message}`;
    }

    console.log('[Cron] Execution complete. Generated targets for', distributionTargets.length, 'movies.');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      movies_processed: distributionTargets.length,
      sitemap_ping: sitemapPingStatus,
      targets: distributionTargets,
    });
  } catch (error) {
    console.error('[Cron] Unhandled error in cron-generate:', error);
    return NextResponse.json(
      { error: 'Internal cron execution failure', message: error.message },
      { status: 500 }
    );
  }
}
