import { Link } from "react-router-dom";
import { FaArrowRight, FaClock } from "react-icons/fa6";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { useSiteData } from "../lib/SiteDataContext";

const formatDate = (value) => {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime())
    ? { iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }
    : null;
};

const coverOf = (b) => (/^(https?:)?\/\/|^\//.test(b.thumbnail || "") ? b.thumbnail : "");

export default function BlogPreview() {
  const { data } = useSiteData();
  const latest = [...(data?.blogPosts || [])]
    .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0))
    .slice(0, 3);

  if (!latest.length) return null;

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            center={false}
            className="!mb-0"
            label="Insights"
            title="Insights for a Digital-First Business."
            subtitle="Practical guides on websites, apps, SEO and growing your business online."
          />
          <Reveal className="shrink-0">
            <Link to="/blog" className="btn-secondary">
              Read the Blog <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-wrap gap-6">
          {latest.map((b, i) => {
            const date = formatDate(b.date);
            const cover = coverOf(b);
            return (
              <Reveal key={b.id} delay={i * 0.07} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary via-accent to-secondary">
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="640"
                        height="360"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-grid opacity-30 [filter:invert(1)]" aria-hidden="true" />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                      {b.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      {date && <time dateTime={date.iso}>{date.label}</time>}
                      {date && b.readTime && <span aria-hidden="true">•</span>}
                      {b.readTime && (
                        <span className="flex items-center gap-1">
                          <FaClock className="h-3 w-3" aria-hidden="true" /> {b.readTime} read
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                      <Link to={`/blog/${b.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                        {b.title}
                      </Link>
                    </h3>
                    {b.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{b.excerpt}</p>}
                    <Link
                      to={`/blog/${b.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary"
                      aria-label={`Read article: ${b.title}`}
                    >
                      Read article <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
