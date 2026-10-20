import { useParams, Link } from "react-router-dom";
import { FaArrowRight, FaChevronLeft, FaCheck } from "react-icons/fa6";
import { motion } from "framer-motion";
import Seo, { getFAQSchema, getBreadcrumbSchema } from "../components/Seo";
import Reveal from "../components/Reveal";
import FAQ from "../components/FAQ";
import CtaSection from "../components/CtaSection";
import { Icon } from "../components/icons";
import { industryPages } from "../data/industries";
import { services as allServices } from "../data/services";
import { projects as allProjects } from "../data/portfolio";

export default function IndustryPage() {
  const { slug } = useParams();
  const industry = industryPages.find((i) => i.slug === slug);

  if (!industry) {
    return (
      <>
        <Seo title="Industry not found" path={`/industries/${slug}`} noindex />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="heading-lg text-ink">Industry not found</h1>
          <Link to="/" className="btn-primary mt-6">Back to Home</Link>
        </div>
      </>
    );
  }

  const relatedServices = industry.services
    .map((s) => allServices.find((sv) => sv.slug === s))
    .filter(Boolean);

  const relatedProjects = industry.projects
    .map((p) => allProjects.find((pr) => pr.slug === p))
    .filter(Boolean);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Industries", url: "/" },
    { name: industry.name }
  ];

  return (
    <>
      <Seo
        title={industry.name + " Solutions"}
        path={`/industries/${slug}`}
        description={industry.short}
        breadcrumbs={breadcrumbs}
        jsonLd={[getFAQSchema(industry.faqs), getBreadcrumbSchema(breadcrumbs)].filter(Boolean)}
        keywords={[`${industry.name} software development`, `${industry.name} website development`, `${industry.name} app development`, `Skyntrix ${industry.name}`]}
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
              <Icon name={industry.icon} className="h-4 w-4 text-accent" /> {industry.name} Industry
            </span>
            <h1 className="heading-xl mt-5">{industry.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/70">{industry.overview}</p>
          </motion.div>
        </div>
      </section>

      {/* Challenges */}
      <section className="section-pad bg-base">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="label">Challenges</span>
            <h2 className="heading-lg mt-4">Common Digital Challenges in {industry.name}</h2>
            <div className="mt-7 space-y-3">
              {industry.challenges.map((c, i) => (
                <div key={i} className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-ink/80">✕ {c}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="label">Solutions</span>
            <h2 className="heading-lg mt-4">How Skyntrix Solves Them</h2>
            <div className="mt-7 space-y-3">
              {industry.solutions.map((s, i) => (
                <div key={i} className="rounded-xl border border-primary/15 bg-white p-4">
                  <p className="text-sm font-medium text-ink/80">✓ {s}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="text-center mb-14">
            <span className="label">Features</span>
            <h2 className="heading-lg mt-4">What We Build for {industry.name}</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industry.features.map((f, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="flex items-center gap-3 rounded-xl bg-base p-4">
                  <FaCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-ink">{f}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="text-center mb-10">
            <span className="label">Technology</span>
            <h2 className="heading-lg mt-4">Tech Stack We Use</h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {industry.technologies.map((t) => (
              <span key={t} className="rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-card">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-x">
            <Reveal className="mb-10 text-center">
              <span className="label">Case Studies</span>
              <h2 className="heading-lg mt-4">Projects in {industry.name}</h2>
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

      {/* Related Services */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="mb-10 text-center">
            <h2 className="heading-lg">Services for {industry.name}</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="card group flex items-center justify-between gap-3 p-5 hover:-translate-y-1 hover:shadow-soft">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary-gradient group-hover:text-white">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-ink">{s.name}</span>
                </span>
                <FaArrowRight className="text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="text-center mb-14">
            <span className="label">FAQ</span>
            <h2 className="heading-lg mt-4">Frequently Asked Questions</h2>
          </Reveal>
          <FAQ items={industry.faqs} />
        </div>
      </section>

      <CtaSection title={`Ready to grow your ${industry.name} business?`} subtitle="Let's build digital solutions that drive real results." />
    </>
  );
}
