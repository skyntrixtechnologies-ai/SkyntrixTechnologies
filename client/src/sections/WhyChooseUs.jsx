import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import Reveal from "../components/Reveal";
import { Icon } from "../components/icons";
import { whyChooseUs } from "../data/content";

export default function WhyChooseUs() {
  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-secondary/10 blur-[110px]" aria-hidden="true" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-gradient" />
            Why Skyntrix
          </span>
          <h2 className="heading-lg mt-4 text-balance text-ink">Technology That Moves Your Business Forward.</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            We are a focused team that builds around your business — not around a template. You get practical
            solutions, honest advice and code that is built to last.
          </p>
          <Link to="/about" className="btn-secondary mt-8">
            About Skyntrix <FaArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {whyChooseUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06} className="h-full">
              <div className="group h-full rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-elevated">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-gradient text-white shadow-[0_10px_24px_-12px_rgba(114,0,245,0.8)]">
                    <Icon name={w.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-bold text-primary/30">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-lg font-bold text-ink">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
