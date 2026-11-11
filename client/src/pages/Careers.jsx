import { FaBriefcase } from "react-icons/fa6";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import CtaSection from "../components/CtaSection";

export default function Careers() {
  return (
    <>
      <Seo
        title="Careers"
        path="/careers"
        description="Join the Skyntrix Technologies team — we're looking for talented designers, developers and strategists in Madurai and across India."
        noindex
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Careers" }
        ]}
      />
      <PageHero title="Join Our Team" subtitle="We build products people love. If you're driven, curious and collaborative, we want to hear from you." crumb="Careers" />

      <section className="section-pad bg-base">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FaBriefcase className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold text-ink">Openings will be announced soon</h2>
            <p className="mt-3 text-ink/60">
              We're not hiring for a specific role right now, but we're always open to hearing from talented people.
              Email us at <a href="mailto:careers@skyntrix.com" className="font-semibold text-primary">careers@skyntrix.com</a> and we'll reach out when a role fits.
            </p>
          </Reveal>
        </div>
      </section>
      <CtaSection title="Let's build something great together" subtitle="Partner with us on your next project — book a free consultation today." />
    </>
  );
}
