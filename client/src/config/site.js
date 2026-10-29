export const SITE = {
  name: "Skyntrix Technologies",
  shortName: "Skyntrix",
  tagline: "Turning Ideas into Digital Solutions",
  description: "Skyntrix Technologies provides professional website development, web applications, mobile apps, e-commerce, SEO, branding and digital marketing solutions for businesses in Madurai and across India.",
  url: import.meta.env.VITE_SITE_URL || "https://skyntrixtechnologies.in",
  email: "skyntrixtechnologies@gmail.com",
  careersEmail: "careers@skyntrix.com",
  phone: "+91 8925393946",
  phon2: "+91 9790586747",
  whatsapp: "+91 9790586747",
  address: {
    street: "Madurai",
    city: "Madurai",
    region: "Tamil Nadu",
    country: "IN",
    full: "Madurai, Tamil Nadu, India"
  },
  hours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
  social: {
    linkedin: "https://linkedin.com/company/skyntrix",
    twitter: "https://twitter.com/skyntrix",
    instagram: "https://www.instagram.com/skyntrixtechnologies",
    facebook: "https://facebook.com/skyntrix",
    github: "https://github.com/skyntrix",
    dribbble: "https://dribbble.com/skyntrix"
  },
  // Square brand mark served from /public. Replace with a 1200x630 /og-default.png when one is designed.
  ogImage: "/logo.png",
  keywords: {
    primary: [
      "Website Development Company in Madurai",
      "Web Development Company in Madurai",
      "Software Development Company in Madurai",
      "Web Design Company in Madurai",
      "E-commerce Website Development",
      "Mobile App Development",
      "SEO Services in Madurai",
      "Digital Marketing Services in Madurai",
      "UI UX Design Services",
      "React Development Company",
      "Next.js Development Company"
    ],
    secondary: [
      "Website Development Company in Tamil Nadu",
      "Software Company in Madurai",
      "IT Company in Madurai",
      "Custom Web Application Development",
      "Business Website Development",
      "E-commerce Development Company",
      "Web Application Development",
      "Digital Solutions Company"
    ]
  }
};

// wa.me only accepts the number as digits (no "+", spaces or dashes).
export const whatsAppLink = (msg = "Hi Skyntrix Technologies! I'd like to discuss a project.") =>
  `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;

export const telLink = (phone = SITE.phone) => `tel:+${phone.replace(/\D/g, "")}`;

export const API_URL = (import.meta.env.VITE_API_URL || "https://skyntrix.onrender.com/api").replace(/\/$/, "");
