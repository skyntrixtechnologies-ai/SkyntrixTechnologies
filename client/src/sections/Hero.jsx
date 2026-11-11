import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import { useConsult } from "../components/ConsultModal";
import HeroVisual from "../components/HeroVisual";
import { heroContent } from "../data/content";

const WORD_INTERVAL = 2800;

function RotatingHeadline({ words, reduceMotion }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), WORD_INTERVAL);
    return () => clearInterval(id);
  }, [words.length, reduceMotion]);

  return (
    <span className="relative inline-grid text-left align-top">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-gradient col-start-1 row-start-1"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      {/* Reserves layout height using the longest word, invisible */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
    </span>
  );
}

export default function Hero() {
  const { openConsult } = useConsult();
  const reduceMotion = useReducedMotion();
  const { eyebrow, headlineLead, headlineWords, description, primaryCta, secondaryCta, trustPoints, stats } = heroContent;

  const fade = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
  });

  return (
    <section className="relative overflow-hidden bg-white pb-14 pt-24 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,rgba(114,0,245,0.10),transparent_70%),radial-gradient(50%_45%_at_95%_25%,rgba(32,72,245,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
      </div>

      <div className="container-x relative grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-14">
        <div className="max-w-2xl">
          <motion.p {...fade(0)} className="eyebrow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-primary-gradient" />
            </span>
            {eyebrow.label}
          </motion.p>

          <motion.h1 {...fade(0.08)} className="heading-display mt-6 text-ink">
            {headlineLead} <RotatingHeadline words={headlineWords} reduceMotion={reduceMotion} />
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={openConsult}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="btn-primary group relative overflow-hidden whitespace-nowrap !px-7 !py-3.5"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{primaryCta.label}</span>
              <FaArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <Link to={secondaryCta.to} className="btn-secondary group whitespace-nowrap !px-7 !py-3.5">
              {secondaryCta.label}
              <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.ul {...fade(0.32)} className="mt-8 flex flex-col gap-x-6 gap-y-2.5 sm:flex-row sm:flex-wrap">
            {trustPoints.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                <FaCircleCheck className="h-4 w-4 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </motion.ul>

          {stats?.length > 0 && (
            <motion.dl {...fade(0.4)} className="mt-10 grid w-full grid-cols-3 gap-4 border-t border-line pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-gradient text-xl font-extrabold tracking-tight sm:text-2xl">{s.value}</dd>
                  <dd className="mt-0.5 text-xs font-medium leading-tight text-muted">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>

        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
