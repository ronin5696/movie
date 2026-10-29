'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar({ defaultValue = '', placeholder = 'Search any movie, franchise, or title...' }) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();
  const params = useParams();
  const country = params?.country || 'us';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/${country}?q=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery('');
    router.push(`/${country}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-[#f5c518] focus:ring-2 focus:ring-[#f5c518]/20 focus:bg-white/[0.08] transition-all"
        />
        <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
