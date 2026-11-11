import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { Icon } from "./icons";

export default function ServiceCard({ service, showFeatures = false }) {
  const features = showFeatures ? (service.features || []).slice(0, 3) : [];
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-lavender via-white to-cool p-7 shadow-[0_8px_0_-3px_rgba(232,226,242,0.9),0_16px_32px_-20px_rgba(23,18,31,0.2)] transition-all duration-300 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_12px_0_-3px_rgba(114,0,245,0.14),0_28px_44px_-18px_rgba(72,24,160,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-8"
    >
      {/* Glossy corner glow washes, echoing the brand gradient */}
      <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-secondary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />

      {/* Decorative dot grid, top-right corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-6 h-12 w-14 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(114,0,245,0.45) 1px, transparent 1.6px)",
          backgroundSize: "10px 10px"
        }}
      />

      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Oversized brand icon as the card's background art */}
      <Icon
        name={service.icon}
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 rotate-[-8deg] text-primary/[0.14] transition-all duration-500 ease-out group-hover:rotate-0 group-hover:scale-110 group-hover:text-primary/25"
      />

      <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-gradient group-hover:text-white group-hover:ring-transparent">
        <Icon name={service.icon} className="h-5 w-5" />
      </div>
      {service.priceFrom && (
        <span className="relative text-xs font-semibold uppercase tracking-wider text-muted">From {service.priceFrom}</span>
      )}
      <h3 className="relative mt-1.5 font-display text-2xl font-extrabold tracking-tight text-ink transition-colors group-hover:text-primary">
        {service.name}
      </h3>
      <p className="relative mt-2.5 text-sm leading-relaxed text-muted">{service.short}</p>
      {features.length > 0 && (
        <ul className="relative mt-5 hidden space-y-2 border-t border-line pt-5 sm:block">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink/75">
              <FaCheck className="mt-1 h-3 w-3 shrink-0 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
      <span className="relative mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
        Explore Service <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
