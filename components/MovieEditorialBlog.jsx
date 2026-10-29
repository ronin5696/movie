import { User, Calendar, Clock, Star } from 'lucide-react';

export default function MovieEditorialBlog({ blog, title }) {
  if (!blog || !blog.sections) return null;

  return (
    <article className="rounded-2xl p-6 sm:p-9 bg-[#16171d] border border-white/[0.08] space-y-7 shadow-lg">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-[#f5c518] rounded-full flex-shrink-0" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#f5c518]">
              Film Review &amp; Guide
            </span>
          </div>
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTime}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {blog.headline}
        </h2>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-400 pt-1">
          <span className="flex items-center gap-1.5 text-zinc-200 font-medium">
            <User className="w-3.5 h-3.5 text-[#f5c518]" />
            {blog.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Updated {blog.publishedAt}
          </span>
        </div>
      </div>

      {/* Film Quick Factsheet */}
      {(blog.director || blog.cast) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
          {blog.director && (
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Director</span>
              <span className="text-zinc-200 font-medium truncate block mt-0.5">{blog.director}</span>
            </div>
          )}
          {blog.cast && (
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Key Cast</span>
              <span className="text-zinc-200 font-medium truncate block mt-0.5">{blog.cast}</span>
            </div>
          )}
          {blog.runtime && (
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Runtime</span>
              <span className="text-zinc-200 font-medium truncate block mt-0.5">{blog.runtime}</span>
            </div>
          )}
          {blog.rating && (
            <div>
              <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-semibold">Audience Score</span>
              <span className="text-[#f5c518] font-bold flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-[#f5c518]" />
                {blog.rating}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Structured Editorial Sections */}
      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-zinc-300">
        {blog.sections.map((section) => (
          <div key={section.id} id={section.id} className="space-y-2.5">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#f5c518] inline-block" />
              <span>{section.heading}</span>
            </h3>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pl-3.5 border-l border-white/[0.08]">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
