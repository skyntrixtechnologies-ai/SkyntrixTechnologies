import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { Icon } from "../components/icons";
import { industryPages as industries } from "../data/industries";

// Every card links to an existing /industries/:slug page.
export default function Industries() {
  return (
    <section className="section-pad bg-lavender/60">
      <div className="container-x">
        <SectionHeading
          label="Industries"
          title="Solutions Shaped Around Your Sector"
          subtitle="Each industry has its own customers and workflows. These are the sectors we design and build for."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.04} className="h-full">
              <Link
                to={`/industries/${ind.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lavender text-primary transition-colors group-hover:bg-primary-gradient group-hover:text-white">
                  <Icon name={ind.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-base font-bold text-ink">{ind.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{ind.short}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary">
                  Learn more <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
