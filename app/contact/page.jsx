import Link from 'next/link';
import { Mail, MessageSquare, ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | WatchRelax',
  description: 'Get in touch with the WatchRelax editorial team for support, feedback, partnerships, and DMCA copyright requests.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-zinc-300 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#f5c518] transition-colors mb-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5c518]/10 text-[#f5c518] border border-[#f5c518]/25 text-xs font-semibold uppercase tracking-wider mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>Support &amp; Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">Contact Us</h1>
        <p className="text-sm text-zinc-400 mt-2">
          Have a suggestion, noticed incorrect streaming data, or need to submit a legal inquiry? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-[#f5c518]/15 text-[#f5c518] flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white">General &amp; Editorial Inquiries</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            For feedback on our streaming guides, trailer corrections, or feature requests:
          </p>
          <p className="font-mono text-sm text-[#f5c518]">
            <a href="mailto:support@watchrelax.site" className="hover:underline">
              support@watchrelax.site
            </a>
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white">DMCA &amp; Copyright Notice</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            To submit a takedown request or intellectual property notice, please include the specific page URL:
          </p>
          <p className="font-mono text-sm text-rose-300">
            <a href="mailto:support@watchrelax.site" className="hover:underline">
              support@watchrelax.site
            </a>
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-500 space-y-2">
        <p className="font-semibold text-zinc-400">Response Time:</p>
        <p>Our editorial team usually responds to user inquiries within 24 to 48 business hours.</p>
      </div>
    </div>
  );
}
