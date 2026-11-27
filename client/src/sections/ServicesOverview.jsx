import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import Reveal from "../components/Reveal";
import { useConsult } from "../components/ConsultModal";
import { useSiteData } from "../lib/SiteDataContext";
import { services as staticServices } from "../data/services";

const AUTOPLAY_INTERVAL_MS = 3200;

function ServiceCarousel({ services }) {
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return undefined;
    const onResize = () => updateEdges();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [services.length]);

  function scroll(dir) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: "smooth" });
  }

  function advance() {
    const el = trackRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
    if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else scroll(1);
  }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    autoplayRef.current = setInterval(advance, AUTOPLAY_INTERVAL_MS);
  }

  function stopAutoplay() {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = null;
  }

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, services.length]);

  return (
    <div onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay} className="relative">
      <div className="mb-5 flex items-center justify-end gap-4 px-1">
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            aria-label="Previous services"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition-all duration-200 hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!canRight}
            aria-label="Next services"
            className="grid h-10 w-10 place-items-center rounded-full border border-transparent bg-primary-gradient text-white shadow-soft transition-all duration-200 hover:shadow-glow disabled:pointer-events-none disabled:opacity-30"
          >
            <FaArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* -mx-3/px-3 give each card's hover shadow room to bleed without being
          hard-clipped by the scroll container's own edge (visible otherwise as
          a jagged cut-off glow on the first/last card, which have no neighbor
          gap to bleed into). */}
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="-mx-3 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 4) * 0.05} className="w-[82%] shrink-0 snap-start sm:w-[320px]">
            <ServiceCard service={s} showFeatures />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function ServicesOverview() {
  const { data } = useSiteData();
  const { openConsult } = useConsult();
  // Static services share slugs with the CMS, so they are a safe placeholder while the API responds.
  const services = (data?.services || staticServices).filter((s) => s.slug !== "ui-ux-design").slice(0, 8);

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          label="Our Services"
          title="Digital Solutions Built Around Your Business."
          subtitle="From your first online presence to complex business applications, we help turn ideas into practical digital products."
        />

        {/* Mobile: plain stacked cards, normal page scroll only - no separate
            horizontal-scroll/autoplay gesture, no Reveal re-trigger glitch. */}
        <div className="grid gap-5 sm:hidden">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} showFeatures />
          ))}
        </div>

        {/* sm and up: autoplaying horizontal carousel, where there's room for it. */}
        <div className="hidden sm:block">
          <ServiceCarousel services={services} />
        </div>

        <Reveal className="mt-6">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-primary/10 bg-gradient-to-r from-lavender via-white to-cool p-6 sm:p-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="font-display text-lg font-bold text-ink sm:text-xl">Need custom software or business automation?</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[1rem]">
                Management portals, CRMs, booking systems and workflow tools are scoped around your process. Tell us what you need to streamline.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <button type="button" onClick={openConsult} className="btn-primary">
                Discuss Your Requirements
              </button>
              <Link to="/services" className="btn-secondary">
                All Services <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
