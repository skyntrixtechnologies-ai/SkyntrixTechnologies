// Page-level requirement metadata + helpers.
// Mirrors server/models/Requirement.model.js.

export const PAGE_TYPES = [
  "Home Page",
  "About Page",
  "Product / Service Page",
  "Product Listing / Category Page",
  "Blog / News Page",
  "Blog / Article Detail Page",
  "Contact Page",
  "Portfolio / Gallery Page",
  "Team Page",
  "FAQ Page",
  "Pricing Page",
  "Login / Register Page",
  "User Dashboard / Account Page",
  "Cart / Checkout Page",
  "Testimonial / Reviews Page",
  "Custom",
];

export const PAGE_PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const PAGE_STATUSES = [
  { value: "required", label: "Required" },
  { value: "optional", label: "Optional" },
];

export const PAGE_PRIORITY_BADGE = {
  low: "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-sky-100 text-sky-700 border-sky-200",
  high: "bg-amber-100 text-amber-700 border-amber-200",
  critical: "bg-red-100 text-red-700 border-red-200",
};

export const PAGE_STATUS_BADGE = {
  required: "bg-emerald-100 text-emerald-700 border-emerald-200",
  optional: "bg-slate-100 text-slate-500 border-slate-200",
};

export const PAGE_SECTION_TYPES = [
  "Header",
  "Hero / Banner",
  "About / Intro",
  "Services / Offerings",
  "Features / Highlights",
  "Products / Portfolio",
  "Gallery / Slider",
  "Testimonials",
  "Team",
  "Pricing",
  "FAQ",
  "Blog / News",
  "CTA / Call to Action",
  "Contact / Map / Form",
  "Footer",
  "Custom",
];

export const PAGE_FEATURES = [
  "Image Gallery",
  "Video Embedding",
  "Contact Form",
  "Live Chat / WhatsApp Button",
  "Google Maps Integration",
  "Social Media Links",
  "Search",
  "Filters / Sorting",
  "Blog / News Listing",
  "Newsletter Subscription",
  "Downloadable Files / Resources",
  "Pricing Tables",
  "FAQ Accordion",
  "Testimonials / Reviews Slider",
  "Team Members Listing",
  "Language / Translation",
  "Dark / Light Mode",
  "User Login",
  "User Registration",
  "User Profile / Account",
  "Shopping Cart",
  "Checkout / Payment Gateway",
  "Order Tracking",
  "Appointment / Booking",
  "Lead Capture / Enquiry Form",
  "Custom",
];

export const PAGE_ANIMATION_LEVELS = [
  { value: "none", label: "None" },
  { value: "basic", label: "Basic" },
  { value: "advanced", label: "Advanced" },
];

export const CONTENT_SOURCES = [
  { value: "client_provides", label: "Client Provides" },
  { value: "skyntrix_creates", label: "Skyntrix Creates" },
  { value: "not_available", label: "Not Available Yet" },
];

export const CONTENT_TYPES = [
  "Copy / Text Content",
  "Images",
  "Logos",
  "Product Photos",
  "Team Photos",
  "Videos",
  "Documents / PDFs",
  "Brochures",
  "Client Testimonials",
  "Certifications / Accreditations",
  "Brand Guidelines",
];

export const CRUD_OPTIONS = [
  { value: "create", label: "Create" },
  { value: "read", label: "Read" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
];

// Page-level feature toggles. These are stored as REAL booleans (true/false),
// never as strings. Mirrors server/models/Requirement.model.js.
export const PAGE_FEATURE_TOGGLES = [
  ["contactForm", "Contact Form"],
  ["search", "Search"],
  ["filter", "Filter"],
  ["sorting", "Sorting"],
  ["pagination", "Pagination"],
  ["authentication", "Authentication"],
  ["fileUpload", "File Upload"],
  ["imageUpload", "Image Upload"],
  ["video", "Video"],
  ["googleMaps", "Google Maps"],
  ["whatsapp", "WhatsApp"],
  ["email", "Email"],
  ["payment", "Payment"],
  ["apiIntegration", "API Integration"],
  ["socialMedia", "Social Media"],
  ["download", "Download"],
  ["share", "Share"],
  ["reviewsRatings", "Reviews / Ratings"],
  ["notifications", "Notifications"],
];

const LEGACY_FEATURE_LABELS = {
  "Contact Form": ["contactForm"],
  "Lead Capture / Enquiry Form": ["contactForm"],
  Search: ["search"],
  "Filters / Sorting": ["filter", "sorting"],
  "User Login": ["authentication"],
  "User Registration": ["authentication"],
  "Checkout / Payment Gateway": ["payment"],
  "Live Chat / WhatsApp Button": ["whatsapp"],
  "Google Maps Integration": ["googleMaps"],
  "Social Media Links": ["socialMedia"],
  "Video Embedding": ["video"],
  "Image Gallery": ["imageUpload"],
  "Downloadable Files / Resources": ["download"],
  "Newsletter Subscription": ["notifications"],
  "Testimonials / Reviews Slider": ["reviewsRatings"],
};

// Always returns a clean boolean feature map. Accepts the current map shape, a
// legacy string array, or a raw object. false stays false.
export const normalizeFeatures = (value) => {
  const out = {};
  PAGE_FEATURE_TOGGLES.forEach(([key]) => {
    out[key] = false;
  });
  if (value == null) return out;
  if (Array.isArray(value)) {
    value.forEach((label) => {
      const keys = LEGACY_FEATURE_LABELS[label];
      if (keys) keys.forEach((k) => { out[k] = true; });
    });
    return out;
  }
  if (typeof value === "object") {
    PAGE_FEATURE_TOGGLES.forEach(([key]) => {
      const v = value[key];
      out[key] = v === true || v === "true" || v === 1 || v === "1";
    });
  }
  return out;
};

// Labels of the features that are currently ON.
export const enabledFeatureLabels = (features) =>
  PAGE_FEATURE_TOGGLES.filter(([key]) => normalizeFeatures(features)[key]).map(([, label]) => label);

export const sectionTypeLabel = (type) => (type || "Custom").replace(/\//g, " / ");

export const slugify = (name = "") =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s\-_]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const emptySection = (order = 0) => ({
  sectionType: "Custom",
  name: "",
  description: "",
  contentRequirements: "",
  imagesRequired: false,
  videosRequired: false,
  ctaRequired: false,
  notes: "",
  order,
});

export const emptyPage = () => ({
  pageName: "",
  slug: "",
  pageType: "",
  priority: "medium",
  status: "required",
  purpose: "",
  sections: [],
  features: Object.fromEntries(PAGE_FEATURE_TOGGLES.map(([key]) => [key, false])),
  otherFeatures: "",
  dynamicData: {
    enabled: false,
    dataSource: "",
    apiRequired: false,
    apiDescription: "",
    databaseTable: "",
    crudOperations: [],
    adminManagement: false,
  },
  design: {
    preference: "",
    layout: "",
    referenceWebsite: "",
    referenceUrl: "",
    colorPreference: "",
    typography: "",
    animation: "none",
    notes: "",
  },
  content: {
    source: "not_available",
    types: [],
    imagesRequired: false,
    videosRequired: false,
    notes: "",
  },
  seo: {
    enabled: false,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    notes: "",
  },
  responsive: {
    desktop: true,
    tablet: true,
    mobile: true,
    notes: "",
  },
  order: 0,
});

// Normalizes any page (new or legacy) into the full expected shape so booleans
// always exist and saved values are preserved. Never resets existing data.
export const normalizePage = (page = {}) => {
  const base = emptyPage();
  return {
    ...base,
    ...page,
    features: normalizeFeatures(page.features),
    sections: Array.isArray(page.sections) ? page.sections.map((s, i) => ({ ...emptySection(i), ...s, order: i })) : [],
    dynamicData: { ...base.dynamicData, ...(page.dynamicData || {}) },
    design: { ...base.design, ...(page.design || {}) },
    content: { ...base.content, ...(page.content || {}) },
    seo: { ...base.seo, ...(page.seo || {}) },
    responsive: { ...base.responsive, ...(page.responsive || {}) },
    order: typeof page.order === "number" ? page.order : 0,
  };
};

export const pagesSummary = (pages = []) => {
  const list = Array.isArray(pages) ? pages : [];
  return list.reduce(
    (acc, page) => ({
      totalPages: acc.totalPages + 1,
      totalSections: acc.totalSections + (Array.isArray(page.sections) ? page.sections.length : 0),
      totalFeatures: acc.totalFeatures + enabledFeatureLabels(page.features).length,
    }),
    { totalPages: 0, totalSections: 0, totalFeatures: 0 }
  );
};

// One-line scope summary for a page, used in the quotation builder prefill.
export const pageServiceDescription = (page = {}) => {
  const bits = [];
  if (page.pageType) bits.push(page.pageType);
  if (page.purpose) bits.push(page.purpose);
  if (page.features !== undefined && page.features !== null) {
    const labels = enabledFeatureLabels(page.features);
    if (labels.length) bits.push(`Features: ${labels.join(", ")}`);
  }
  if (page.dynamicData?.enabled) {
    const crud = Array.isArray(page.dynamicData.crudOperations) && page.dynamicData.crudOperations.length ? ` [${page.dynamicData.crudOperations.join("/")}]` : "";
    bits.push(`Dynamic data: ${page.dynamicData.dataSource || "yes"}${crud}`);
  }
  if (page.dynamicData?.apiRequired && page.dynamicData.apiDescription) bits.push(`API: ${page.dynamicData.apiDescription}`);
  return bits.join(" | ");
};
