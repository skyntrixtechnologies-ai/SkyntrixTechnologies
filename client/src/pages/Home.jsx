import Seo from "../components/Seo";
import Hero from "../sections/Hero";
import TechTrustStrip from "../sections/TechTrustStrip";
import ServicesOverview from "../sections/ServicesOverview";
import FeaturedProjects from "../sections/FeaturedProjects";
import WhyChooseUs from "../sections/WhyChooseUs";
import ProcessTimeline from "../sections/ProcessTimeline";
import TechStack from "../sections/TechStack";
import Testimonials from "../sections/Testimonials";
import Industries from "../sections/Industries";
import BlogPreview from "../sections/BlogPreview";
import HomeFAQ from "../sections/HomeFAQ";
import CtaSection from "../components/CtaSection";
import { faqsGeneral } from "../data/content";

export default function Home() {
  return (
    <>
      <Seo
        title="Website, App & Software Development Company in Madurai"
        path="/"
        description="Skyntrix Technologies designs and develops modern websites, mobile apps and custom business software for companies in Madurai and across India. Start your project with a free consultation."
        faqs={faqsGeneral}
        keywords={[
          "Website Development Company in Madurai",
          "Web Development Company in Madurai",
          "Software Development Company in Madurai",
          "Mobile App Development",
          "Custom Software Development",
          "E-commerce Website Development",
          "Web Design Company in Madurai",
          "IT Company in Madurai",
          "Digital Solutions Company"
        ]}
      />
      <Hero />
      <TechTrustStrip />
      <ServicesOverview />
      <FeaturedProjects />
      <WhyChooseUs />
      <ProcessTimeline />
      <TechStack />
      <Testimonials />
      <Industries />
      <BlogPreview />
      <HomeFAQ />
      <CtaSection />
    </>
  );
}
