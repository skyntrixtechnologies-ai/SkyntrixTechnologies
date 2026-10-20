import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import CtaSection from "../components/CtaSection";
import { SITE } from "../config/site";

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, including:\n\n- Name, email address, phone number and company details when you fill out contact forms, request a quote or subscribe to our newsletter.\n- Project details, requirements and feedback when you engage our services.\n- Payment information when you purchase our services.\n- Communication records when you contact us via email, phone or WhatsApp.\n\nWe also automatically collect certain information when you visit our website:\n\n- IP address, browser type, operating system\n- Pages visited, time spent on pages, navigation paths\n- Referring website or source\n- Device information and screen resolution`
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to:\n\n- Respond to your inquiries and provide customer support\n- Send project proposals, quotes and invoices\n- Deliver and manage our services\n- Communicate about projects, updates and support\n- Send newsletters and marketing communications (with your consent)\n- Improve our website and services\n- Comply with legal obligations`
  },
  {
    title: "Information Sharing",
    content: `We do not sell your personal information to third parties. We may share your information with:\n\n- Service providers who assist in delivering our services (hosting, payment processing, analytics)\n- When required by law or to protect our rights\n- With your explicit consent\n\nAll third-party service providers are contractually obligated to protect your information and use it only for the purposes we specify.`
  },
  {
    title: "Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal information, including:\n\n- SSL/TLS encryption for data in transit\n- Secure hosting infrastructure\n- Regular security assessments\n- Access controls and authentication\n- Regular backups and disaster recovery procedures\n\nHowever, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.`
  },
  {
    title: "Cookies and Tracking",
    content: `Our website uses cookies and similar technologies:\n\n- Essential cookies for website functionality\n- Analytics cookies (Google Analytics) to understand how visitors use our site\n- Marketing cookies for retargeting and advertising\n\nYou can control cookies through your browser settings. Disabling certain cookies may affect website functionality.`
  },
  {
    title: "Your Rights",
    content: `You have the right to:\n\n- Access the personal information we hold about you\n- Request correction of inaccurate information\n- Request deletion of your personal information\n- Opt out of marketing communications\n- Withdraw consent where processing is based on consent\n\nTo exercise any of these rights, contact us at ${SITE.email}.`
  },
  {
    title: "Data Retention",
    content: `We retain your personal information for as long as necessary to:\n\n- Provide our services to you\n- Comply with legal obligations\n- Resolve disputes and enforce agreements\n- Maintain business records as required by law\n\nWhen your information is no longer needed, we securely delete or anonymize it.`
  },
  {
    title: "Third-Party Links",
    content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.`
  },
  {
    title: "Children's Privacy",
    content: `Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete it promptly.`
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. The updated policy will be posted on this page with a revised "Last Updated" date. We encourage you to review this policy periodically.`
  },
  {
    title: "Contact Us",
    content: `If you have questions about this Privacy Policy or how we handle your data, contact us:\n\n- Email: ${SITE.email}\n- Phone: ${SITE.phone}\n- Address: ${SITE.address.full}\n\nWe will respond to your inquiry within 30 days.`
  }
];

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        path="/privacy"
        description={`Privacy Policy for Skyntrix Technologies. Learn how we collect, use and protect your personal information.`}
        noindex
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy" }
        ]}
      />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-primary"><FaChevronLeft className="h-3 w-3" /> Back to Home</Link>
            <h1 className="heading-xl text-ink">Privacy Policy</h1>
            <p className="mt-3 text-sm text-ink/50">Last Updated: August 2026</p>
          </Reveal>

          <Reveal className="mx-auto mt-10 max-w-3xl">
            <p className="mb-8 leading-relaxed text-ink/70">
              Skyntrix Technologies ("we," "our" or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose and safeguard your information
              when you visit our website at {SITE.url} and use our services.
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
