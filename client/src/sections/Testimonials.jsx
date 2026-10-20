import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import TestimonialCard from "../components/TestimonialCard";
import { useSiteData } from "../lib/SiteDataContext";

// Only testimonials an admin has marked "featured" in the CMS (i.e. verified and
// approved for publication) appear on the homepage. With none, the section is omitted.
export default function Testimonials() {
  const { data } = useSiteData();
  const testimonials = (data?.testimonials || []).filter((t) => t.featured && t.quote && t.author).slice(0, 3);

  if (!testimonials.length) return null;

  const cols = testimonials.length === 1 ? "max-w-2xl mx-auto" : testimonials.length === 2 ? "md:grid-cols-2 max-w-5xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <SectionHeading label="Client Feedback" title="What Our Clients Say" />
        <div className={`grid gap-6 ${cols}`}>
          {testimonials.map((t, i) => (
            <Reveal key={`${t.author}-${i}`} delay={i * 0.06} className="h-full">
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
