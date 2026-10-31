import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { Play, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import CountrySelector from '@/components/CountrySelector';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watchrelax.site';
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-YJX5KKVZLT';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0e1015',
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'WatchRelax | Official Movie Trailers, OTT Release Dates & Streaming Guide',
    template: '%s | WatchRelax',
  },
  description:
    'Relax and discover official 4K movie trailers, confirmed OTT streaming release dates on Netflix, Prime & Disney+, and in-depth ending explanations.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    'watchrelax',
    'where to watch movies online',
    'ott release dates',
    'ott release dates this week',
    'where to stream full movie',
    'is it streaming on netflix',
    'prime video streaming guide',
    'disney plus hotstar release date',
    'jiocinema new releases',
    'free movies to watch online legally',
    'official 4k movie trailers',
    'post credits scene detector',
    'ending explained spoiler breakdown',
    'digital vod release date calendar',
    'how to download movies legally offline',
    'justwatch alternative streaming guide',
    'movies releasing on ott this friday',
  ],
  authors: [{ name: 'WatchRelax Editorial Team' }],
  creator: 'WatchRelax',
  publisher: 'WatchRelax',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'WatchRelax',
    title: 'WatchRelax | Official Movie Trailers & Legal Streaming Hub',
    description:
      'Verified streaming availability, studio-quality 4K trailers, OTT release timelines, and spoiler breakdowns.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WatchRelax | Official Trailers & Streaming Guide',
    description:
      'Find where to stream movies legally, check OTT release dates, and explore official studio trailers.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${outfit.variable} ${jakarta.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen bg-[#0e1015] text-zinc-100 flex flex-col font-sans antialiased selection:bg-[#f5c518] selection:text-black">
        {/* Google tag (gtag.js) */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 glass-panel border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
            
            {/* WatchRelax Brand Logo with IMDb-Style Gold Badge */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f5c518] text-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black ml-0.5" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight font-heading">
                <span className="text-white">Watch</span>
                <span className="text-[#f5c518]">Relax</span>
              </span>
            </Link>

            {/* Global Search Bar (Desktop) */}
            <div className="flex-1 max-w-md hidden md:block">
              <SearchBar placeholder="Search any movie, franchise, or title..." />
            </div>

            {/* Right Navigation */}
            <nav className="flex items-center gap-3 sm:gap-4 text-sm font-medium text-zinc-300">
              <Link
                href="/"
                className="flex items-center gap-1.5 hover:text-[#f5c518] transition-colors py-1 text-xs sm:text-sm font-semibold"
              >
                <TrendingUp className="w-4 h-4 text-[#f5c518]" />
                <span>Trending</span>
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white/5 text-zinc-300 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Streams
              </span>
              <CountrySelector />
            </nav>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1">{children}</main>

        {/* Global Footer with Compliance and Disclaimers */}
        <footer className="border-t border-white/[0.08] bg-[#090a0d] py-12 text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#f5c518] text-black flex items-center justify-center">
                  <Play className="w-3 h-3 fill-black ml-0.5" />
                </div>
                <span className="font-bold text-zinc-300 font-heading text-sm">
                  WatchRelax
                </span>
                <span className="text-[11px] text-[#f5c518]/90 font-mono">watchrelax.site</span>
              </div>
              <p className="text-center md:text-right text-zinc-400">
                Official 4K studio trailers embedded directly from verified studio channels.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400 font-medium">
                <Link href="/about" className="hover:text-[#f5c518] transition-colors">
                  About Us
                </Link>
                <Link href="/privacy" className="hover:text-[#f5c518] transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-[#f5c518] transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="hover:text-[#f5c518] transition-colors">
                  Contact Us
                </Link>
              </div>

              <div className="text-[11px] text-zinc-500">
                &copy; {new Date().getFullYear()} WatchRelax. All rights reserved.
              </div>
            </div>

            <div className="text-[11px] leading-relaxed text-zinc-600">
              WatchRelax (watchrelax.site) utilizes the TMDB API and JustWatch data but is not endorsed or certified by TMDB. 
              All trademarks, movie titles, and platform logos (Netflix, Disney+, Prime Video, Apple TV+, etc.) 
              belong to their respective copyright holders. No copyright infringement is intended.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
