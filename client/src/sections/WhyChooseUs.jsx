import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import Reveal from "../components/Reveal";
import { Icon } from "../components/icons";
import { whyChooseUs } from "../data/content";

// Alternating vertical rhythm for the cards row (desktop only) — cards 1 and 3
// sit lower, giving a staggered zigzag feel without ever overlapping or
// hiding another card's content.

export default function WhyChooseUs() {
  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-secondary/10 blur-[110px]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="relative">
          <Reveal className="mx-auto text-center">
            <span className="eyebrow">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-primary-gradient" />
              </span>
              Why Skyntrix
            </span>
            <h2 className="heading-lg mx-auto mt-4 text-ink lg:max-w-5xl lg:whitespace-nowrap">Technology That Moves Your Business Forward.</h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              We are a focused team that builds around your business — not around a template. You get practical
              solutions, honest advice and code that is built to last.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex justify-center lg:absolute lg:right-0 lg:top-1 lg:mt-0 lg:block">
            <Link to="/about" className="btn-secondary">
              About Skyntrix <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {whyChooseUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06} className="h-full">
              <div
                className={`why-stagger-${i} group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-7 transition-all duration-500 ease-out hover:z-10 hover:!-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_28px_50px_-24px_rgba(72,24,160,0.4)]`}
              >
                {/* Top sheen line, like ServiceCard's hover accent */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Diagonal shimmer sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lavender/70 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

                {/* Oversized faint background numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-6 font-display text-8xl font-black text-primary/[0.05] transition-colors duration-300 group-hover:text-primary/[0.09]"
                >
                  0{i + 1}
                </span>

                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary-gradient text-white shadow-[0_10px_24px_-12px_rgba(114,0,245,0.8)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={w.icon} className="h-5 w-5" />
                </span>
                <h3 className="relative mt-6 font-display text-lg font-bold text-ink transition-colors duration-300 group-hover:text-primary">{w.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
