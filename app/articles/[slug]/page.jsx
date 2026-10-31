import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, BookOpen, Share2 } from 'lucide-react';
import { ARTICLES } from '@/lib/articlesData';
import ShareBar from '@/components/ShareBar';

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return { title: 'Article Not Found | WatchRelax' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';
  const url = `${siteUrl}/articles/${article.slug}`;

  return {
    title: `${article.title} | WatchRelax Editorial`,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      url,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.subtitle,
      images: [article.coverImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;
  const otherArticles = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: articleUrl,
    headline: article.title,
    description: article.subtitle,
    image: [article.coverImage],
    datePublished: `${article.publishedAt}T08:00:00Z`,
    dateModified: `${article.publishedAt}T08:00:00Z`,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WatchRelax Editorial Desk',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen pb-20 bg-[#0e1015] text-zinc-100">
        {/* Top Breadcrumb & Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#f5c518] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Editorial Guides</span>
          </Link>

          {/* Article Header */}
          <header className="space-y-4 pb-6 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f5c518] text-black uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {article.publishedAt}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-lg text-zinc-300 font-light leading-relaxed">
              {article.subtitle}
            </p>

            {/* Author Byline & Social Share */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden bg-zinc-800 border border-white/15">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{article.author.name}</p>
                  <p className="text-xs text-zinc-400">{article.author.role}</p>
                </div>
              </div>

              <ShareBar title={article.title} url={`/articles/${article.slug}`} />
            </div>
          </header>
        </div>

        {/* Hero Cover Image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Main Editorial Content Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-base leading-relaxed text-zinc-300">
          {article.content.map((block, idx) => {
            if (block.type === 'paragraph') {
              return (
                <p key={idx} className="leading-relaxed sm:text-lg text-zinc-300 font-normal">
                  {block.text}
                </p>
              );
            }

            if (block.type === 'heading') {
              return (
                <h2
                  key={idx}
                  className="text-xl sm:text-3xl font-black text-white pt-6 border-t border-white/10 font-heading tracking-tight"
                >
                  {block.text}
                </h2>
              );
            }

            if (block.type === 'callout') {
              return (
                <blockquote
                  key={idx}
                  className="my-6 p-6 rounded-2xl bg-[#16171d] border-l-4 border-[#f5c518] text-white space-y-2 shadow-lg"
                >
                  <p className="text-base sm:text-lg italic font-medium leading-relaxed">
                    &ldquo;{block.quote}&rdquo;
                  </p>
                  {block.author && (
                    <footer className="text-xs text-[#f5c518] font-bold tracking-wider uppercase">
                      — {block.author}
                    </footer>
                  )}
                </blockquote>
              );
            }

            return null;
          })}

          {/* Editorial Disclosure Box */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400 space-y-1 mt-12">
            <p className="font-bold text-zinc-200">WatchRelax Editorial Ethics &amp; Standards:</p>
            <p className="leading-relaxed">
              This essay was independently produced and reviewed by the WatchRelax film editorial desk. 
              Our recommendations are never influenced by studio advertising. Streaming availability is verified 
              using official platform licenses and TMDB metadata.
            </p>
          </div>
        </div>

        {/* MORE ARTICLES SHELF */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 mt-16 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
              More From Our Editorial Desk
            </h3>
            <Link href="/articles" className="text-xs font-semibold text-[#f5c518] hover:underline">
              View All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherArticles.map((other) => (
              <Link
                key={other.slug}
                href={`/articles/${other.slug}`}
                className="group rounded-2xl bg-[#16171d] border border-white/[0.08] hover:border-[#f5c518]/50 overflow-hidden flex flex-col justify-between transition-all"
              >
                <div className="relative aspect-[16/10] w-full bg-zinc-900">
                  <Image
                    src={other.coverImage}
                    alt={other.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-[#f5c518]">
                    {other.category}
                  </div>
                </div>
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#f5c518] transition-colors line-clamp-2 leading-snug">
                    {other.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400">{other.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
