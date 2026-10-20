import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { Icon } from "../components/icons";
import { techGroups } from "../data/content";

export default function TechStack() {
  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          label="Technology"
          title="Built With Modern Technology."
          subtitle="The tools behind the projects we have delivered — chosen for reliability, performance and long-term maintainability."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {techGroups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.05} className="h-full">
              <div className="h-full rounded-3xl border border-line bg-gradient-to-b from-lavender/70 to-white p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{g.title}</h3>
                <ul className="mt-4 grid gap-2 min-[360px]:grid-cols-2 sm:grid-cols-1">
                  {g.items.map((t) => (
                    <li key={t.name} className="flex min-w-0 items-center gap-2.5 rounded-xl border border-line/70 bg-white px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lavender text-ink/70">
                        <Icon name={t.icon} className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-[13px] font-semibold leading-tight text-ink sm:text-sm">{t.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
