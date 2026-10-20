import mongoose from "mongoose";

// Statuses a requirement moves through before it is ready for quotation.
export const REQUIREMENT_STATUS = ["draft", "collected", "under_review", "ready_for_quotation"];

export const REQUIREMENT_PRIORITY = ["low", "medium", "high", "urgent"];

export const REQUIREMENT_PROJECT_TYPES = [
  "Website Development",
  "E-commerce Website",
  "Mobile App",
  "Web Application",
  "CRM",
  "Admin Panel",
  "UI/UX Design",
  "Digital Marketing",
  "SEO",
  "Other",
];

// ============================================================
// Page-level requirement metadata
// ============================================================

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

export const PAGE_PRIORITY = ["low", "medium", "high", "critical"];

export const PAGE_STATUS = ["required", "optional"];

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

export const PAGE_ANIMATION_LEVELS = ["none", "basic", "advanced"];

export const CONTENT_SOURCES = ["client_provides", "skyntrix_creates", "not_available"];

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

export const CRUD_OPTIONS = ["create", "read", "update", "delete"];

// ============================================================
// Social media links (structured)
// ============================================================

export const SOCIAL_MEDIA_LABELS = [
  "Instagram",
  "Facebook",
  "YouTube",
  "LinkedIn",
  "Twitter / X",
  "WhatsApp",
  "TikTok",
  "Pinterest",
  "Telegram",
  "Other",
];

const SOCIAL_HOST_LABELS = [
  ["instagram.com", "Instagram"],
  ["facebook.com", "Facebook"],
  ["fb.me", "Facebook"],
  ["fb.com", "Facebook"],
  ["youtube.com", "YouTube"],
  ["youtu.be", "YouTube"],
  ["linkedin.com", "LinkedIn"],
  ["x.com", "Twitter / X"],
  ["twitter.com", "Twitter / X"],
  ["wa.me", "WhatsApp"],
  ["whatsapp.com", "WhatsApp"],
  ["tiktok.com", "TikTok"],
  ["pinterest.com", "Pinterest"],
  ["pinterest.ca", "Pinterest"],
  ["t.me", "Telegram"],
  ["telegram.org", "Telegram"],
];

export const inferSocialLabel = (url = "") => {
  const u = String(url).toLowerCase();
  const hit = SOCIAL_HOST_LABELS.find(([host]) => u.includes(host));
  return hit ? hit[1] : "Other";
};

/**
 * Accepts the current structured format ({ label, url }[]), the legacy
 * string / string-array format, or a mixed shape, and always returns a clean
 * [{ label, url }] list with empty entries removed. Used by the path setter
 * and by the controller so legacy records are never corrupted.
 */
export const normalizeSocialLinks = (value) => {
  if (value == null) return [];
  const items = Array.isArray(value) ? value : String(value).split(/[,\n]/);
  const out = [];
  for (const item of items) {
    if (item == null) continue;
    if (typeof item === "string") {
      const url = item.trim();
      if (url) out.push({ label: inferSocialLabel(url), url });
    } else if (typeof item === "object") {
      const url = String(item.url ?? item.link ?? item.value ?? "").trim();
      const label = String(item.label ?? "").trim();
      if (url) out.push({ label: label || inferSocialLabel(url), url });
    }
  }
  return out;
};

// ============================================================
// Page feature toggles - stored as real booleans (NOT strings).
// ============================================================

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

// Maps the legacy string-array feature labels onto the boolean feature keys
// so old records migrate cleanly instead of silently dropping data.
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

/**
 * Always returns a clean boolean feature map. Accepts the current boolean map
 * shape, a legacy string array, or a raw object. false stays false - a false
 * value is never converted into undefined or dropped.
 */
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

const socialMediaSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "", maxlength: 100 },
    url: { type: String, trim: true, default: "", maxlength: 500 },
  },
  { _id: false }
);

const featuresSchema = new mongoose.Schema(
  Object.fromEntries(PAGE_FEATURE_TOGGLES.map(([key]) => [key, { type: Boolean, default: false }])),
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    sectionType: { type: String, enum: PAGE_SECTION_TYPES, default: "Custom" },
    name: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    contentRequirements: { type: String, trim: true, default: "" },
    imagesRequired: { type: Boolean, default: false },
    videosRequired: { type: Boolean, default: false },
    ctaRequired: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const pageSchema = new mongoose.Schema(
  {
    pageName: { type: String, trim: true, maxlength: 200 },
    slug: { type: String, trim: true, lowercase: true, maxlength: 200 },
    pageType: { type: String, enum: PAGE_TYPES, default: "" },
    priority: { type: String, enum: PAGE_PRIORITY, default: "medium" },
    status: { type: String, enum: PAGE_STATUS, default: "required" },
    purpose: { type: String, trim: true, default: "" },
    sections: { type: [sectionSchema], default: [] },
    features: { type: featuresSchema, default: () => ({}) },
    otherFeatures: { type: String, trim: true, default: "" },
    dynamicData: {
      enabled: { type: Boolean, default: false },
      dataSource: { type: String, trim: true, default: "" },
      apiRequired: { type: Boolean, default: false },
      apiDescription: { type: String, trim: true, default: "" },
      databaseTable: { type: String, trim: true, default: "" },
      crudOperations: { type: [String], enum: CRUD_OPTIONS, default: [] },
      adminManagement: { type: Boolean, default: false },
    },
    design: {
      preference: { type: String, trim: true, default: "" },
      layout: { type: String, trim: true, default: "" },
      referenceWebsite: { type: String, trim: true, default: "" },
      referenceUrl: { type: String, trim: true, default: "" },
      colorPreference: { type: String, trim: true, default: "" },
      typography: { type: String, trim: true, default: "" },
      animation: { type: String, enum: PAGE_ANIMATION_LEVELS, default: "none" },
      notes: { type: String, trim: true, default: "" },
    },
    content: {
      source: { type: String, enum: CONTENT_SOURCES, default: "not_available" },
      types: { type: [String], enum: CONTENT_TYPES, default: [] },
      imagesRequired: { type: Boolean, default: false },
      videosRequired: { type: Boolean, default: false },
      notes: { type: String, trim: true, default: "" },
    },
    seo: {
      enabled: { type: Boolean, default: false },
      metaTitle: { type: String, trim: true, maxlength: 200 },
      metaDescription: { type: String, trim: true, default: "" },
      keywords: { type: String, trim: true, default: "" },
      notes: { type: String, trim: true, default: "" },
    },
    responsive: {
      desktop: { type: Boolean, default: true },
      tablet: { type: Boolean, default: true },
      mobile: { type: Boolean, default: true },
      notes: { type: String, trim: true, default: "" },
    },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

// Migrate legacy string-array feature lists into the boolean map whenever a
// page is hydrated from the database or assigned (edit / legacy records).
pageSchema.path("features").set(normalizeFeatures);

const requirementSchema = new mongoose.Schema(
  {
    // Ownership / relationships. A requirement always belongs to a contact
    // (LeadContact); the source inquiry lead is kept for reference.
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "LeadContact", required: true, index: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },

    // Client information (snapshot from the contact, editable).
    businessName: { type: String, trim: true, default: "" },
    clientName: { type: String, trim: true, default: "" },
    mobileNumber: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "", lowercase: true },
    location: { type: String, trim: true, default: "" },
    existingWebsite: { type: String, trim: true, default: "" },
    socialMediaLinks: { type: [socialMediaSchema], default: [], set: normalizeSocialLinks },

    // Project requirement
    projectType: { type: String, enum: REQUIREMENT_PROJECT_TYPES, default: "" },
    projectName: { type: String, trim: true, default: "" },
    businessDescription: { type: String, trim: true, default: "" },
    projectDescription: { type: String, trim: true, default: "" },
    mainObjective: { type: String, trim: true, default: "" },
    targetAudience: { type: String, trim: true, default: "" },
    requiredFeatures: { type: String, trim: true, default: "" },
    numberOfPages: { type: Number, default: 0, min: 0 },
    numberOfProducts: { type: Number, default: 0, min: 0 },
    adminPanelRequired: { type: Boolean, default: false },
    paymentGatewayRequired: { type: Boolean, default: false },
    authenticationRequired: { type: Boolean, default: false },
    whatsappIntegration: { type: Boolean, default: false },
    emailIntegration: { type: Boolean, default: false },
    thirdPartyIntegrations: { type: String, trim: true, default: "" },
    hostingRequired: { type: Boolean, default: false },
    domainRequired: { type: Boolean, default: false },
    maintenanceRequired: { type: Boolean, default: false },

    // Technical requirements
    preferredTechnology: { type: String, trim: true, default: "" },
    frontend: { type: String, trim: true, default: "" },
    backend: { type: String, trim: true, default: "" },
    database: { type: String, trim: true, default: "" },
    apiRequirements: { type: String, trim: true, default: "" },
    hostingDeploymentRequirements: { type: String, trim: true, default: "" },
    otherTechnicalRequirements: { type: String, trim: true, default: "" },

    // Budget & timeline
    clientBudget: { type: Number, default: 0, min: 0 },
    expectedStartDate: { type: Date, default: null },
    expectedDeliveryDate: { type: Date, default: null },
    priority: { type: String, enum: REQUIREMENT_PRIORITY, default: "medium" },
    estimatedDevelopmentCost: { type: Number, default: 0, min: 0 },
    estimatedMaintenanceCost: { type: Number, default: 0, min: 0 },

    // Additional information
    clientExpectations: { type: String, trim: true, default: "" },
    referenceWebsites: { type: String, trim: true, default: "" },
    competitorWebsites: { type: String, trim: true, default: "" },
    designPreferences: { type: String, trim: true, default: "" },
    specialInstructions: { type: String, trim: true, default: "" },
    internalNotes: { type: String, trim: true, default: "" },

    // Page-level requirement breakdown.
    pages: { type: [pageSchema], default: [] },

    status: { type: String, enum: REQUIREMENT_STATUS, default: "draft", index: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    createdByName: { type: String, default: "System" },
  },
  { timestamps: true }
);

// A contact can hold several requirement revisions but should normally have a
// single active one. The most recently updated requirement wins when deriving
// the pipeline stage.
requirementSchema.index({ contactId: 1, updatedAt: -1 });
requirementSchema.index({ status: 1, updatedAt: -1 });
requirementSchema.index({ businessName: "text", projectName: "text", clientName: "text", email: "text", mobileNumber: "text" });

const Requirement = mongoose.model("Requirement", requirementSchema);
export default Requirement;
