import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaXmark, FaPhone, FaArrowRight } from "react-icons/fa6";
import Logo from "./Logo";
import { useConsult } from "./ConsultModal";
import { SITE, telLink } from "../config/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { openConsult } = useConsult();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const startProject = () => {
    setOpen(false);
    openConsult();
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "border-line/80 bg-white/90 shadow-[0_8px_30px_-18px_rgba(23,18,31,0.25)] backdrop-blur-xl"
          : "border-transparent bg-white/60 backdrop-blur-md"
      }`}
    >
      <nav className="container-x flex h-20 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <div className="hidden items-center gap-0.5 rounded-full border border-line/70 bg-white/70 p-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 xl:px-4 ${
                  isActive ? "bg-lavender text-primary" : "text-muted hover:bg-lavender/60 hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={telLink()}
            aria-label={`Call ${SITE.phone}`}
            className="hidden h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-primary/30 hover:text-primary xl:grid"
          >
            <FaPhone className="h-3.5 w-3.5" />
          </a>
          <button type="button" onClick={startProject} className="btn-primary group hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            Start a Project
            <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-ink lg:hidden"
          >
            {open ? <FaXmark className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-x flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      isActive ? "bg-lavender text-primary" : "text-ink/80 hover:bg-lavender hover:text-primary"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={startProject} className="btn-primary w-full">
                  Start a Project <FaArrowRight className="h-3.5 w-3.5" />
                </button>
                <a href={telLink()} className="btn-secondary w-full">
                  <FaPhone className="h-3.5 w-3.5" /> {SITE.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
