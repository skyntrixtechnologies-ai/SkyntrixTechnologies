import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaFacebookF,
  FaDribbble,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaWhatsapp,
  FaArrowRight,
  FaClock
} from "react-icons/fa6";
import Logo from "./Logo";
import Newsletter from "./Newsletter";
import { useConsult } from "./ConsultModal";
import { SITE, whatsAppLink, telLink } from "../config/site";
import { useSiteData } from "../lib/SiteDataContext";
import { services as staticServices } from "../data/services";

const quick = [
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Pricing", to: "/pricing" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" }
];

const industriesList = [
  { label: "Education", to: "/industries/education" },
  { label: "E-commerce", to: "/industries/ecommerce" },
  { label: "Restaurants", to: "/industries/restaurants" },
  { label: "Real Estate", to: "/industries/real-estate" },
  { label: "Small Business", to: "/industries/small-business" },
];

const socials = [
  { icon: FaLinkedin, href: SITE.social.linkedin, label: "LinkedIn" },
  { icon: FaXTwitter, href: SITE.social.twitter, label: "X (Twitter)" },
  { icon: FaInstagram, href: SITE.social.instagram, label: "Instagram" },
  { icon: FaFacebookF, href: SITE.social.facebook, label: "Facebook" },
  { icon: FaDribbble, href: SITE.social.dribbble, label: "Dribbble" }
].filter((s) => s.href);

const heading =
  "relative inline-block font-display text-xs font-bold uppercase tracking-[0.16em] text-white after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-6 after:rounded-full after:bg-primary-gradient";
const linkCls = "group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white";

// Smooth hill silhouette for the decorative footer band (low-left,
// peak-center, low-right) marking the transition into the dark footer.
const HILL_PATH =
  "M0,150 C60,170 110,196 190,190 C270,184 330,150 385,92 " +
  "C415,60 425,26 465,16 C520,2 565,10 605,22 C652,36 680,58 702,78 " +
  "C742,60 765,50 805,66 C852,85 882,110 922,122 C982,137 1042,152 1100,166 " +
  "C1152,179 1182,186 1232,176 C1292,164 1332,140 1382,110 " +
  "C1412,92 1426,85 1440,88 L1440,220 L0,220 Z";

function FooterLink({ to, children }) {
  return (
    <Link to={to} className={linkCls}>
      <span className="h-1 w-1 shrink-0 rounded-full bg-primary/50 transition-all duration-300 group-hover:w-3 group-hover:bg-primary-300" />
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">{children}</span>
    </Link>
  );
}

export default function Footer() {
  const { data } = useSiteData();
  const { openConsult } = useConsult();
  const list = (data?.services?.length ? data.services : staticServices).map((s) => ({ label: s.name, slug: s.slug }));

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative skyline-hill band — sits on the page background so the
          hill's valleys show through, with the hill itself in solid purple. */}
      <div className="relative h-32 w-full overflow-visible sm:h-40" aria-hidden="true">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-full w-full">
          <path d={HILL_PATH} fill="#3B0B6E" />
        </svg>
      </div>

      <div className="relative -mt-px bg-[#3B0B6E]">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/20 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-secondary/20 blur-[110px]" aria-hidden="true" />

        <div className="container-x relative pt-10">
        {/* Enquiry strip — a bright card floating on the dark footer */}
        <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-white p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:p-8 md:flex-row md:items-center">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="relative">
            <p className="font-display text-xl font-bold text-ink sm:text-2xl">Have a project in mind?</p>
            <p className="mt-1 text-sm text-muted sm:text-[1rem]">Share your idea — we'll suggest a practical way to build it.</p>
          </div>
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button type="button" onClick={openConsult} className="btn-primary group">
              Start a Project <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <FaWhatsapp className="h-4 w-4 text-[#1FAF54]" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-3">
            <Logo dark />
            <p className="mt-4 font-display text-base font-semibold text-white">{SITE.tagline}.</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
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
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-primary-gradient hover:text-white hover:shadow-[0_10px_24px_-10px_rgba(114,0,245,0.6)]"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Services" className="lg:col-span-2">
            <h2 className={heading}>Services</h2>
            <ul className="mt-7 space-y-2.5">
              {list.map((s) => (
                <li key={s.slug}><FooterLink to={`/services/${s.slug}`}>{s.label}</FooterLink></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className={heading}>Company</h2>
            <ul className="mt-7 space-y-2.5">
              {quick.map((l) => (
                <li key={l.to}><FooterLink to={l.to}>{l.label}</FooterLink></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Industries" className="lg:col-span-2">
            <h2 className={heading}>Industries</h2>
            <ul className="mt-7 space-y-2.5">
              {industriesList.map((l) => (
                <li key={l.to}><FooterLink to={l.to}>{l.label}</FooterLink></li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-3">
            <h2 className={heading}>Get in Touch</h2>
            <ul className="mt-7 space-y-4 text-sm text-white/55">
              <li className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-primary-300"><FaLocationDot className="h-3.5 w-3.5" /></span>
                <span className="pt-1.5">{SITE.address.full}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-primary-300"><FaPhone className="h-3.5 w-3.5" /></span>
                <a href={telLink()} className="transition-colors hover:text-white">{SITE.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-primary-300"><FaEnvelope className="h-3.5 w-3.5" /></span>
                <a href={`mailto:${SITE.email}`} className="break-all transition-colors hover:text-white">{SITE.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-primary-300"><FaClock className="h-3.5 w-3.5" /></span>
                <span className="pt-1.5">{SITE.hours}</span>
              </li>
            </ul>
            <h2 className={`${heading} mt-9`}>Newsletter</h2>
            <div className="mt-7">
              <Newsletter />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center text-xs text-white/45 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-white">Terms &amp; Conditions</Link>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
