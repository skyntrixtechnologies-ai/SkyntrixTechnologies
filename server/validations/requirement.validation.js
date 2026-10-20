import { body, param, query } from "express-validator";
import {
  REQUIREMENT_PROJECT_TYPES,
  REQUIREMENT_PRIORITY,
  REQUIREMENT_STATUS,
  PAGE_TYPES,
  PAGE_PRIORITY,
  PAGE_STATUS,
  PAGE_SECTION_TYPES,
  PAGE_FEATURES,
  PAGE_FEATURE_TOGGLES,
  PAGE_ANIMATION_LEVELS,
  CONTENT_SOURCES,
  CONTENT_TYPES,
  CRUD_OPTIONS,
} from "../models/Requirement.model.js";

const SLUG_RE = /^\/?[a-z0-9][a-z0-9\-_\/]*$/;

const optionalUrl = (field, label) =>
  body(field)
    .optional({ values: "falsy" })
    .trim()
    .custom((value) => {
      if (!value) return true;
      try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        throw new Error(`${label} must be a valid URL (include https://)`);
      }
    });

const optionalText = (field, max, label) =>
  body(field)
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max })
    .withMessage(`${label || field} must be ${max} characters or fewer`);

const boolRule = (field) =>
  body(field).optional({ values: "falsy" }).isBoolean().withMessage(`${field} must be a boolean`);

const optionalNumber = (field, label) =>
  body(field)
    .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage(`${label || field} must be a positive number`);

const pageRule = body("pages")
  .optional({ values: "falsy" })
  .isArray()
  .withMessage("Pages must be a list")
  .custom((pages) => {
    for (const p of pages) {
      if (!p || typeof p !== "object") return false;
      if (!String(p.pageName || "").trim()) return false;
      if (!PAGE_TYPES.includes(p.pageType)) return false;
      if (!PAGE_PRIORITY.includes(p.priority)) return false;
      if (!PAGE_STATUS.includes(p.status)) return false;
      if (p.slug && !SLUG_RE.test(String(p.slug))) return false;
      if (p.sections && !Array.isArray(p.sections)) return false;
      if (p.sections) {
        for (const s of p.sections) {
          if (!s || typeof s !== "object") return false;
          if (!PAGE_SECTION_TYPES.includes(s.sectionType)) return false;
        }
      }
      if (p.features !== undefined && p.features !== null) {
        if (Array.isArray(p.features)) {
          for (const f of p.features) {
            if (!PAGE_FEATURES.includes(f)) return false;
          }
        } else if (typeof p.features === "object") {
          for (const [key, val] of Object.entries(p.features)) {
            if (!PAGE_FEATURE_TOGGLES.some(([k]) => k === key)) return false;
            if (typeof val !== "boolean") return false;
          }
        } else {
          return false;
        }
      }
      if (p.dynamicData?.crudOperations && !Array.isArray(p.dynamicData.crudOperations)) return false;
      if (p.dynamicData?.crudOperations) {
        for (const c of p.dynamicData.crudOperations) {
          if (!CRUD_OPTIONS.includes(c)) return false;
        }
      }
      if (p.design?.animation && !PAGE_ANIMATION_LEVELS.includes(p.design.animation)) return false;
      if (p.content?.source && !CONTENT_SOURCES.includes(p.content.source)) return false;
      if (p.content?.types && !Array.isArray(p.content.types)) return false;
      if (p.content?.types) {
        for (const t of p.content.types) {
          if (!CONTENT_TYPES.includes(t)) return false;
        }
      }
    }
    return true;
  })
  .withMessage("Each page must have a pageName, pageType, priority, status and valid details");

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(String(value));
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const socialLinksRule = body("socialMediaLinks")
  .optional({ values: "falsy" })
  .isArray()
  .withMessage("Social media links must be a list")
  .custom((links) =>
    links.every((entry) => {
      if (entry == null) return false;
      if (typeof entry === "string") return isValidHttpUrl(entry.trim());
      if (typeof entry !== "object") return false;
      const label = String(entry.label || "").trim();
      const url = String(entry.url || "").trim();
      return Boolean(label) && isValidHttpUrl(url);
    })
  )
  .withMessage("Each social media entry needs a label and a valid URL");

export const requirementFields = [
  body("contactId").optional({ values: "falsy" }).isMongoId().withMessage("Invalid contact id"),
  body("leadId").optional({ values: "falsy" }).isMongoId().withMessage("Invalid lead id"),

  body("businessName").optional({ values: "falsy" }).trim().isLength({ max: 200 }).withMessage("Business name must be 200 characters or fewer"),
  body("clientName").optional({ values: "falsy" }).trim().isLength({ max: 200 }).withMessage("Client name must be 200 characters or fewer"),
  body("mobileNumber").optional({ values: "falsy" }).trim().isLength({ max: 20 }).withMessage("Mobile number must be 20 characters or fewer"),
  body("email").optional({ values: "falsy" }).trim().isEmail().withMessage("Enter a valid email address").isLength({ max: 200 }).withMessage("Email must be 200 characters or fewer"),
  optionalText("location", 200, "Location"),
  optionalUrl("existingWebsite", "Existing website"),
  socialLinksRule,

  body("projectType")
    .optional({ values: "falsy" })
    .isIn(REQUIREMENT_PROJECT_TYPES)
    .withMessage("Invalid project type"),
  optionalText("projectName", 200, "Project name"),
  optionalText("businessDescription", 5000, "Business description"),
  optionalText("projectDescription", 5000, "Project description"),
  optionalText("mainObjective", 2000, "Main objective"),
  optionalText("targetAudience", 2000, "Target audience"),
  optionalText("requiredFeatures", 5000, "Required features"),
  optionalNumber("numberOfPages", "Number of pages"),
  optionalNumber("numberOfProducts", "Number of products"),
  boolRule("adminPanelRequired"),
  boolRule("paymentGatewayRequired"),
  boolRule("authenticationRequired"),
  boolRule("whatsappIntegration"),
  boolRule("emailIntegration"),
  optionalText("thirdPartyIntegrations", 2000, "Third-party integrations"),
  boolRule("hostingRequired"),
  boolRule("domainRequired"),
  boolRule("maintenanceRequired"),

  optionalText("preferredTechnology", 500, "Preferred technology"),
  optionalText("frontend", 500, "Frontend"),
  optionalText("backend", 500, "Backend"),
  optionalText("database", 500, "Database"),
  optionalText("apiRequirements", 2000, "API requirements"),
  optionalText("hostingDeploymentRequirements", 2000, "Hosting / deployment requirements"),
  optionalText("otherTechnicalRequirements", 2000, "Other technical requirements"),

  optionalNumber("clientBudget", "Client budget"),
  body("expectedStartDate").optional({ values: "falsy" }).isISO8601().withMessage("Invalid expected start date"),
  body("expectedDeliveryDate").optional({ values: "falsy" }).isISO8601().withMessage("Invalid expected delivery date"),
  body("priority").optional({ values: "falsy" }).isIn(REQUIREMENT_PRIORITY).withMessage("Invalid priority"),
  optionalNumber("estimatedDevelopmentCost", "Estimated development cost"),
  optionalNumber("estimatedMaintenanceCost", "Estimated maintenance cost"),

  optionalText("clientExpectations", 3000, "Client expectations"),
  optionalText("referenceWebsites", 3000, "Reference websites"),
  optionalText("competitorWebsites", 3000, "Competitor websites"),
  optionalText("designPreferences", 3000, "Design preferences"),
  optionalText("specialInstructions", 3000, "Special instructions"),
  optionalText("internalNotes", 3000, "Internal notes"),
  pageRule,
];

export const createRequirementValidation = [
  ...requirementFields,
  body("status").optional({ values: "falsy" }).isIn(REQUIREMENT_STATUS).withMessage("Invalid requirement status"),
];

export const updateRequirementValidation = [
  ...requirementFields,
  body("status").optional({ values: "falsy" }).isIn(REQUIREMENT_STATUS).withMessage("Invalid requirement status"),
];

export const requirementIdParam = [param("id").isMongoId().withMessage("Invalid requirement id")];

export const requirementStatusValidation = [
  ...requirementIdParam,
  body("status").isIn(REQUIREMENT_STATUS).withMessage("Invalid requirement status"),
];

export const listRequirementsValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 200 }).withMessage("Limit must be 1-200"),
  query("sort").optional().isString(),
  query("search").optional().isString(),
  query("status").optional().isString(),
  query("contactId").optional().isMongoId().withMessage("Invalid contact id"),
  query("priority").optional().isString(),
  query("projectType").optional().isString(),
  query("from").optional().isISO8601().withMessage("Invalid from date"),
  query("to").optional().isISO8601().withMessage("Invalid to date"),
];
