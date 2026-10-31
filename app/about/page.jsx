import Link from 'next/link';
import { Play, Sparkles, ShieldCheck, Film, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'About WatchRelax | Official Trailers & Legal Streaming Guide',
  description: 'Learn about WatchRelax, our editorial team, and our mission to provide clean, ad-free movie streaming discovery.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-zinc-300 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#f5c518] transition-colors mb-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5c518]/10 text-[#f5c518] border border-[#f5c518]/25 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">About WatchRelax</h1>
        <p className="text-sm text-zinc-400 mt-2">
          The clutter-free guide to where to watch movies, verified 4K trailers, and spoiler-free post-credits scenes.
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Why We Built WatchRelax</h2>
          <p>
            Finding where a movie is currently streaming shouldn&apos;t require reading 1,000-word clickbait articles 
            or dodging intrusive popups. When audiences finish a movie, they shouldn&apos;t get spoiled when trying to 
            find out whether to stay for a mid-credits or post-credits scene.
          </p>
          <p>
            We built <strong className="text-white">WatchRelax</strong> to solve these pain points with a clean, 
            lightning-fast dark-mode experience that prioritizes user time and film appreciation.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#f5c518]/10 text-[#f5c518] flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Verified 4K Trailers</h3>
            <p className="text-xs text-zinc-400">
              Only authentic studio trailers directly from verified distributor channels. No fan-made concept teasers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Legal Streams</h3>
            <p className="text-xs text-zinc-400">
              Accurate country-specific availability across Netflix, Prime Video, Disney+, Apple TV, and regional platforms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Spoiler-Free Guides</h3>
            <p className="text-xs text-zinc-400">
              Clear Yes/No tags for post-credits scenes and curated ending breakdowns when you want deeper analysis.
            </p>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="text-xl font-bold text-white">Editorial Desk &amp; Attribution</h2>
          <p>
            WatchRelax is maintained by cinephiles and software engineers passionate about film culture. 
            Movie data and platform availability are synchronized via TMDB API and JustWatch data.
          </p>
        </section>
      </div>
    </div>
  );
}
