import { motion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import { Icon } from "../components/icons";
import { process } from "../data/content";

const ease = [0.22, 1, 0.36, 1];

export default function ProcessTimeline() {
  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-b from-white via-cool/60 to-white">
      <div className="container-x">
        <SectionHeading
          label="How We Work"
          title="A Clear Path From Idea to Launch"
          subtitle="Four focused stages keep every project transparent, predictable and aligned with your goals."
        />

        <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
          {/* Connector — vertical on mobile, horizontal on desktop */}
          <span className="absolute bottom-6 left-6 top-6 w-px bg-line md:hidden" aria-hidden="true" />
          <span className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-line md:block" aria-hidden="true" />
          <motion.span
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px origin-left bg-primary-gradient md:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease }}
          />

          {process.map((p, i) => (
            <motion.li
              key={p.step}
              className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.15, ease }}
            >
              <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-gradient text-white shadow-[0_12px_28px_-12px_rgba(114,0,245,0.8)] ring-[6px] ring-white">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <div className="md:mt-6">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Step {p.step}</span>
                <h3 className="mt-1.5 font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted md:mx-auto md:max-w-[230px]">{p.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
