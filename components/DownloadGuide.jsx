import { Download, ShieldCheck, Smartphone, CheckCircle2 } from 'lucide-react';

export default function DownloadGuide({ guide, title }) {
  if (!guide) return null;

  return (
    <section className="rounded-2xl p-6 bg-[#16171d] border border-white/[0.08] space-y-5 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Offline Viewing &amp; Downloads
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verified legal offline downloading guide for phones, tablets, and laptops
            </p>
          </div>
        </div>

        <span className="text-xs text-zinc-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto font-medium">
          {guide.availabilityStatus}
        </span>
      </div>

      {/* Available Download Channels */}
      {guide.platforms && guide.platforms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guide.platforms.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 hover:border-[#f5c518]/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{p.name}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                  Verified Legal
                </span>
              </div>
              <p className="text-[11px] text-[#f5c518] font-medium">{p.quality}</p>
              <p className="text-xs text-zinc-400 leading-snug pt-0.5">{p.method}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400 text-center">
          Official downloads unlock once the title arrives on digital platforms like Apple TV, Amazon, or Netflix.
        </div>
      )}

      {/* Step-by-Step Instructions */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-[#f5c518]" />
          <span>Quick Download Steps</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {guide.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-black/30 border border-white/[0.05] space-y-1.5"
            >
              <span className="inline-block w-5 h-5 rounded-full bg-white/10 text-white text-[10px] font-bold text-center leading-5">
                {idx + 1}
              </span>
              <p className="text-xs text-zinc-300 leading-snug">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
