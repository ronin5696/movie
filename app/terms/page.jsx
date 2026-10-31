import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | WatchRelax',
  description: 'Terms of service, legal disclaimers, and acceptable use guidelines for WatchRelax.',
};

export default function TermsOfServicePage() {
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
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">Terms of Service</h1>
        <p className="text-xs text-zinc-400 mt-2">Last updated: October 31, 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or using <strong className="text-white">WatchRelax (watchrelax.site)</strong>, you agree 
            to be bound by these Terms of Service. If you do not agree, please do not use the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Nature of Service &amp; Streaming Disclaimer</h2>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-2">
            <p className="font-semibold text-white">Non-Hosting &amp; Legal Compliance Statement:</p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              WatchRelax is an information portal and editorial guide. <strong>WatchRelax does not host, upload, or broadcast 
              any copyrighted video files, full-length movies, or pirated media on its servers.</strong> All trailers displayed 
              are official promotional videos embedded directly from verified studio YouTube channels via the YouTube API. 
              Streaming platform links direct users to licensed, authorized providers (such as Netflix, Amazon Prime Video, 
              Disney+, Apple TV+, and JioCinema).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Intellectual Property Rights</h2>
          <p>
            This product uses the TMDB API and JustWatch data but is not endorsed or certified by TMDB. 
            All movie titles, logos, promotional backdrops, and trademarks are the property of their respective studio owners. 
            Original editorial articles, ending explanations, and website source code are copyrighted by WatchRelax.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. DMCA &amp; Copyright Inquiries</h2>
          <p>
            WatchRelax respects intellectual property rights. If you believe any link or metadata infringes your copyright, 
            please submit a formal notice to our designated copyright agent at{' '}
            <a href="mailto:support@watchrelax.site" className="text-[#f5c518] underline">
              support@watchrelax.site
            </a>{' '}
            including the URL and proof of copyright ownership. Valid notices are processed promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Limitation of Liability</h2>
          <p>
            WatchRelax provides metadata on an &ldquo;as is&rdquo; basis. While we strive to ensure streaming availability 
            and release dates are current and accurate, platform licensing varies frequently by region. We are not liable 
            for inaccuracies or subscription changes on external streaming services.
          </p>
        </section>
      </div>
    </div>
  );
}
