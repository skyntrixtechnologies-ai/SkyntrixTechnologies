import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight, FaBriefcase, FaCheck, FaChevronDown, FaChevronRight, FaCircleInfo, FaGem, FaGlobe,
  FaLayerGroup, FaMinus, FaMobileScreenButton, FaPlus, FaRocket
} from "react-icons/fa6";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import FAQ from "../components/FAQ";
import { useConsult } from "../components/ConsultModal";
import { pricingCategories, pricingFaqs } from "../data/pricing";

const ease = [0.22, 1, 0.36, 1];
const VISIBLE_FEATURES = 7;

const planIcons = [FaGlobe, FaRocket, FaBriefcase, FaGem];
const categoryIcons = { website: FaGlobe, app: FaMobileScreenButton };

const priceLabel = (plan) => [plan.pricePrefix, plan.price].filter(Boolean).join(" ");
const isCustom = (plan) => /custom/i.test(plan.id);

function enquiryFor(category, plan) {
  const price = priceLabel(plan);
  return {
    service: category.service,
    plan: plan.name,
    price,
    message: `Hi Skyntrix, I'm interested in the ${plan.name} package (${price}).\n\nMy requirements:\n`
  };
}

/* ───────────────────────── Category switcher ───────────────────────── */

function CategorySwitcher({ categories, activeId, onChange }) {
  const refs = useRef([]);
  const onKeyDown = (e, index) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + categories.length) % categories.length;
    onChange(categories[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Pricing category"
      className="mx-auto grid w-full max-w-md grid-cols-2 gap-1 rounded-full sm:max-w-xl border border-line bg-white p-1.5 shadow-[0_10px_30px_-18px_rgba(72,24,160,0.35)]"
    >
      {categories.map((c, i) => {
        const active = c.id === activeId;
        const Ico = categoryIcons[c.id] || FaLayerGroup;
        return (
          <button
            key={c.id}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            id={`tab-${c.id}`}
            aria-selected={active}
            aria-controls="pricing-panel"
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(c.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`relative flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
              active ? "text-white" : "text-muted hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="pricing-tab-pill"
                className="absolute inset-0 rounded-full bg-primary-gradient shadow-[0_8px_20px_-10px_rgba(114,0,245,0.8)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Ico className="relative h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="relative">
              <span className="sm:hidden">{c.id === "app" ? "Mobile Apps" : "Websites"}</span>
              <span className="hidden sm:inline">{c.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Pricing card ───────────────────────── */

function PricingCard({ plan, category, index }) {
  const { openConsult } = useConsult();
  const [expanded, setExpanded] = useState(false);
  const featured = plan.featured;
  const custom = isCustom(plan);
  const Ico = planIcons[index] || FaGlobe;

  const allItems = plan.groups.flatMap((g) => g.items.map((item) => ({ group: g.title, item })));
  const hiddenCount = Math.max(0, allItems.length - VISIBLE_FEATURES);
  const visible = expanded ? allItems : allItems.slice(0, VISIBLE_FEATURES);
  const visibleGroups = plan.groups
    .map((g) => ({ title: g.title, items: visible.filter((v) => v.group === g.title).map((v) => v.item) }))
    .filter((g) => g.items.length);

  const unit = category.unit.toLowerCase();
  const allowance = /^up to/i.test(plan.pages) ? `${plan.pages} ${unit}` : `${category.unit}: ${plan.pages}`;

  return (
    <article
      className={`group relative flex h-full flex-col rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7 ${
        featured
          ? "border-primary/40 bg-gradient-to-b from-lavender to-white shadow-elevated ring-1 ring-primary/15"
          : "border-line bg-white hover:border-primary/25 hover:shadow-elevated"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary-gradient px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_8px_20px_-8px_rgba(114,0,245,0.8)]">
          Most Popular
        </span>
      )}
      {custom && (
        <span className="absolute -top-3 left-6 rounded-full border border-secondary/30 bg-cool px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
          Flexible Scope
        </span>
      )}

      <div>
        <span
          className={`grid h-11 w-11 place-items-center rounded-2xl ${
            featured ? "bg-primary-gradient text-white" : custom ? "bg-cool text-secondary" : "bg-lavender text-primary"
          }`}
        >
          <Ico className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-ink">{plan.name}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted xl:min-h-[4.25rem]">{plan.tagline}</p>

      <div className="mt-5 border-t border-line pt-5">
        <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
          {plan.pricePrefix || "Price"}
        </span>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
          <span className={`font-display font-extrabold tracking-tight text-ink ${plan.price.length > 10 ? "text-[1.7rem] leading-tight" : "text-[2.1rem] leading-none"}`}>
            {plan.price}
          </span>
          {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
        </div>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-lavender px-3 py-1.5 text-xs font-semibold text-primary">
          <FaLayerGroup className="h-3 w-3" aria-hidden="true" />
          {allowance}
        </span>
      </div>

      <button
        type="button"
        onClick={() => openConsult(enquiryFor(category, plan))}
        className={`mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
          featured
            ? "bg-primary-gradient text-white shadow-soft hover:-translate-y-0.5 hover:shadow-glow"
            : "border border-primary/25 bg-white text-primary hover:border-primary/50 hover:bg-lavender"
        }`}
      >
        {plan.cta}
        <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </button>

      <div className="mt-6 space-y-5">
        {visibleGroups.map((g) => (
          <div key={g.title}>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/70">{g.title}</p>
            <ul className="mt-3 space-y-2.5">
              {g.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-ink/80">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <FaCheck className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {expanded ? <FaMinus className="h-3 w-3" aria-hidden="true" /> : <FaPlus className="h-3 w-3" aria-hidden="true" />}
          {expanded ? "Show fewer features" : `Show ${hiddenCount} more feature${hiddenCount > 1 ? "s" : ""}`}
        </button>
      )}

      {plan.pagesList?.length > 0 && (
        <div className="mt-auto pt-6">
        <details className="group/details border-t border-line pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded text-sm font-semibold text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-details-marker]:hidden">
            {category.scopeLabel} ({plan.pagesList.length})
            <FaChevronDown className="h-3 w-3 text-muted transition-transform group-open/details:rotate-180" aria-hidden="true" />
          </summary>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {plan.pagesList.map((p) => <li key={p} className="chip">{p}</li>)}
          </ul>
        </details>
        </div>
      )}
    </article>
  );
}

/* ───────────────────────── Comparison ───────────────────────── */

function Cell({ value }) {
  if (value === true) {
    return (
      <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
        <FaCheck className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (value === false || value === "—") {
    return (
      <span className="text-ink/30">
        <FaMinus className="mx-auto h-3 w-3" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return <span className="text-sm font-medium text-ink/80">{value}</span>;
}

function Comparison({ category }) {
  const plans = category.plans;
  const rows = category.comparison.filter((r) => r.label !== "Price");
  // Rows every plan includes are summarised once instead of repeated in the table.
  const common = rows.filter((r) => r.values.every((v) => v === true)).map((r) => r.label);
  const diffRows = rows.filter((r) => !r.values.every((v) => v === true));

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading
          label="Compare Packages"
          title="What Changes Between Packages"
          subtitle={`A side-by-side view of the key differences between our ${category.label.toLowerCase()} packages.`}
        />

        {common.length > 0 && (
          <Reveal className="mb-6 flex flex-col gap-3 rounded-2xl border border-line bg-lavender/60 px-5 py-4 sm:flex-row sm:items-center">
            <span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-primary">Included in every plan</span>
            <ul className="flex flex-wrap gap-2">
              {common.map((c) => (
                <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink/80">
                  <FaCheck className="h-2.5 w-2.5 text-primary" aria-hidden="true" /> {c}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal>
          <p className="mb-2 text-xs text-muted md:hidden">Swipe sideways to compare all packages →</p>
          <div className="relative overflow-x-auto rounded-3xl border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" tabIndex={0} aria-label={`${category.label} package comparison`}>
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <caption className="sr-only">{category.label} package comparison</caption>
              <thead>
                <tr className="bg-lavender/60">
                  <th scope="col" className="sticky left-0 z-10 w-[132px] bg-lavender px-4 py-4 text-left font-display text-sm font-bold text-ink sm:w-auto sm:px-5">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className={`px-4 py-4 text-center ${p.featured ? "bg-primary/[0.07]" : ""}`}>
                      <span className="block font-display text-sm font-bold text-ink">{p.name}</span>
                      <span className="mt-0.5 block text-xs font-medium text-muted">{priceLabel(p)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <th scope="row" className="sticky left-0 z-10 w-[132px] bg-white px-4 py-3.5 text-left text-[13px] font-medium text-ink sm:w-auto sm:px-5 sm:text-sm">
                      {row.label === "Pages" || row.label === "Screens" ? category.unit : row.label}
                    </th>
                    {row.values.map((v, j) => (
                      <td key={j} className={`px-4 py-3.5 text-center ${plans[j]?.featured ? "bg-primary/[0.04]" : ""}`}>
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function Pricing() {
  const { openConsult } = useConsult();
  const [params, setParams] = useSearchParams();
  const active = pricingCategories.find((c) => c.id === params.get("category")) || pricingCategories[0];

  const selectCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id === pricingCategories[0].id) next.delete("category");
    else next.set("category", id);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <Seo
        title="Website & Mobile App Development Pricing"
        path="/pricing"
        description="Transparent website and mobile app development pricing from Skyntrix Technologies in Madurai. Website packages from ₹9,999 and Android app packages starting at ₹15,000."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Pricing" }
        ]}
        keywords={[
          "Website Development Pricing Madurai",
          "Website Development Company in Madurai",
          "Mobile App Development Cost",
          "Business Website Development",
          "Android App Development Madurai"
        ]}
        faqs={pricingFaqs}
      />

      {/* Header */}
      <section className="relative overflow-hidden bg-white pb-14 pt-32 md:pb-16 md:pt-40">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_20%_0%,rgba(114,0,245,0.10),transparent_70%),radial-gradient(45%_45%_at_90%_10%,rgba(32,72,245,0.09),transparent_70%)]" />
          <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        </div>
        <div className="container-x relative text-center">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2 text-sm text-muted">
            <Link to="/" className="hover:text-primary">Home</Link>
            <FaChevronRight className="h-2.5 w-2.5" aria-hidden="true" />
            <span className="text-ink" aria-current="page">Pricing</span>
          </nav>
          <Reveal>
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-gradient" />
              Transparent Pricing
            </span>
            <h1 className="heading-display mx-auto mt-5 max-w-4xl text-balance text-ink">
              Choose the Right Solution <span className="text-gradient">for Your Business.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Flexible website and mobile app development packages designed around your business goals, requirements and budget.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <p className="text-sm text-ink/80">Not sure which package is right for you? Let's discuss your requirements.</p>
              <button
                type="button"
                onClick={() => openConsult({ service: active.service })}
                className="btn-secondary group !py-2.5 text-sm"
              >
                Get Expert Guidance
                <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          </Reveal>
          <div className="mt-10">
            <CategorySwitcher categories={pricingCategories} activeId={active.id} onChange={selectCategory} />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="relative bg-gradient-to-b from-white via-lavender/50 to-white pb-20 pt-4 md:pb-28">
        <div className="container-x">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              id="pricing-panel"
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="grid gap-6 pt-3 sm:grid-cols-2 xl:grid-cols-4">
                {active.plans.map((p, i) => (
                  <PricingCard key={p.id} plan={p} category={active} index={i} />
                ))}
              </div>

              {active.note && (
                <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-line bg-white px-5 py-4">
                  <FaCircleInfo className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-muted">{active.note}</p>
                </div>
              )}

              {active.addOns?.length > 0 && (
                <div className="mx-auto mt-12 max-w-4xl">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-display text-xl font-bold text-ink">Optional Add-ons</h2>
                    <span className="text-xs font-medium text-muted">Available with {active.label.toLowerCase()} packages</span>
                  </div>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {active.addOns.map((a) => (
                      <li key={a.name} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-white p-5">
                        <div>
                          <span className="rounded-full bg-cool px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">Optional</span>
                          <p className="mt-2 font-semibold text-ink">{a.name}</p>
                          <p className="mt-1 text-sm text-muted">{a.desc}</p>
                        </div>
                        <span className="shrink-0 font-display text-lg font-extrabold text-primary">{a.price}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    Add-on prices cover integration work only. Provider charges (payment gateway fees, SMS or WhatsApp
                    messaging costs) are billed separately by the provider and depend on your usage.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Comparison category={active} />

      {/* Custom quote */}
      <section className="bg-white pb-20 md:pb-28">
        <Reveal className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-lavender px-6 py-14 text-center sm:px-10 md:py-16">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-[90px]" />
              <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-secondary/20 blur-[90px]" />
              <div className="absolute right-[12%] top-10 hidden h-20 w-20 rotate-12 rounded-2xl border border-primary/15 md:block" />
              <div className="absolute bottom-10 left-[10%] hidden h-12 w-12 rounded-full border border-dashed border-secondary/30 md:block" />
            </div>
            <div className="relative mx-auto max-w-2xl">
              <h2 className="heading-lg text-balance text-ink">Have a Unique Project in Mind?</h2>
              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                Every business has different requirements. Tell us what you want to build, and we'll help you identify the right solution.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() =>
                    openConsult({
                      service: active.service,
                      plan: "Custom Quote",
                      message: `Hi Skyntrix, I'd like a custom quote for a ${active.service.toLowerCase()} project.\n\nWhat I want to build:\n`
                    })
                  }
                  className="btn-primary group !px-7 !py-3.5"
                >
                  Request a Custom Quote
                  <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
                <Link to="/contact" className="btn-secondary !px-7 !py-3.5">Talk to Our Team</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-lavender/60">
        <div className="container-x">
          <SectionHeading label="FAQ" title="Pricing Questions" subtitle="Straight answers about what's included and how pricing works." />
          <FAQ items={pricingFaqs} />
        </div>
      </section>
    </>
  );
}
