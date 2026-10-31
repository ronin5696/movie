import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | WatchRelax',
  description: 'Learn how WatchRelax protects your privacy, manages cookies, and complies with GDPR, CCPA, and Google AdSense guidelines.',
};

export default function PrivacyPolicyPage() {
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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Legal &amp; Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">Privacy Policy</h1>
        <p className="text-xs text-zinc-400 mt-2">Last updated: October 31, 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to WatchRelax (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We operate{' '}
            <strong className="text-white">watchrelax.site</strong>, an editorial movie discovery platform, 
            official trailer showcase, and legal OTT streaming guide. We respect your privacy and are committed 
            to protecting the personal data of our visitors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
          <p>
            WatchRelax does not require user accounts, logins, or credit card information. We collect minimal 
            technical data necessary to provide a personalized browsing experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-zinc-200">Device &amp; Browser Information:</strong> IP address, browser type, operating system, and screen resolution for responsive layout optimization.</li>
            <li><strong className="text-zinc-200">Regional Preferences:</strong> A localized cookie storing your chosen country (e.g., India, US, UK) to display accurate streaming availability.</li>
            <li><strong className="text-zinc-200">Usage Analytics:</strong> Aggregated, anonymized statistics via Google Analytics regarding page visits, referral sources, and trailer views.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Cookies &amp; Tracking Technologies</h2>
          <p>
            Cookies are small text files stored on your device. We use cookies strictly to improve navigation and 
            remember regional streaming catalogs.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h3 className="text-base font-semibold text-white">Google AdSense &amp; DoubleClick DART Cookies</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Google, as a third-party vendor, may use cookies to serve advertisements on our site. Google&apos;s use of 
              advertising cookies enables it and its partners to serve ads to our users based on their visit to our site 
              and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#f5c518] underline hover:opacity-80"
              >
                Google Ads Settings
              </a>.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Third-Party Services &amp; APIs</h2>
          <p>
            Our website integrates vetted third-party services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-zinc-200">The Movie Database (TMDB) API:</strong> Provides movie metadata, posters, cast details, and synopsis.</li>
            <li><strong className="text-zinc-200">YouTube Player API:</strong> Embeds official 4K studio movie trailers. YouTube&apos;s Terms of Service apply to embedded video playback.</li>
            <li><strong className="text-zinc-200">Google Analytics 4:</strong> Measures traffic and site performance anonymously without personally identifying individuals.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. GDPR &amp; CCPA Compliance</h2>
          <p>
            Under the European General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), 
            you have rights to request data access, rectification, or erasure. Because we do not store personal profiles 
            or email addresses, we do not sell or monetize personal data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or data protection, please contact our privacy desk at{' '}
            <a href="mailto:support@watchrelax.site" className="text-[#f5c518] underline">
              support@watchrelax.site
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
