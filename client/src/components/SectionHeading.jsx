import Reveal from "./Reveal";

export default function SectionHeading({ label, title, subtitle, center = true, dark = false, className = "" }) {
  return (
    <Reveal className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} mb-12 md:mb-14 ${className}`}>
      {label && (
        <span className={dark ? "eyebrow border-white/20 bg-white/10 text-white" : "eyebrow"}>
          <span className="h-1.5 w-1.5 rounded-full bg-primary-gradient" />
          {label}
        </span>
      )}
      <h2 className={`heading-lg mt-4 text-balance ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-white/70" : "text-muted"}`}>{subtitle}</p>}
    </Reveal>
  );
}
