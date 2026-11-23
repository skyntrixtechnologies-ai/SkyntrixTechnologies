import { Icon } from "../components/icons";
import { techGroups } from "../data/content";

// Compact strip of technologies used across delivered projects.
// Monochrome by default — these are tools we use, not partnerships.
const featured = ["React", "Node.js", "Express", "MongoDB", "MySQL", "Tailwind CSS", "Framer Motion", "Razorpay"];
const items = techGroups.flatMap((g) => g.items).filter((t) => featured.includes(t.name));

function LogoItem({ t, hidden = false }) {
  return (
    <li
      aria-hidden={hidden || undefined}
      className="group flex shrink-0 items-center gap-2.5 text-ink/55 transition-colors duration-200 hover:text-primary"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lavender/70 text-ink/50 transition-all duration-200 group-hover:scale-110 group-hover:bg-primary-gradient group-hover:text-white group-hover:shadow-[0_8px_18px_-8px_rgba(114,0,245,0.6)]">
        <Icon name={t.icon} className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <span className="whitespace-nowrap text-sm font-semibold">{t.name}</span>
    </li>
  );
}

export default function TechTrustStrip() {
  return (
    <section aria-label="Technologies we build with" className="border-y border-line/70 bg-white">
      <div className="container-x flex flex-col items-center gap-5 py-8 lg:flex-row lg:gap-10">
        <p className="shrink-0 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted lg:max-w-[180px] lg:text-left">
          Technologies used in our delivered projects
        </p>

        <div
          className="group/marquee relative w-full min-w-0 flex-1 overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
        >
          <ul className="flex w-max animate-marquee items-center gap-x-10 group-hover/marquee:[animation-play-state:paused] sm:gap-x-12">
            {items.map((t) => (
              <LogoItem key={t.name} t={t} />
            ))}
            {items.map((t) => (
              <LogoItem key={`dup-${t.name}`} t={t} hidden />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
