import { Calendar, Clapperboard, Download, Tv, Clock, CheckCircle2 } from 'lucide-react';

export default function StreamingTimeline({ timeline, title }) {
  if (!timeline || !timeline.theatricalDate) return null;

  const steps = [
    {
      title: 'Theatrical Premiere',
      date: timeline.theatricalDate,
      icon: Clapperboard,
      completed: timeline.status !== 'upcoming',
      active: timeline.status === 'in_theaters',
      desc: 'Exclusive cinema run',
    },
    {
      title: 'Digital VOD Release',
      date: timeline.digitalVodDate,
      icon: Download,
      completed: timeline.status === 'digital_premiere' || timeline.status === 'streaming_now',
      active: timeline.status === 'digital_premiere',
      desc: 'Rent/Buy on Apple & Amazon',
    },
    {
      title: 'Subscription OTT Premiere',
      date: timeline.subscriptionOttDate,
      icon: Tv,
      completed: timeline.status === 'streaming_now',
      active: timeline.status === 'streaming_now',
      desc: 'Netflix, Prime, or Disney+',
    },
  ];

  return (
    <div className="rounded-2xl p-6 bg-[#16171d] border border-white/[0.08] space-y-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              OTT &amp; Streaming Release Timeline
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Projected streaming and digital release windows for {title}
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] text-white border border-white/10 text-xs font-semibold self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#f5c518]" />
          <span>{timeline.statusBadge}</span>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className={`relative p-4 rounded-xl border transition-all ${
                step.active
                  ? 'bg-amber-400/[0.06] border-[#f5c518]/50 shadow-md'
                  : step.completed
                  ? 'bg-white/[0.04] border-white/10'
                  : 'bg-black/30 border-white/[0.05] opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-white mb-3">
                  <Icon className="w-4 h-4 text-[#f5c518]" />
                </div>
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-400 font-medium">
                    Step {idx + 1}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white">{step.title}</h4>
              <p className="text-xs font-semibold text-[#f5c518] mt-0.5">{step.date}</p>
              <p className="text-[11px] text-zinc-400 mt-1">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
