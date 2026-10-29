'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';

const COUNTRIES = [
  { code: 'in', name: 'India', flag: '🇮🇳' },
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
];

export default function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname() || '';
  const router = useRouter();

  // Extract 2-letter country code from the current URL path (e.g., /in or /us)
  const pathParts = pathname.split('/').filter(Boolean);
  const currentCode = (pathParts[0] && pathParts[0].length === 2 ? pathParts[0] : 'us').toLowerCase();
  const currentCountry = COUNTRIES.find((c) => c.code === currentCode) || {
    code: currentCode,
    name: currentCode.toUpperCase(),
    flag: '🌐',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCountry = (code) => {
    setIsOpen(false);
    if (code === currentCode) return;

    // Set cookie for 30 days so subsequent visits preserve the user's country preference
    document.cookie = `watchrelax_country=${code}; path=/; max-age=2592000; SameSite=Lax`;

    // Replace the first URL path segment with the new country code
    let newPath;
    if (pathParts.length === 0) {
      newPath = `/${code}`;
    } else if (pathParts[0].length === 2) {
      const restOfPath = pathParts.slice(1).join('/');
      newPath = `/${code}${restOfPath ? `/${restOfPath}` : ''}`;
    } else {
      newPath = `/${code}/${pathParts.join('/')}`;
    }

    router.push(newPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Change country region"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-[#f5c518]/40 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-sm"
      >
        <span className="text-sm">{currentCountry.flag}</span>
        <span className="uppercase font-bold tracking-wider">{currentCountry.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#f5c518]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#16171d] border border-white/[0.12] shadow-2xl py-1.5 z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-[#f5c518]" />
            <span>Select Streaming Region</span>
          </div>
          <div className="py-1">
            {COUNTRIES.map((country) => {
              const isSelected = country.code === currentCode;
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelectCountry(country.code)}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-amber-400/10 text-[#f5c518] font-bold'
                      : 'text-zinc-200 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    {country.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
