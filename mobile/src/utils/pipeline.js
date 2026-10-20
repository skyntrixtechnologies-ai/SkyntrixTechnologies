// Ported from client/src/admin/utils/pipeline.js — mirrors server/models/Lead.model.js LEAD_STAGES.

export const PIPELINE_STAGES = [
  { value: "new", label: "Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting_scheduled", label: "Meeting Scheduled" },
  { value: "requirement_collected", label: "Requirement Collected" },
  { value: "quotation_sent", label: "Quotation Sent" },
  { value: "follow_up", label: "Follow-up" },
  { value: "approved", label: "Approved" },
  { value: "advance_received", label: "Advance Received" },
  { value: "agreement_signed", label: "Agreement Signed" },
  { value: "project_started", label: "Project Started" },
  { value: "design_approval", label: "Design Approval" },
  { value: "development", label: "Development" },
  { value: "testing", label: "Testing" },
  { value: "final_payment", label: "Final Payment" },
  { value: "delivered", label: "Delivered" },
  { value: "support", label: "Support / Maintenance" },
];

export const TERMINAL_STAGES = [
  { value: "closed", label: "Closed / Lost" },
  { value: "converted", label: "Converted" },
];

export const ALL_STAGES = [...PIPELINE_STAGES, ...TERMINAL_STAGES];

export const formatMoney = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
