import Reveal from "./Reveal";

export default function SectionHeading({ label, title, subtitle, center = true, dark = false, className = "" }) {
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} mb-12 md:mb-14 ${className}`}>
      {label && (
        <span className={dark ? "eyebrow border-white/20 bg-white/10 text-white" : "eyebrow"}>
          <span className="h-1.5 w-1.5 rounded-full bg-primary-gradient" />
          {label}
        </span>
      )}
      <h2
        className={`heading-lg mt-4 max-w-4xl xl:max-w-none xl:whitespace-nowrap ${center ? "mx-auto" : ""} ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${center ? "mx-auto" : ""} ${dark ? "text-white/70" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
