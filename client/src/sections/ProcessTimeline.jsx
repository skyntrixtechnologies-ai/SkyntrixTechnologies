import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { Icon } from "../components/icons";
import { process } from "../data/content";

const ease = [0.22, 1, 0.36, 1];
const STEP_DURATION = 0.6;

// Each step only starts moving into place once the previous one has fully
// arrived (its own slide duration) plus this gap - a true sequential chain,
// not just a parallel stagger. Gaps: 1s after step 1, 0.4s after step 2,
// 0.2s after step 3.
const GAPS = [1, 0.4, 0.2];
const DELAYS = GAPS.reduce((acc, gap) => [...acc, acc[acc.length - 1] + STEP_DURATION + gap], [0]);
const SEQUENCE_END = DELAYS[DELAYS.length - 1] + STEP_DURATION;

const ICON_POSITIONS = [12.5, 37.5, 62.5, 87.5];
const ICON_TRAVEL_MS = 400;

// Once the reveal sequence lands, a small badge hops from icon to icon along
// the path - switching to that step's icon as it arrives - and loops.
function TravelingIcon({ icons, started }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!started) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % icons.length), ICON_TRAVEL_MS);
    return () => clearInterval(id);
  }, [started, icons.length]);

  return (
    <motion.span
      aria-hidden="true"
      className="absolute top-6 z-[1] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-primary-gradient text-white shadow-[0_10px_22px_-8px_rgba(114,0,245,0.8)] ring-4 ring-white md:grid"
      initial={{ opacity: 0 }}
      animate={{ left: `${ICON_POSITIONS[index]}%`, opacity: started ? [0, 1, 0] : 0 }}
      transition={{
        left: { duration: ICON_TRAVEL_MS / 1000, ease: "easeInOut" },
        opacity: { duration: ICON_TRAVEL_MS / 1000, times: [0, 0.5, 1], ease: "easeInOut" },
      }}
    >
      <Icon name={icons[index]} className="h-3.5 w-3.5" />
    </motion.span>
  );
}

export default function ProcessTimeline() {
  const [cascadeDone, setCascadeDone] = useState(false);

  // Timed from when the timeline actually scrolls into view (same trigger as
  // the step cascade below), not from mount - otherwise a user who scrolls
  // down slowly would see the traveling icon start before the steps do.
  function handleEnterView() {
    setTimeout(() => setCascadeDone(true), SEQUENCE_END * 1000);
  }

  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-b from-white via-cool/60 to-white">
      <div className="container-x">
        <SectionHeading
          label="How We Work"
          title="A Clear Path From Idea to Launch"
          subtitle="Four focused stages keep every project transparent, predictable and aligned with your goals."
        />

        <motion.ol
          className="relative grid gap-8 md:grid-cols-4 md:gap-6"
          onViewportEnter={handleEnterView}
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Connector — vertical on mobile, horizontal on desktop */}
          <span className="absolute bottom-6 left-6 top-6 w-px bg-line md:hidden" aria-hidden="true" />
          <span className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-line md:block" aria-hidden="true" />

          {/* 3 connector segments, each filling in as the next step arrives */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute top-6 hidden h-px origin-left bg-primary-gradient md:block"
              style={{ left: `${12.5 + i * 25}%`, width: "25%" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: STEP_DURATION, delay: DELAYS[i + 1], ease }}
            />
          ))}

          <TravelingIcon icons={process.map((p) => p.icon)} started={cascadeDone} />

          {process.map((p, i) => (
            <motion.li
              key={p.step}
              className="group relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: STEP_DURATION, delay: DELAYS[i], ease }}
            >
              {/* Oversized faint step numeral */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 right-0 font-display text-7xl font-black text-primary/[0.06] transition-colors duration-300 group-hover:text-primary/[0.1] md:left-1/2 md:right-auto md:top-2 md:-translate-x-1/2"
              >
                {p.step}
              </span>

              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-gradient text-white shadow-[0_12px_28px_-12px_rgba(114,0,245,0.8)] ring-[6px] ring-white transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_16px_34px_-10px_rgba(114,0,245,0.9)]">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <div className="relative md:mt-6">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step {p.step}</span>
                <h3 className="mt-1.5 font-display text-xl font-bold text-ink transition-colors duration-300 group-hover:text-primary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted md:mx-auto md:max-w-[230px]">{p.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
