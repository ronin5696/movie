'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function MovieFaqAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  if (!faqs || faqs.length === 0) return null;

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="rounded-2xl p-6 bg-[#16171d] border border-white/[0.08] space-y-4 shadow-lg">
      <div className="flex items-center gap-2.5 border-b border-white/[0.08] pb-4">
        <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verified release dates, legal streaming platform availability, and post-credits answers
          </p>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-colors overflow-hidden ${
                isOpen
                  ? 'border-[#f5c518]/30 bg-amber-400/[0.04]'
                  : 'border-white/[0.06] bg-white/[0.03] hover:border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left gap-3 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-[#f5c518]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/[0.06]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
