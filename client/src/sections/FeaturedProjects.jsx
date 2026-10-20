import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionHeading from "../components/SectionHeading";
import ProjectVisual from "../components/ProjectVisual";
import Reveal from "../components/Reveal";
import { useSiteData } from "../lib/SiteDataContext";

const isRealUrl = (url) => /^https?:\/\//i.test(url || "");

// Labels come straight from the CMS "client" field — nothing is inferred.
function projectOrigin(client) {
  if (!client) return { label: "Showcase project", tone: "bg-cool text-secondary" };
  if (/internal/i.test(client)) return { label: "Internal product", tone: "bg-cool text-secondary" };
  return { label: `Client · ${client}`, tone: "bg-lavender text-primary" };
}

// "React 19" / "Tailwind CSS 4" -> "React" / "Tailwind CSS" so chips stay short and consistent.
const cleanTech = (t) => t.replace(/\s+v?\d+(\.\d+)*$/i, "").trim();

function ProjectTile({ project, large }) {
  const origin = projectOrigin(project.client);
  const tech = [...new Set((project.technologies || []).map(cleanTech))].slice(0, large ? 5 : 4);
  const detailUrl = `/portfolio/${project.slug}`;

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgba(23,18,31,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${large ? "lg:flex-row" : ""}`}>
      <Link
        to={detailUrl}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block shrink-0 overflow-hidden bg-gradient-to-br from-lavender to-cool p-3 pb-0 sm:p-5 sm:pb-0 ${large ? "lg:flex lg:w-[56%] lg:items-end lg:p-8 lg:pb-0" : ""}`}
      >
        <div className="w-full overflow-hidden rounded-t-2xl border border-b-0 border-line bg-white shadow-[0_-10px_30px_-20px_rgba(72,24,160,0.35)]">
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-ink/15" />
            <span className="h-2 w-2 rounded-full bg-ink/15" />
            <span className="h-2 w-2 rounded-full bg-ink/15" />
          </div>
          {project.image && /^(https?:)?\/\/|^\//.test(project.image) ? (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              decoding="async"
              width="800"
              height="500"
              className={`w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}
            />
          ) : (
            <ProjectVisual image={project.image} label={project.title} className={large ? "aspect-[16/9]" : "aspect-[16/10]"} />
          )}
        </div>
      </Link>

      <div className={`flex flex-1 flex-col p-6 sm:p-7 ${large ? "lg:justify-center lg:p-10" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {project.category && <span className="rounded-full border border-line px-2.5 py-1 text-muted">{project.category}</span>}
          <span className={`rounded-full px-2.5 py-1 ${origin.tone}`}>{origin.label}</span>
        </div>
        <h3 className={`mt-3 font-display font-bold leading-snug text-ink ${large ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
          <Link to={detailUrl} className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            {project.title}
          </Link>
        </h3>
        {project.overview && <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">{project.overview}</p>}

        {tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {tech.map((t) => <li key={t} className="chip">{t}</li>)}
          </ul>
        )}

        <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 text-sm font-semibold ${large ? "mt-auto lg:mt-2" : "mt-auto"}`}>
          <Link to={detailUrl} className="inline-flex items-center gap-1.5 text-primary">
            View case study <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          {isRealUrl(project.liveDemo) && (
            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink/70 hover:text-ink">
              Live demo <FaArrowUpRightFromSquare className="h-3 w-3" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function SkeletonTile() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white">
      <div className="aspect-[16/10] animate-pulse bg-lavender" />
      <div className="space-y-3 p-7">
        <div className="h-4 w-1/3 animate-pulse rounded bg-lavender" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-lavender" />
        <div className="h-4 w-full animate-pulse rounded bg-lavender" />
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const { data, loading } = useSiteData();
  const projects = data?.projects || [];
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 5);
  const [lead, ...rest] = featured;

  return (
    <section className="section-pad bg-lavender/60">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            center={false}
            className="!mb-0"
            label="Featured Work"
            title="Real Projects. Practical Solutions."
            subtitle="A selection of platforms we have designed and built — from booking and e-commerce to management dashboards."
          />
          <Reveal className="shrink-0">
            <Link to="/portfolio" className="btn-secondary">
              View All Projects <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        {loading && !featured.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <SkeletonTile />
            <SkeletonTile />
          </div>
        ) : (
          <div className="mt-12 space-y-6">
            {lead && (
              <Reveal>
                <ProjectTile project={lead} large />
              </Reveal>
            )}
            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {rest.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 2) * 0.06} className="h-full">
                    <ProjectTile project={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
