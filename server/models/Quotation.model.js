import mongoose from "mongoose";

export const WHATSAPP_STATUS = ["pending", "sent", "awaiting_reply", "failed"];
export const QUOTATION_STATUS = ["draft", "sent", "failed"];
export const QUOTATION_ACCEPTANCE_STATUS = ["pending", "accepted", "rejected"];

// Drives the reusable wording in the generated PDF (see PROJECT_CATEGORY_META
// in quotation.service.js) so one template serves every service line the
// company sells instead of hardcoding "website" throughout.
export const PROJECT_CATEGORIES = [
  "website",
  "mobile_app",
  "billing_software",
  "crm_erp",
  "digital_marketing",
  "seo",
  "ui_ux",
  "other",
];

const serviceItemSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, default: "" },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "LeadContact", default: null },
    requirementId: { type: mongoose.Schema.Types.ObjectId, ref: "Requirement", default: null },
    clientName: { type: String, required: true, trim: true },
    businessName: { type: String, trim: true, default: "" },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "", lowercase: true },
    projectName: { type: String, required: true, trim: true },
    projectDescription: { type: String, trim: true, default: "" },
    projectCategory: { type: String, enum: PROJECT_CATEGORIES, default: "website" },
    services: { type: [serviceItemSchema], default: [] },
    projectTimeline: { type: String, trim: true, default: "" },
    paymentTerms: { type: String, trim: true, default: "" },
    // Milestone amounts (50% advance / 30% development / 20% final) are always
    // derived server-side from totalAmount - see computeMilestones() in
    // quotation.service.js. advanceAmount is kept (not user-editable) only for
    // backwards-compatible list/stat queries that sort or filter on it.
    advanceAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    // Tax is never assumed: the PDF only shows a GST line when gstApplicable is
    // explicitly set and a gstNumber is on file.
    gstApplicable: { type: Boolean, default: false },
    gstNumber: { type: String, trim: true, uppercase: true, default: "" },
    // Quotation validity window in days from createdAt; rendered as a "valid
    // until" date on the PDF instead of being silently open-ended.
    validityDays: { type: Number, default: 15, min: 1, max: 180 },
    additionalNotes: { type: String, trim: true, default: "" },

    pdfUrl: { type: String, default: "" },
    pdfPath: { type: String, default: "" },
    whatsappStatus: { type: String, enum: WHATSAPP_STATUS, default: "pending" },
    status: { type: String, enum: QUOTATION_STATUS, default: "draft" },
    sentAt: { type: Date, default: null },
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },

    // Client acceptance tracking. `approved` is kept in sync with
    // acceptanceStatus === "accepted" for backwards compatibility.
    acceptanceStatus: { type: String, enum: QUOTATION_ACCEPTANCE_STATUS, default: "pending" },
    acceptedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, trim: true, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    createdByName: { type: String, default: "System" },
  },
  { timestamps: true }
);

quotationSchema.index({ leadId: 1, createdAt: -1 });
quotationSchema.index({ contactId: 1, createdAt: -1 });
quotationSchema.index({ requirementId: 1, createdAt: -1 });
quotationSchema.index({ approved: 1, createdAt: -1 });

quotationSchema.index({ clientName: "text", businessName: "text", email: "text", mobile: "text", projectName: "text", quotationNumber: "text" });
quotationSchema.index({ status: 1, createdAt: -1 });
quotationSchema.index({ whatsappStatus: 1, createdAt: -1 });
quotationSchema.index({ sentAt: -1 });

const Quotation = mongoose.model("Quotation", quotationSchema);
export default Quotation;
