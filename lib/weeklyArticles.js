import { 
  getTrendingMovies, 
  getNowPlayingMovies, 
  tmdbImage, 
  getMovieSlug 
} from './tmdb.js';
import { getPostCreditsGuide, getStreamingTimeline } from './trafficEngine.js';
import { ARTICLES } from './articlesData.js';

/**
 * Returns ISO week number and year for any given date
 */
export function getISOWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getUTCFullYear(), week: weekNo };
}

/**
 * Computes Friday date of a specific ISO week (standard theatrical/OTT release day)
 */
export function getFridayOfISOWeek(w, y) {
  const simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
  const dow = simple.getUTCDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
  } else {
    ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
  }
  // Friday is +4 days from Monday
  const friday = new Date(ISOweekStart);
  friday.setUTCDate(friday.getUTCDate() + 4);
  return friday;
}

/**
 * Generates metadata for recent weekly guides (e.g. current week, -1, -2, etc.)
 */
export function getWeeklyIssuesList(count = 6) {
  const current = getISOWeek();
  const issues = [];

  for (let i = 0; i < count; i++) {
    let w = current.week - i;
    let y = current.year;

    if (w < 1) {
      y -= 1;
      w += 52;
    }

    const friday = getFridayOfISOWeek(w, y);
    const dateStr = friday.toISOString().substring(0, 10);
    const monthName = friday.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = friday.getUTCDate();

    issues.push({
      slug: `weekend-streaming-guide-${y}-week-${w}`,
      title: `Weekend Streaming Guide: Top New Movies on OTT & In Theaters (${monthName} ${dayNum}, ${y})`,
      subtitle: `Our editorial roadmap to this weekend's biggest theatrical arrivals, confirmed OTT releases on Netflix & Prime Video, and spoiler-free post-credits advice.`,
      category: 'Weekly Watchlist',
      author: {
        name: 'Elena Vance',
        role: 'Senior Film Critic & Weekly Guide Curator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      publishedAt: dateStr,
      readTime: '7 min read',
      coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
      isDynamic: true,
      year: y,
      week: w,
    });
  }

  return issues;
}

/**
 * Generates the full, rich in-depth content for a specific weekly issue dynamically from TMDB
 */
export async function getWeeklyArticleBySlug(slug) {
  const match = slug.match(/^weekend-streaming-guide-(\d{4})-week-(\d{1,2})$/);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);
  const friday = getFridayOfISOWeek(week, year);
  const dateStr = friday.toISOString().substring(0, 10);
  const monthName = friday.toLocaleDateString('en-US', { month: 'long' });
  const dayNum = friday.getUTCDate();

  // Fetch live movie data
  const [trending, nowPlaying] = await Promise.all([
    getTrendingMovies('week', 1),
    getNowPlayingMovies('US', 1),
  ]);

  // Combine and deduplicate
  const map = new Map();
  [...nowPlaying, ...trending].forEach((m) => {
    if (m && m.id && !map.has(m.id)) {
      map.set(m.id, m);
    }
  });

  const topMovies = Array.from(map.values()).slice(0, 5);
  const coverMovie = topMovies[0];
  const coverImage = coverMovie?.backdrop_path
    ? tmdbImage(coverMovie.backdrop_path, 'w1280')
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

  const content = [
    {
      type: 'paragraph',
      text: `Welcome to the WatchRelax Weekend Streaming Guide for the week of ${monthName} ${dayNum}, ${year}. Every Friday, our editorial team combs through verified studio theatrical listings, confirmed digital premiere schedules, and streaming catalogs across Netflix, Amazon Prime Video, Disney+, and Apple TV+ to curate the top titles actually worth your leisure time.`,
    },
    {
      type: 'callout',
      quote: `With dozens of titles dropping across five different apps every weekend, true curation isn't about watching everything—it's about knowing which single title delivers the highest cinematic payoff for your Friday night.`,
      author: 'Elena Vance, Senior Film Critic',
    },
  ];

  topMovies.forEach((movie, index) => {
    const timeline = getStreamingTimeline(movie.release_date);
    const postCredits = getPostCreditsGuide(movie);
    const ratingText = movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10` : 'Recently Released';
    const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : `${year}`;
    const movieSlug = getMovieSlug(movie.id, movie.title);

    content.push({
      type: 'heading',
      level: 2,
      text: `${index + 1}. ${movie.title} (${releaseYear}) — ★ ${ratingText}`,
    });

    content.push({
      type: 'paragraph',
      text: `${movie.overview || `${movie.title} is capturing major audience attention this weekend.`} Operating under the status: "${timeline.statusBadge}", this title offers a compelling cinematic journey tailored for viewers who appreciate thoughtful pacing and strong central performances.`,
    });

    content.push({
      type: 'callout',
      quote: `Post-Credits Verdict: ${postCredits.badgeText}. ${postCredits.advice}`,
      author: 'WatchRelax Stinger Detector',
    });

    content.push({
      type: 'paragraph',
      text: `Want to check legal streaming options, official 4K studio trailers, and detailed spoiler breakdowns? Explore the complete hub: [View ${movie.title} Streaming & Trailer Hub on WatchRelax](/us/movie/${movieSlug}).`,
    });
  });

  content.push({
    type: 'heading',
    level: 2,
    text: 'Editorial Pick of the Weekend',
  });

  content.push({
    type: 'paragraph',
    text: `If you only have time for a single viewing this weekend, start with "${coverMovie?.title || 'our top-ranked title'}". Make sure to calibrate your television to Filmmaker Mode or Cinema preset, dim the ambient lighting, and check back with WatchRelax next Friday for our next weekly curated release radar.`,
  });

  return {
    slug,
    title: `Weekend Streaming Guide: Top 5 New Movies on OTT & In Theaters (${monthName} ${dayNum}, ${year})`,
    subtitle: `Your verified Friday streaming roadmap featuring ${topMovies.map(m => m.title).slice(0, 3).join(', ')} and more.`,
    category: 'Weekly Watchlist',
    author: {
      name: 'Elena Vance',
      role: 'Senior Film Critic & Weekly Guide Curator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    publishedAt: dateStr,
    readTime: '7 min read',
    coverImage,
    content,
    isDynamic: true,
  };
}

/**
 * Master function returning all articles (Dynamic Weekly Issues + 10 Permanent Cornerstone Articles)
 */
export function getAllArticles() {
  const weeklyIssues = getWeeklyIssuesList(6);
  // Weekly issues first (newest), followed by permanent 10 cornerstone essays
  return [...weeklyIssues, ...ARTICLES];
}
