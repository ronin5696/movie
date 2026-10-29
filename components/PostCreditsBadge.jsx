import { Film, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

export default function PostCreditsBadge({ guide }) {
  if (!guide) return null;

  const isConfirmed = guide.hasPostCredits;

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-[#16171d] border border-white/[0.08] space-y-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Post-Credits Scene Guide
            </h4>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              Verified end-credits scene information
            </span>
          </div>
        </div>

        {/* Status Chip */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto border ${
            isConfirmed
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-white/5 text-zinc-300 border-white/10'
          }`}
        >
          {isConfirmed ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span>{guide.badgeText}</span>
        </div>
      </div>

      {/* Advice Description */}
      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <Info className="w-4 h-4 text-[#f5c518] flex-shrink-0 mt-0.5" />
        <p>
          <strong className="text-white">What to know: </strong>
          {guide.advice}
        </p>
      </div>

      {isConfirmed && (
        <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium pt-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#f5c518]" />
            Mid-Credits Scenes: <strong className="text-white">{guide.midCredits}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            End-Credits Scenes: <strong className="text-white">{guide.endCredits}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
