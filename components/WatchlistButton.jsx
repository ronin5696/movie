'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Check, Plus } from 'lucide-react';

const WATCHLIST_KEY = 'watchrelax_watchlist';

export function getStoredWatchlist() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredWatchlist(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('watchlist-updated', { detail: list }));
  } catch (e) {
    console.error('Failed to save watchlist:', e);
  }
}

export default function WatchlistButton({ movie, size = 'default' }) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const list = getStoredWatchlist();
    setInWatchlist(list.some((item) => String(item.id) === String(movie.id)));

    const handler = (e) => {
      const updated = e.detail || getStoredWatchlist();
      setInWatchlist(updated.some((item) => String(item.id) === String(movie.id)));
    };

    window.addEventListener('watchlist-updated', handler);
    return () => window.removeEventListener('watchlist-updated', handler);
  }, [movie.id]);

  const toggleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const list = getStoredWatchlist();
    const exists = list.some((item) => String(item.id) === String(movie.id));

    let updatedList;
    if (exists) {
      updatedList = list.filter((item) => String(item.id) !== String(movie.id));
    } else {
      updatedList = [
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
        },
        ...list,
      ];
    }

    saveStoredWatchlist(updatedList);
    setInWatchlist(!exists);
  };

  if (!mounted) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-zinc-400 border border-white/10 text-xs font-semibold opacity-50"
      >
        <Bookmark className="w-3.5 h-3.5" />
        <span>Watchlist</span>
      </button>
    );
  }

  const isSmall = size === 'small';

  return (
    <button
      onClick={toggleWatchlist}
      className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all active:scale-95 ${
        isSmall ? 'p-2' : 'px-3.5 py-1.5 text-xs'
      } ${
        inWatchlist
          ? 'bg-[#f5c518] text-black border border-[#f5c518] shadow-md shadow-yellow-500/20 font-bold'
          : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 hover:border-[#f5c518]/30'
      }`}
      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      {inWatchlist ? (
        <>
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          {!isSmall && <span>In Watchlist</span>}
        </>
      ) : (
        <>
          <Bookmark className="w-3.5 h-3.5" />
          {!isSmall && <span>+ Watchlist</span>}
        </>
      )}
    </button>
  );
}

