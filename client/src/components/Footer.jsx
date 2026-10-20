import { Link } from "react-router-dom";
import { FaLinkedin, FaXTwitter, FaInstagram, FaFacebookF, FaDribbble, FaPhone, FaEnvelope, FaLocationDot, FaWhatsapp, FaArrowRight, FaClock } from "react-icons/fa6";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import { useConsult } from "./ConsultModal";
import { SITE, whatsAppLink, telLink } from "../config/site";
import { useSiteData } from "../lib/SiteDataContext";
import { services as staticServices } from "../data/services";

const quick = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Pricing", to: "/pricing" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" }
];

const industriesList = [
  { label: "Education", to: "/industries/education" },
  { label: "E-commerce", to: "/industries/ecommerce" },
  { label: "Restaurants", to: "/industries/restaurants" },
  { label: "Real Estate", to: "/industries/real-estate" },
  { label: "Small Business", to: "/industries/small-business" },
  { label: "Madurai", to: "/locations/madurai" }
];

const socials = [
  { icon: FaLinkedin, href: SITE.social.linkedin, label: "LinkedIn" },
  { icon: FaXTwitter, href: SITE.social.twitter, label: "X (Twitter)" },
  { icon: FaInstagram, href: SITE.social.instagram, label: "Instagram" },
  { icon: FaFacebookF, href: SITE.social.facebook, label: "Facebook" },
  { icon: FaDribbble, href: SITE.social.dribbble, label: "Dribbble" }
].filter((s) => s.href);

const heading = "font-display text-xs font-bold uppercase tracking-[0.16em] text-ink";
const linkCls = "text-sm text-muted transition-colors hover:text-primary";

export default function Footer() {
  const { data } = useSiteData();
  const { openConsult } = useConsult();
  const list = (data?.services?.length ? data.services : staticServices).map((s) => ({ label: s.name, slug: s.slug }));

  return (
    <footer className="relative overflow-hidden border-t border-line bg-gradient-to-b from-white to-lavender">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-secondary/10 blur-[110px]" aria-hidden="true" />

      <div className="container-x relative">
        {/* Enquiry strip */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-line py-10 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl font-bold text-ink sm:text-2xl">Have a project in mind?</p>
            <p className="mt-1 text-sm text-muted sm:text-[1rem]">Share your idea — we'll suggest a practical way to build it.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button type="button" onClick={openConsult} className="btn-primary group">
              Start a Project <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <FaWhatsapp className="h-4 w-4 text-[#1FAF54]" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-4 font-display text-base font-semibold text-ink">{SITE.tagline}.</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Websites, mobile apps and custom software for growing businesses — designed and built in Madurai.
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-muted transition-all hover:border-transparent hover:bg-primary-gradient hover:text-white"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Services" className="lg:col-span-3">
            <h2 className={heading}>Services</h2>
            <ul className="mt-5 space-y-2.5">
              {list.map((s) => (
                <li key={s.slug}><Link to={`/services/${s.slug}`} className={linkCls}>{s.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className={heading}>Company</h2>
            <ul className="mt-5 space-y-2.5">
              {quick.map((l) => (
                <li key={l.to}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
            <h2 className={`${heading} mt-8`}>Industries</h2>
            <ul className="mt-5 space-y-2.5">
              {industriesList.map((l) => (
                <li key={l.to}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-3">
            <h2 className={heading}>Get in Touch</h2>
            <ul className="mt-5 space-y-3.5 text-sm text-muted">
              <li className="flex items-start gap-3"><FaLocationDot className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{SITE.address.full}</span></li>
              <li className="flex items-center gap-3"><FaPhone className="h-4 w-4 shrink-0 text-primary" /><a href={telLink()} className="hover:text-primary">{SITE.phone}</a></li>
              <li className="flex items-center gap-3"><FaEnvelope className="h-4 w-4 shrink-0 text-primary" /><a href={`mailto:${SITE.email}`} className="break-all hover:text-primary">{SITE.email}</a></li>
              <li className="flex items-start gap-3"><FaClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{SITE.hours}</span></li>
            </ul>
            <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wider text-ink/70">Newsletter</p>
            <Newsletter light />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-7 text-center text-xs text-muted sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
