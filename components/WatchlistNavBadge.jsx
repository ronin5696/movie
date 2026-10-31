'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { getStoredWatchlist } from './WatchlistButton';

export default function WatchlistNavBadge() {
  const [count, setCount] = useState(0);
  const pathname = usePathname() || '';

  // Extract country code from pathname (e.g. /in/movie/... -> in)
  const pathParts = pathname.split('/').filter(Boolean);
  const countryCode = (pathParts[0] && pathParts[0].length === 2 ? pathParts[0] : 'us').toLowerCase();

  useEffect(() => {
    setCount(getStoredWatchlist().length);

    const handler = (e) => {
      const list = e.detail || getStoredWatchlist();
      setCount(list.length);
    };

    window.addEventListener('watchlist-updated', handler);
    return () => window.removeEventListener('watchlist-updated', handler);
  }, []);

  return (
    <Link
      href={`/${countryCode}/watchlist`}
      className="flex items-center gap-1.5 hover:text-[#f5c518] transition-colors py-1 text-xs sm:text-sm font-semibold relative"
      title="View your saved movies"
    >
      <Bookmark className="w-4 h-4 text-[#f5c518]" />
      <span className="hidden sm:inline">Watchlist</span>
      {count > 0 && (
        <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#f5c518] text-black text-[10px] font-black leading-tight">
          {count}
        </span>
      )}
    </Link>
  );
}
