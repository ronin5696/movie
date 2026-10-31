'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

export default function ShareBar({ title, url }) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' && url
    ? (url.startsWith('http') ? url : `${window.location.origin}${url}`)
    : url || '';

  const shareText = `Watch official 4K trailer and OTT release date for "${title}" on WatchRelax:`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl || (typeof window !== 'undefined' ? window.location.href : ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} | WatchRelax Streaming Guide`,
          text: shareText,
          url: fullUrl || window.location.href,
        });
      } catch (err) {
        // User dismissed native share sheet
      }
    } else {
      handleCopy();
    }
  };

  const encodedUrl = encodeURIComponent(fullUrl || '');
  const encodedText = encodeURIComponent(`${shareText} ${fullUrl || ''}`);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Mobile Native Share Sheet Button */}
      <button
        onClick={handleNativeShare}
        className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 border border-white/15 text-xs font-semibold transition-all active:scale-95"
        title="Share"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>

      {/* WhatsApp Share Button */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 text-xs font-semibold transition-all active:scale-95"
        title="Share on WhatsApp"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.006.55 1.777.846 2.806.846 3.18 0 5.767-2.587 5.767-5.766.001-3.18-2.585-5.767-5.767-5.767zm0 10.547c-.894 0-1.657-.271-2.433-.717l-.174-.101-1.614.423.431-1.572-.115-.183c-.496-.789-.785-1.56-.784-2.631.002-2.628 2.138-4.765 4.686-4.765 2.548 0 4.684 2.137 4.684 4.765 0 2.629-2.136 4.781-4.685 4.781zm3.178-3.585c-.174-.087-1.03-.509-1.19-.567-.16-.058-.276-.087-.393.087-.116.174-.45.567-.552.684-.102.116-.203.131-.377.044-.174-.087-.736-.271-1.402-.865-.518-.462-.868-1.033-.969-1.207-.102-.175-.011-.269.076-.356.079-.078.174-.203.262-.305.087-.102.116-.174.174-.29.058-.117.029-.219-.015-.306-.044-.087-.393-.946-.538-1.296-.142-.341-.286-.295-.393-.301l-.335-.006c-.116 0-.305.044-.465.218-.16.174-.61.597-.61 1.455s.625 1.688.712 1.805c.087.116 1.23 1.879 2.981 2.635.417.18.742.287.996.368.419.133.801.114 1.102.069.336-.05 1.03-.421 1.175-.828.146-.407.146-.756.102-.828-.043-.072-.159-.116-.333-.203z" />
        </svg>
        <span>WhatsApp</span>
      </a>

      {/* X / Twitter Share Button */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-semibold transition-all active:scale-95"
        title="Share on X"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>Post</span>
      </a>

      {/* Telegram Share Button */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#29b6f6] border border-[#0088cc]/30 text-xs font-semibold transition-all active:scale-95"
        title="Share on Telegram"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
        <span>Telegram</span>
      </a>

      {/* Copy Link Button with Animated Feedback */}
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
          copied
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
            : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
        }`}
        title="Copy Link to Clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}

