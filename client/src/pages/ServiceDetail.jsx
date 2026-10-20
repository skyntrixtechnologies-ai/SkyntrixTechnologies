import { useParams, Link } from "react-router-dom";
import { FaArrowRight, FaCheck, FaChevronLeft } from "react-icons/fa6";
import { motion } from "framer-motion";
import Seo, { getServiceSchema } from "../components/Seo";
import Reveal from "../components/Reveal";
import FAQ from "../components/FAQ";
import LeadForm from "../components/LeadForm";
import { Icon } from "../components/icons";
import { useSiteData } from "../lib/SiteDataContext";

const serviceProblems = {
  "website-development": [
    "Your current website is slow and loses visitors before they even see your content",
    "Your site doesn't look professional — it's hurting your brand credibility",
    "You're not ranking on Google because your site isn't SEO-friendly",
    "Your website doesn't work well on mobile devices",
    "You can't update content yourself without calling a developer",
    "Your competitor's website looks better and is getting more leads"
  ],
  "mobile-app-development": [
    "You need to reach customers on their phones but don't have a mobile presence",
    "Your web-only solution doesn't work offline or send push notifications",
    "You want to build an MVP to validate a mobile app idea",
    "Your existing app is buggy and users are leaving negative reviews",
    "You need both iOS and Android but can't afford two separate builds",
    "You want to add mobile features like camera, GPS or payments to your service"
  ],
  "ui-ux-design": [
    "Your website or app looks dated and doesn't match modern design standards",
    "Users are confused by your navigation and can't find what they need",
    "Your conversion rates are low despite good traffic",
    "You're launching a new product and need a design that stands out",
    "Your design system is inconsistent across different pages and platforms",
    "You need to redesign without losing existing functionality"
  ],
  "seo": [
    "Your website doesn't appear on Google for important search terms",
    "You're getting traffic but it's not converting into leads or sales",
    "Your competitors rank higher than you despite offering similar services",
    "You've tried SEO before but didn't see results",
    "You don't know where to start with search engine optimization",
    "Your website has technical issues that are hurting your rankings"
  ],
  "social-media-marketing": [
    "You're posting regularly but not getting engagement or followers",
    "You don't have a social media strategy — just random posts",
    "Your competitors are getting more attention on social media",
    "You're spending on ads but not seeing a return on investment",
    "You don't have time to manage social media while running your business",
    "You want to build a community, not just broadcast messages"
  ],
  "branding": [
    "Your logo and visual identity look amateur or outdated",
    "Your brand doesn't stand out from competitors",
    "You've outgrown your current branding and need a refresh",
    "You're starting a new business and need a complete brand identity",
    "Your branding is inconsistent across your website, social media and print",
    "You want to build trust and recognition with a professional brand"
  ],
  "poster-designing": [
    "Your social media posts get lost in the feed — no visual impact",
    "Your event posters don't attract attention or communicate clearly",
    "You need consistent branded visuals across multiple platforms",
    "Your current designs look generic and template-based",
    "You need fast turnaround on marketing creatives",
    "You want print-quality designs for outdoor and indoor advertising"
  ],
  "website-maintenance": [
    "Your website hasn't been updated in months and is falling behind",
    "You're worried about security vulnerabilities on your site",
    "Your site went down and you didn't know until a customer told you",
    "You don't have time to handle backups, updates and monitoring",
    "Your website is getting slower over time",
    "You need someone to fix bugs and make updates without a full redesign"
  ]
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data, loading } = useSiteData();
  const services = data?.services || [];
  const projects = data?.projects || [];
  const service = services.find((s) => s.slug === slug) || services[0];

  if (loading && !service) {
    return (
      <>
        <Seo title="Services" path={`/services/${slug}`} noindex />
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Seo title="Service not found" path={`/services/${slug}`} noindex />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="heading-lg text-ink">Service not found</h1>
          <Link to="/services" className="btn-primary mt-6">Back to Services</Link>
        </div>
      </>
    );
  }

  const problems = serviceProblems[slug] || [
    "You need a better digital presence to compete in today's market",
    "Your current solution doesn't meet your business needs",
    "You want to grow your business with modern digital tools",
    "You need professional expertise to get the job done right",
    "Your competitors are investing in digital — you need to keep up",
    "You want a partner who understands your business goals"
  ];

  const relatedProjects = projects.filter((p) => {
    if (slug === "website-development") return p.category === "Website";
    if (slug === "mobile-app-development") return p.category === "Mobile App";
    if (slug === "ui-ux-design") return true;
    if (slug === "seo") return true;
    if (slug === "social-media-marketing") return p.category === "Digital Marketing";
    if (slug === "branding") return true;
    if (slug === "ecommerce-development") return p.category === "E-Commerce";
    return false;
  }).slice(0, 3);

  const serviceSchema = getServiceSchema(service, `/services/${slug}`);
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: service.name }
  ];

  return (
    <>
      <Seo
        title={`${service.name} Company in Madurai`}
        path={`/services/${slug}`}
        description={service.short}
        jsonLd={serviceSchema}
        breadcrumbs={breadcrumbs}
        keywords={[`${service.name} in Madurai`, `${service.name} Tamil Nadu`, `${service.name} India`, service.name, "Skyntrix Technologies"]}
      />
      <section className="relative overflow-hidden bg-ink pt-36 pb-20 text-white md:pt-44">
        <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/services" className="mb-5 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><FaChevronLeft className="h-3 w-3" /> Back to Services</Link>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <Icon name={service.icon} className="h-4 w-4 text-accent" /> Starting {service.priceFrom}
            </span>
            <h1 className="heading-xl mt-5">{service.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-white/70">{service.overview}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {service.technologies.map((t) => (
                <span key={t} className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur">{t}</span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">Start Your Project <FaArrowRight className="h-4 w-4" /></Link>
              <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10">View Our Work <FaArrowRight className="h-4 w-4" /></Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-gradient text-white"><Icon name={service.icon} className="h-6 w-6" /></span>
              <div>
                <h2 className="font-display text-lg font-bold">Request a Quote</h2>
                <p className="text-sm text-white/60">Get a free, detailed estimate</p>
              </div>
            </div>
            <div className="[&_input]:!bg-white/5 [&_input]:!text-white [&_select]:!bg-white/5 [&_select]:!text-white [&_select>*]:!text-ink [&_textarea]:!bg-white/5 [&_textarea]:!text-white [&_textarea]:placeholder:text-white/40">
              <LeadForm compact defaultService={service.name} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problems */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="text-center mb-14">
            <span className="label">The Problem</span>
            <h2 className="heading-lg mt-4">Common Challenges Businesses Face</h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink/60">These are the issues we hear about most from businesses looking for {service.name.toLowerCase()} solutions.</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <p className="text-sm font-medium text-ink/80">✕ {p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="text-center mb-14">
            <span className="label">Our Solution</span>
            <h2 className="heading-lg mt-4">How We Solve These Problems</h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink/60">Our {service.name.toLowerCase()} approach is designed to address real business challenges with measurable outcomes.</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((b, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="rounded-xl border border-primary/15 bg-white p-5 shadow-card">
                  <FaCheck className="h-4 w-4 shrink-0 text-primary" />
                  <p className="mt-2 text-sm font-medium text-ink">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad bg-base">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="label">What's Included</span>
            <h2 className="heading-lg mt-4">Features & Deliverables</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-card">
                  <FaCheck className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-ink">{f}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="label">Technology</span>
            <h2 className="heading-lg mt-4">Tech Stack We Use</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {service.technologies.map((t) => (
                <span key={t} className="rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink shadow-card">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Workflow */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="text-center mb-14"><span className="label">Our Workflow</span><h2 className="heading-lg mt-4">How We Deliver</h2></Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.workflow.map((w, i) => (
              <Reveal key={w.step} delay={i * 0.08} className="h-full">
                <div className="card flex h-full flex-col p-7 text-center hover:-translate-y-1 hover:shadow-soft">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary-gradient font-display font-bold text-white">{w.step}</span>
                  <h3 className="heading-md mt-4 text-ink">{w.title}</h3>
                  <p className="mt-2 text-sm text-ink/55">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="section-pad bg-base">
          <div className="container-x">
            <Reveal className="mb-10 text-center">
              <span className="label">Case Studies</span>
              <h2 className="heading-lg mt-4">Related Projects</h2>
              <p className="mx-auto mt-3 max-w-xl text-ink/60">See how we've delivered results for businesses like yours.</p>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <Link to={`/portfolio/${p.slug}`} className="card group block p-6 transition-all hover:-translate-y-1 hover:shadow-soft">
                    <div className="text-xs font-semibold text-primary">{p.category}</div>
                    <h3 className="mt-2 font-display text-lg font-bold text-ink transition-colors group-hover:text-primary">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-ink/55">{p.overview}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">View Case Study <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="text-center mb-14"><span className="label">FAQ</span><h2 className="heading-lg mt-4">Frequently Asked Questions</h2></Reveal>
          <FAQ items={service.faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-base">
        <div className="container-x">
          <div className="rounded-3xl bg-primary-gradient p-10 text-center text-white md:p-16">
            <Reveal>
              <h2 className="heading-lg">Have a project in mind?</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">Let's build something exceptional together. Get a free consultation and detailed quote.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-primary transition-all hover:shadow-glow">Start Your Project <FaArrowRight className="h-4 w-4" /></Link>
                <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition-all hover:bg-white/20">View Our Work</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="section-pad bg-white">
        <div className="container-x">
          <Reveal className="mb-10 text-center"><h2 className="heading-lg">Explore More Services</h2></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.filter((s) => s.slug !== slug).slice(0, 4).map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="card group flex items-center justify-between gap-3 p-5 hover:-translate-y-1 hover:shadow-soft">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary-gradient group-hover:text-white"><Icon name={s.icon} /></span>
                  <span className="text-sm font-semibold text-ink">{s.name}</span>
                </span>
                <FaArrowRight className="text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
