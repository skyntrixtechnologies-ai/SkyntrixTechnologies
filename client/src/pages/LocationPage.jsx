import { useParams, Link } from "react-router-dom";
import { FaArrowRight, FaChevronLeft, FaCheck, FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";
import { motion } from "framer-motion";
import Seo, { getFAQSchema, getBreadcrumbSchema } from "../components/Seo";
import Reveal from "../components/Reveal";
import FAQ from "../components/FAQ";
import CtaSection from "../components/CtaSection";
import { Icon } from "../components/icons";
import { locationPages } from "../data/locations";
import { projects as allProjects } from "../data/portfolio";
import { SITE } from "../config/site";

export default function LocationPage() {
  const { slug } = useParams();
  const location = locationPages.find((l) => l.slug === slug);

  if (!location) {
    return (
      <>
        <Seo title="Location not found" path={`/locations/${slug}`} noindex />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="heading-lg text-ink">Location not found</h1>
          <Link to="/" className="btn-primary mt-6">Back to Home</Link>
        </div>
      </>
    );
  }

  const relatedProjects = location.projects
    .map((p) => allProjects.find((pr) => pr.slug === p))
    .filter(Boolean);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/" },
    { name: location.name }
  ];

  return (
    <>
      <Seo
        title={location.meta.title.replace(" | Skyntrix Technologies", "")}
        path={`/locations/${slug}`}
        description={location.meta.description}
        breadcrumbs={breadcrumbs}
        jsonLd={[getFAQSchema(location.faqs), getBreadcrumbSchema(breadcrumbs)].filter(Boolean)}
        keywords={location.meta.keywords}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pt-36 pb-20 text-white md:pt-44">
        <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
        <div className="container-x relative">
          <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <FaChevronLeft className="h-3 w-3" /> Back to Home
          </Link>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <FaLocationDot className="h-4 w-4 text-accent" /> {location.name}, {location.state}
            </span>
            <h1 className="heading-xl mt-5">{location.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/70">{location.overview}</p>
          </motion.div>
        </div>
      </section>

      {/* Why Skyntrix */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="text-center mb-14">
            <span className="label">Why Skyntrix</span>
            <h2 className="heading-lg mt-4">Why Businesses in {location.name} Choose Us</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {location.whySkyntrix.map((reason, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-start gap-3 rounded-xl bg-white p-5 shadow-card">
                  <FaCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-ink">{reason}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="text-center mb-14">
            <span className="label">Services</span>
            <h2 className="heading-lg mt-4">Our Services in {location.name}</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {location.services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05}>
                <Link to={`/services/${s.slug}`} className="card group block p-6 transition-all hover:-translate-y-1 hover:shadow-soft">
                  <h3 className="font-display text-lg font-bold text-ink transition-colors group-hover:text-primary">{s.name}</h3>
                  <p className="mt-2 text-sm text-ink/60">{s.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Learn More <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="text-center mb-10">
            <h2 className="heading-lg">Industries We Serve in {location.name}</h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {location.industries.map((ind) => (
              <span key={ind} className="rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-card">{ind}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      {relatedProjects.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-x">
            <Reveal className="mb-10 text-center">
              <span className="label">Portfolio</span>
              <h2 className="heading-lg mt-4">Projects from {location.name}</h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <Link to={`/portfolio/${p.slug}`} className="card group block p-6 transition-all hover:-translate-y-1 hover:shadow-soft">
                    <div className="text-xs font-semibold text-primary">{p.category}</div>
                    <h3 className="mt-2 font-display text-lg font-bold text-ink transition-colors group-hover:text-primary">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-ink/55">{p.overview}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Areas */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="text-center mb-10">
            <h2 className="heading-lg">Service Areas</h2>
            <p className="mt-3 text-ink/60">We serve businesses across {location.name} and surrounding areas</p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {location.serviceAreas.map((area) => (
              <span key={area} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-card border border-ink/5">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <div className="rounded-3xl bg-primary-gradient p-10 text-center text-white md:p-16">
            <Reveal>
              <h2 className="heading-lg">Get in Touch</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">Ready to start your project in {location.name}? Contact us for a free consultation.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href={`tel:${SITE.phone.replace(/[^0-9]/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-primary transition-all hover:shadow-glow">
                  <FaPhone className="h-4 w-4" /> {SITE.phone}
                </a>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition-all hover:bg-white/20">
                  <FaEnvelope className="h-4 w-4" /> {SITE.email}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="text-center mb-14">
            <span className="label">FAQ</span>
            <h2 className="heading-lg mt-4">Frequently Asked Questions</h2>
          </Reveal>
          <FAQ items={location.faqs} />
        </div>
      </section>

      <CtaSection title={`Ready to grow your business in ${location.name}?`} subtitle="Let's build digital solutions that drive real results." />
    </>
  );
}
