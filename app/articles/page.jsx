import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Sparkles, Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { getAllArticles } from '@/lib/weeklyArticles';

export const metadata = {
  title: 'Editorial Cinema Guides, Analysis & Streaming Essays | WatchRelax',
  description: 'In-depth film essays, box office analysis, home theater calibration, and curated streaming guides written by cinema critics.',
  openGraph: {
    title: 'WatchRelax Editorial Desk | Film Analysis & Streaming Guides',
    description: 'In-depth film essays, box office analysis, home theater calibration, and curated streaming guides.',
    type: 'website',
  },
};

export default function ArticlesIndexPage() {
  const allArticles = getAllArticles();
  const featuredArticle = allArticles[0];
  const remainingArticles = allArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10 sm:space-y-14">
      {/* Editorial Header */}
      <div className="space-y-3 border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5c518]/15 text-[#f5c518] border border-[#f5c518]/30 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>WatchRelax Editorial Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight">
          Film Essays, Analysis &amp; Streaming Guides
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
          Original cinema criticism, industry release window breakdowns, and spoiler-free viewing guides authored by our dedicated editorial team.
        </p>
      </div>

      {/* FEATURED LEAD ARTICLE */}
      {featuredArticle && (
        <article className="relative rounded-3xl overflow-hidden bg-[#16171d] border border-white/10 hover:border-[#f5c518]/50 transition-all duration-300 group shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Image Box */}
            <div className="relative aspect-[16/9] lg:aspect-auto lg:col-span-7 overflow-hidden bg-zinc-900 min-h-[300px] sm:min-h-[400px]">
              <Image
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16171d] via-transparent to-transparent lg:hidden" />
            </div>

            {/* Content Box */}
            <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f5c518] text-black uppercase tracking-wider">
                    {featuredArticle.category}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredArticle.readTime}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-[#f5c518] transition-colors leading-tight font-heading">
                  <Link href={`/articles/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                  {featuredArticle.subtitle}
                </p>
              </div>

              {/* Author & Read More */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-white/10">
                    <Image
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">{featuredArticle.author.name}</p>
                    <p className="text-[11px] text-zinc-400">{featuredArticle.publishedAt}</p>
                  </div>
                </div>

                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f5c518] hover:underline"
                >
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* REMAINING ARTICLES GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Latest Essays &amp; Guides
          </h2>
          <span className="text-xs text-zinc-400">{remainingArticles.length} Articles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {remainingArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl bg-[#16171d] border border-white/[0.08] hover:border-[#f5c518]/50 overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-lg"
            >
              <div>
                {/* Thumbnail */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="relative aspect-[16/10] w-full block overflow-hidden bg-zinc-900"
                >
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-[#f5c518] border border-white/10">
                    {article.category}
                  </div>
                </Link>

                {/* Article Header & Body */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.publishedAt}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#f5c518] transition-colors line-clamp-2 leading-snug font-heading">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="p-5 pt-0 mt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-zinc-800 border border-white/10">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-300 truncate max-w-[140px]">
                    {article.author.name}
                  </span>
                </div>

                <Link
                  href={`/articles/${article.slug}`}
                  className="text-xs font-semibold text-[#f5c518] hover:underline inline-flex items-center gap-1"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

