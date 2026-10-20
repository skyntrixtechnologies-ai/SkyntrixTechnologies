import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck } from "react-icons/fa6";
import { Icon } from "./icons";

export default function ServiceCard({ service, showFeatures = false }) {
  const features = showFeatures ? (service.features || []).slice(0, 3) : [];
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-7 shadow-[0_1px_2px_rgba(23,18,31,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary-gradient group-hover:text-white group-hover:ring-transparent">
        <Icon name={service.icon} className="h-5 w-5" />
      </div>
      {service.priceFrom && (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">From {service.priceFrom}</span>
      )}
      <h3 className="mt-1 font-display text-xl font-bold text-ink transition-colors group-hover:text-primary">{service.name}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted">{service.short}</p>
      {features.length > 0 && (
        <ul className="mt-5 hidden space-y-2 border-t border-line pt-5 sm:block">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink/75">
              <FaCheck className="mt-1 h-3 w-3 shrink-0 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
        Explore Service <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
