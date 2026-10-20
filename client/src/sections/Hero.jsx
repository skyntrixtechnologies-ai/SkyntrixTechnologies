import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import { useConsult } from "../components/ConsultModal";
import HeroVisual from "../components/HeroVisual";
import { heroContent } from "../data/content";

export default function Hero() {
  const { openConsult } = useConsult();
  const reduceMotion = useReducedMotion();
  const { eyebrow, headlineLead, headlineGradient, description, primaryCta, secondaryCta, trustPoints } = heroContent;

  const fade = (delay) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
  });

  return (
    <section className="relative overflow-hidden bg-white pb-14 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,rgba(114,0,245,0.10),transparent_70%),radial-gradient(50%_45%_at_95%_25%,rgba(32,72,245,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
      </div>

      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-14">
        <div className="max-w-2xl">
          <motion.p {...fade(0)} className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-gradient" />
            {eyebrow.label}
          </motion.p>

          <motion.h1 {...fade(0.08)} className="heading-display mt-6 text-ink">
            {headlineLead} <span className="text-gradient">{headlineGradient}</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openConsult} className="btn-primary group !px-7 !py-3.5">
              {primaryCta.label}
              <FaArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <Link to={secondaryCta.to} className="btn-secondary group !px-7 !py-3.5">
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
