import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <article className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_18px_0_-8px_rgba(232,226,242,0.9),0_30px_60px_-30px_rgba(23,18,31,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_0_-8px_rgba(114,0,245,0.14),0_36px_70px_-28px_rgba(72,24,160,0.35)] ${large ? "lg:flex-row" : ""}`}>
      <Link
        to={detailUrl}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block shrink-0 overflow-hidden bg-gradient-to-br from-lavender to-cool p-3 pb-0 sm:p-5 sm:pb-0 ${large ? "lg:flex lg:w-[56%] lg:items-end lg:p-8 lg:pb-0" : ""}`}
      >
        {/* Directional glass sheen across the screenshot, like light catching a card */}
        <span className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.55)_48%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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

// Layered 3D stack: the active project sits raised in front, the previous and
// next projects peek in from behind at each side. Clicking a peeking side
// card (or a dot) brings it to the front.
function ProjectStack({ projects }) {
  const [active, setActive] = useState(0);
  const total = projects.length;
  const showSides = total > 1;
  const prevIdx = (active - 1 + total) % total;
  const nextIdx = (active + 1) % total;

  function go(i) {
    setActive(i);
  }

  function sideKeyHandler(i) {
    return (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go(i);
      }
    };
  }

  return (
    <div className="mt-12">
      <div className="relative mx-auto flex max-w-sm items-center justify-center overflow-hidden rounded-[2.5rem] py-6 lg:max-w-none lg:py-12">
        {showSides && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => go(prevIdx)}
            onKeyDown={sideKeyHandler(prevIdx)}
            aria-label={`Show ${projects[prevIdx].title}`}
            className="absolute left-1/2 top-1/2 z-10 hidden w-full max-w-sm -translate-x-[126%] -translate-y-[53%] rotate-[-4deg] scale-[0.88] cursor-pointer opacity-95 transition-all duration-500 hover:opacity-100 hover:scale-[0.92] lg:block"
          >
            <div className="pointer-events-none relative overflow-hidden rounded-[2rem]">
              <ProjectTile project={projects[prevIdx]} />
              <span className="absolute inset-0 rounded-[2rem] bg-white/35" />
            </div>
          </div>
        )}

        {showSides && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => go(nextIdx)}
            onKeyDown={sideKeyHandler(nextIdx)}
            aria-label={`Show ${projects[nextIdx].title}`}
            className="absolute left-1/2 top-1/2 z-10 hidden w-full max-w-sm translate-x-[26%] -translate-y-[53%] rotate-[4deg] scale-[0.88] cursor-pointer opacity-95 transition-all duration-500 hover:opacity-100 hover:scale-[0.92] lg:block"
          >
            <div className="pointer-events-none relative overflow-hidden rounded-[2rem]">
              <ProjectTile project={projects[nextIdx]} />
              <span className="absolute inset-0 rounded-[2rem] bg-white/35" />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={projects[active].id || projects[active].slug}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 w-full max-w-sm"
          >
            <ProjectTile project={projects[active]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {showSides && (
        <div className="mt-7 flex items-center justify-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.id || p.slug}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${p.title}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-primary-gradient" : "w-2 bg-primary/20 hover:bg-primary/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeaturedProjects() {
  const { data, loading } = useSiteData();
  const projects = data?.projects || [];
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 5);

  return (
    <section className="section-pad bg-lavender/60">
      <div className="container-x">
        <div className="relative">
          <SectionHeading
            className="!mb-0"
            label="Featured Work"
            title="Real Projects. Practical Solutions."
            subtitle="A selection of platforms we have designed and built — from booking and e-commerce to management dashboards."
          />
          <Reveal delay={0.1} className="mt-6 flex justify-center md:absolute md:right-0 md:top-1 md:mt-0 md:block">
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
          featured.length > 0 && <ProjectStack projects={featured} />
        )}
      </div>
    </section>
  );
}
