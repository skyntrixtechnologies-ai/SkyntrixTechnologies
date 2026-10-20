import { FaArrowRight, FaWhatsapp, FaPhone } from "react-icons/fa6";
import { useConsult } from "./ConsultModal";
import { SITE, whatsAppLink, telLink } from "../config/site";
import Reveal from "./Reveal";

export default function CtaSection({
  title = "Ready to Build Something Great?",
  subtitle = "Tell us about your idea. Let's explore the right digital solution for your business."
}) {
  const { openConsult } = useConsult();
  return (
    <section className="section-pad">
      <Reveal className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-lavender px-6 py-14 text-center sm:px-10 md:py-20">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-secondary/20 blur-[100px]" />
            <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="heading-lg text-balance text-ink">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={openConsult} className="btn-primary group !px-7 !py-3.5">
                Get a Free Consultation
                <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href={whatsAppLink("Hi Skyntrix Technologies! I'd like to discuss a project idea.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-white px-7 py-3.5 font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366] hover:shadow-card"
              >
                <FaWhatsapp className="h-5 w-5 text-[#1FAF54]" /> WhatsApp Us
              </a>
            </div>
            <p className="mt-6 text-sm text-muted">
              Prefer a call?{" "}
              <a href={telLink()} className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:text-primary hover:underline">
                <FaPhone className="h-3 w-3" aria-hidden="true" /> {SITE.phone}
              </a>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
