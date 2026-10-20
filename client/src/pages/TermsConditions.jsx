import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import CtaSection from "../components/CtaSection";
import { SITE } from "../config/site";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing and using the Skyntrix Technologies website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.`
  },
  {
    title: "Services",
    content: `Skyntrix Technologies provides website development, mobile application development, UI/UX design, search engine optimization, digital marketing, branding and related digital services.\n\nService details, pricing and scope are provided in individual project proposals and statements of work. Specific terms for each project are outlined in the respective project agreements.`
  },
  {
    title: "Project Engagement",
    content: `All projects begin with a discovery phase and proposal. Once a proposal is accepted and payment is received, a project agreement is executed outlining:\n\n- Project scope and deliverables\n- Timeline and milestones\n- Payment schedule\n- Revision policy\n- Intellectual property terms\n\nAny changes to project scope are handled through formal change requests.`
  },
  {
    title: "Payment Terms",
    content: `Unless otherwise specified in the project agreement:\n\n- 50% advance payment is required to begin work\n- 50% balance is due upon project completion\n- Invoices are due within 15 days of issuance\n- Late payments may incur a 2% monthly late fee\n- Work may be paused if payments are overdue by more than 30 days`
  },
  {
    title: "Intellectual Property",
    content: `Upon full payment, Skyntrix Technologies grants the client full ownership of all final deliverables created specifically for the project.\n\nSkyntrix Technologies retains the right to:\n\n- Display the project in our portfolio and marketing materials\n- Use general techniques, code patterns and knowledge gained\n- Retain pre-existing tools and frameworks used in development\n\nClient-provided materials (logos, images, content) remain the property of the client.`
  },
  {
    title: "Content and Materials",
    content: `Clients are responsible for providing all content (text, images, videos, logos) required for the project unless content creation is explicitly included in the scope.\n\nClients warrant that all provided materials do not infringe on third-party copyrights or trademarks. Skyntrix Technologies is not liable for any content-related legal issues arising from client-provided materials.`
  },
  {
    title: "Timeline and Delays",
    content: `Project timelines are estimates based on the scope and cooperation from both parties. Delays caused by:\n\n- Late client feedback or approvals\n- Missing content or materials\n- Scope changes\n- Force majeure events\n\nmay extend the project timeline. Skyntrix Technologies will communicate any delays promptly and work to minimize impact.`
  },
  {
    title: "Revisions",
    content: `Standard project proposals include a defined number of revision rounds. Additional revisions beyond the agreed scope are billed at our standard hourly rate.\n\nRevision rounds are defined as a single set of feedback submitted together. Splitting feedback across multiple rounds counts as multiple revision rounds.`
  },
  {
    title: "Warranty and Support",
    content: `Skyntrix Technologies provides a 30-day warranty period following project delivery to address any bugs or issues directly related to our development work.\n\nAfter the warranty period, ongoing maintenance and support are available through our maintenance plans. Bug fixes and issues not related to our original development scope are not covered under the warranty.`
  },
  {
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, Skyntrix Technologies shall not be liable for any indirect, incidental, special, consequential or punitive damages arising from:\n\n- Use of our website or services\n- Loss of data or business\n- Third-party actions\n- Service interruptions\n\nOur total liability shall not exceed the amount paid for the specific service giving rise to the claim.`
  },
  {
    title: "Confidentiality",
    content: `Both parties agree to keep confidential any proprietary information shared during the course of a project. This includes business strategies, technical details, source code and client data.\n\nConfidentiality obligations survive the termination of the project engagement.`
  },
  {
    title: "Termination",
    content: `Either party may terminate a project agreement with written notice if:\n\n- The other party materially breaches the agreement and fails to cure within 14 days\n- The other party becomes insolvent or bankrupt\n\nUpon termination, the client is responsible for payment of all work completed up to the termination date.`
  },
  {
    title: "Website Use",
    content: `By using our website, you agree not to:\n\n- Attempt to gain unauthorized access to our systems\n- Use our website for any unlawful purpose\n- Interfere with website functionality\n- Collect data from our website without authorization\n- Use our content or materials without permission`
  },
  {
    title: "Disclaimer",
    content: `Our website and portfolio showcase are provided for informational purposes. While we strive for accuracy, we make no warranties about the completeness or reliability of website content.\n\nResults mentioned in case studies and testimonials represent specific client outcomes and are not guaranteed for all projects.`
  },
  {
    title: "Governing Law",
    content: `These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Madurai, Tamil Nadu, India.`
  },
  {
    title: "Changes to Terms",
    content: `We reserve the right to update these Terms and Conditions at any time. Changes take effect upon posting on this page. Continued use of our website and services after changes constitutes acceptance of the updated terms.`
  },
  {
    title: "Contact",
    content: `For questions about these Terms and Conditions:\n\n- Email: ${SITE.email}\n- Phone: ${SITE.phone}\n- Address: ${SITE.address.full}`
  }
];

export default function TermsConditions() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        path="/terms"
        description={`Terms and Conditions for Skyntrix Technologies services, website usage and project engagements.`}
        noindex
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Terms & Conditions" }
        ]}
      />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-primary"><FaChevronLeft className="h-3 w-3" /> Back to Home</Link>
            <h1 className="heading-xl text-ink">Terms & Conditions</h1>
            <p className="mt-3 text-sm text-ink/50">Last Updated: August 2026</p>
          </Reveal>

          <Reveal className="mx-auto mt-10 max-w-3xl">
            <p className="mb-8 leading-relaxed text-ink/70">
              These Terms and Conditions govern your use of the Skyntrix Technologies website and services.
              Please read them carefully before engaging our services or using our website.
            </p>

            {sections.map((section, i) => (
              <div key={i} className="mb-10">
                <h2 className="heading-md text-ink">{section.title}</h2>
                <div className="mt-4 space-y-3 text-ink/70 leading-relaxed">
                  {section.content.split("\n\n").map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
