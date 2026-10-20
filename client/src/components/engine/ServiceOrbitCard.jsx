import { Icon } from "../icons";

// Service card for the orbital hero layout. Fills its positioned parent
// (sized by the layout's `--card-w`/`--card-h` variables) and scales its
// interior with the same breakpoints: small + short description on mobile,
// fuller description from lg up.
export default function ServiceOrbitCard({ service, onHover, className = "" }) {
  const handlers = onHover
    ? { onMouseEnter: () => onHover(service.id), onMouseLeave: () => onHover(null) }
    : {};

  return (
    <div
      {...handlers}
      className={`group flex h-full w-full items-center gap-1.5 rounded-[10px] border border-white/70 bg-white/90 p-1.5 shadow-[0_10px_28px_-14px_rgba(109,40,217,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow sm:gap-2 sm:rounded-[12px] sm:p-2 lg:gap-2.5 lg:rounded-[14px] lg:p-2.5 ${className}`}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary-gradient text-white shadow-[0_6px_14px_-6px_rgba(124,58,237,0.55)] sm:h-7 sm:w-7 sm:rounded-lg lg:h-8 lg:w-8">
        <Icon name={service.icon} className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
      </span>
      <div className="min-w-0">
        <p className="line-clamp-2 text-[10px] font-bold leading-tight text-ink sm:text-[11px] lg:text-[12px]">
          {service.name}
        </p>
        <p className="mt-[1px] truncate text-[8px] leading-snug text-ink/60 sm:text-[9px] lg:hidden">
          {service.short || service.desc}
        </p>
        <p className="mt-1 hidden line-clamp-2 text-[9.5px] leading-snug text-ink/60 lg:block">
          {service.desc}
        </p>
      </div>
    </div>
  );
}
