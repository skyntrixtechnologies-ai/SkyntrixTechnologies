import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { Icon } from "../components/icons";
import { techGroups } from "../data/content";

const allItems = techGroups.flatMap((g) => g.items.map((item) => ({ ...item, group: g.title })));

export default function TechStack() {
  const [active, setActive] = useState("All");

  const filters = useMemo(() => ["All", ...techGroups.map((g) => g.title)], []);
  const visible = active === "All" ? allItems : allItems.filter((item) => item.group === active);

  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-primary-gradient opacity-[0.07] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[-8%] h-72 w-72 rounded-full bg-primary-gradient opacity-[0.06] blur-3xl" />
      <div className="container-x relative">
        <SectionHeading
          label="Technology"
          title="Built With Modern Technology."
          subtitle="The tools behind the projects we have delivered — chosen for reliability, performance and long-term maintainability."
        />

        <Reveal className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {filters.map((f) => {
            const count = f === "All" ? allItems.length : techGroups.find((g) => g.title === f).items.length;
            const isActive = active === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={isActive}
                className={`group inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-primary-gradient text-white shadow-soft"
                    : "border-line bg-white text-muted hover:border-primary/40 hover:text-primary"
                }`}
              >
                {f}
                <span
                  className={`grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold ${
                    isActive ? "bg-white/25 text-white" : "bg-lavender text-primary group-hover:bg-primary/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </Reveal>

        <motion.div layout className="flex flex-wrap justify-center gap-3.5 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((t) => (
              <motion.div
                key={t.name}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                className="group relative flex min-w-[9.5rem] items-center gap-3 overflow-hidden rounded-2xl border border-line bg-white px-4 py-3.5 shadow-card transition-shadow duration-300 hover:shadow-glow"
              >
                <span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
                  aria-hidden="true"
                />
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ backgroundColor: `${t.color}1A`, color: t.color }}
                >
                  <Icon name={t.icon} className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="relative">
                  <span className="block text-sm font-bold leading-tight text-ink">{t.name}</span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">{t.group}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
