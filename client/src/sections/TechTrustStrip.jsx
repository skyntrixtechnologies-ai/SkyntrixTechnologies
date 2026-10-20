import { Icon } from "../components/icons";
import { techGroups } from "../data/content";

// Compact strip of technologies used across delivered projects.
// Monochrome by default — these are tools we use, not partnerships.
const featured = ["React", "Node.js", "Express", "MongoDB", "MySQL", "Tailwind CSS", "Framer Motion", "Razorpay"];
const items = techGroups.flatMap((g) => g.items).filter((t) => featured.includes(t.name));

export default function TechTrustStrip() {
  return (
    <section aria-label="Technologies we build with" className="border-y border-line/70 bg-white">
      <div className="container-x flex flex-col items-center gap-5 py-8 lg:flex-row lg:gap-10">
        <p className="shrink-0 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted lg:max-w-[180px] lg:text-left">
          Technologies used in our delivered projects
        </p>
        <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:gap-x-9 lg:justify-between lg:gap-x-6">
          {items.map((t) => (
            <li key={t.name} className="flex items-center gap-2 text-ink/60 transition-colors duration-200 hover:text-primary">
              <Icon name={t.icon} className="h-5 w-5" aria-hidden="true" />
              <span className="text-sm font-semibold">{t.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
