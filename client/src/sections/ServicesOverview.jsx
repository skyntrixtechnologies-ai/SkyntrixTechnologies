import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import Reveal from "../components/Reveal";
import { useConsult } from "../components/ConsultModal";
import { useSiteData } from "../lib/SiteDataContext";
import { services as staticServices } from "../data/services";

export default function ServicesOverview() {
  const { data } = useSiteData();
  const { openConsult } = useConsult();
  // Static services share slugs with the CMS, so they are a safe placeholder while the API responds.
  const services = (data?.services || staticServices).slice(0, 8);
  // 4 columns when the count divides evenly into rows of 4, otherwise 3.
  const cols = services.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          label="Our Services"
          title="Digital Solutions Built Around Your Business."
          subtitle="From your first online presence to complex business applications, we help turn ideas into practical digital products."
        />

        <div className={`grid gap-5 sm:grid-cols-2 ${cols}`}>
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 0.05} className="h-full">
              <ServiceCard service={s} showFeatures />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6">
          <div className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-primary/10 bg-gradient-to-r from-lavender via-white to-cool p-6 sm:p-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="font-display text-lg font-bold text-ink sm:text-xl">Need custom software or business automation?</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[1rem]">
                Management portals, CRMs, booking systems and workflow tools are scoped around your process. Tell us what you need to streamline.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <button type="button" onClick={openConsult} className="btn-primary">
                Discuss Your Requirements
              </button>
              <Link to="/services" className="btn-secondary">
                All Services <FaArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
