import { Helmet } from "react-helmet-async";
import { SITE } from "../config/site";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  image: `${SITE.url}/logo.png`,
  slogan: SITE.tagline,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.9252,
    longitude: 78.1198
  },
  sameAs: Object.values(SITE.social),
  foundingDate: "2026",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 4
  },
  areaServed: [
    { "@type": "City", name: "Madurai" },
    { "@type": "State", name: "Tamil Nadu" },
    { "@type": "Country", name: "India" }
  ],
  serviceType: [
    "Website Development",
    "Mobile App Development",
    "UI/UX Design",
    "SEO Services",
    "Digital Marketing",
    "E-commerce Development",
    "Branding",
    "Poster Designing",
    "Website Maintenance"
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "19:00"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: SITE.phone,
    contactType: "customer service",
    availableLanguage: ["English", "Hindi", "Tamil"]
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`
  }
};

export function getOrganizationSchema() {
  return organizationSchema;
}

export function getWebsiteSchema() {
  return websiteSchema;
}

export function getBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE.url}${item.url}` : undefined
    }))
  };
}

export function getServiceSchema(service, path) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.short || service.overview,
    url: `${SITE.url}${path}`,
    provider: {
      "@type": ["Organization", "LocalBusiness"],
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.region,
        addressCountry: SITE.address.country
      }
    },
    areaServed: [
      { "@type": "City", name: "Madurai" },
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "Country", name: "India" }
    ],
    serviceType: service.name,
    offers: service.priceFrom ? {
      "@type": "Offer",
      priceCurrency: "INR",
      price: service.priceFrom.replace(/[^\d]/g, ""),
      priceValidUntil: "2027-12-31"
    } : undefined
  };
}

export function getArticleSchema(post, path) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE.url}${path}`,
    author: {
      "@type": "Person",
      name: post.author
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}${path}`
    }
  };
}

export function getFAQSchema(items) {
  if (!items || items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };
}

export default function Seo({
  title,
  description,
  path = "/",
  image,
  type = "website",
  article,
  noindex = false,
  jsonLd,
  breadcrumbs,
  keywords,
  faqs,
}) {
  const canonical = `${SITE.url}${path}`;
  const fullDesc = description || SITE.description;
  const ogImage = image || SITE.ogImage;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${SITE.url}${ogImage}`;
  const titleTemplate = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`;
  const ogTitle = title || SITE.name;
  const pageKeywords = keywords || [...SITE.keywords.primary.slice(0, 5), ...SITE.keywords.secondary.slice(0, 3)];

  const schemas = [
    organizationSchema,
    websiteSchema,
    ...(breadcrumbs ? [getBreadcrumbSchema(breadcrumbs)] : []),
    ...(faqs ? [getFAQSchema(faqs)] : []),
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [])
  ].filter(Boolean);

  return (
    <Helmet>
      <title>{titleTemplate}</title>
      <meta name="description" content={fullDesc} />
      <meta name="keywords" content={pageKeywords.join(", ")} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content={image ? ogTitle : `${SITE.name} logo`} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:site" content="@skyntrix" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image" content={ogImageUrl} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
}
