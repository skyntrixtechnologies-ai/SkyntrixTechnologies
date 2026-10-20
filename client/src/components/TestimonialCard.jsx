import { FaStar, FaQuoteLeft } from "react-icons/fa6";

export default function TestimonialCard({ t }) {
  const rating = Math.max(0, Math.min(5, Math.round(Number(t.rating) || 0)));
  return (
    <figure className="relative flex h-full flex-col rounded-3xl border border-line bg-white p-8 shadow-[0_1px_2px_rgba(23,18,31,0.04)]">
      <FaQuoteLeft className="absolute right-7 top-7 h-9 w-9 text-primary/10" aria-hidden="true" />
      {rating > 0 && (
        <div className="mb-4 flex text-amber-400" role="img" aria-label={`Rated ${rating} out of 5`}>
          {[...Array(rating)].map((_, i) => <FaStar key={i} className="h-4 w-4" aria-hidden="true" />)}
        </div>
      )}
      <blockquote className="flex-1 leading-relaxed text-ink/80">"{t.quote}"</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        {t.image ? (
          <img src={t.image} alt="" width="44" height="44" loading="lazy" className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-gradient font-bold text-white" aria-hidden="true">
            {t.avatar}
          </span>
        )}
        <div>
          <div className="font-semibold text-ink">{t.author}</div>
          {t.role && <div className="text-sm text-muted">{t.role}</div>}
        </div>
      </figcaption>
    </figure>
  );
}
