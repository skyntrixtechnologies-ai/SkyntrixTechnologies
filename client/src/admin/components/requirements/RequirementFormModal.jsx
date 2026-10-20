import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSave, FaFileInvoiceDollar, FaUser, FaProjectDiagram, FaCode,
  FaCoins, FaClipboardList, FaPlus, FaTrash, FaExternalLinkAlt, FaDownload,
  FaChevronUp, FaChevronDown, FaPencilAlt, FaLayerGroup,
} from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { adminGet, adminPost, adminPut } from "../../api";
import { useToast } from "../../Toast";
import { Button, Field, Input, Select, Switch, Textarea } from "../Ui";
import { generateRequirementPDF } from "../../utils/requirementPDF";
import { formatMobileNumber, PROJECT_TYPES, REQUIREMENT_PRIORITIES, SOCIAL_LABELS, isValidUrl, normalizeSocialLinks } from "../../utils/requirement";
import {
  PAGE_PRIORITY_BADGE,
  PAGE_STATUS_BADGE,
  enabledFeatureLabels,
  normalizePage,
  pagesSummary,
} from "../../utils/requirementPages";
import PageFormModal from "./PageFormModal";

const BOOL_FIELDS = [
  ["adminPanelRequired", "Admin Panel Required"],
  ["paymentGatewayRequired", "Payment Gateway Required"],
  ["authenticationRequired", "Authentication Required"],
  ["whatsappIntegration", "WhatsApp Integration"],
  ["emailIntegration", "Email Integration"],
  ["hostingRequired", "Hosting Required"],
  ["domainRequired", "Domain Required"],
  ["maintenanceRequired", "Maintenance Required"],
];

const EMPTY = {
  businessName: "",
  clientName: "",
  mobileNumber: "",
  email: "",
  location: "",
  existingWebsite: "",
  socialMediaLinks: [],
  projectType: "",
  projectName: "",
  businessDescription: "",
  projectDescription: "",
  mainObjective: "",
  targetAudience: "",
  requiredFeatures: "",
  numberOfPages: "",
  numberOfProducts: "",
  adminPanelRequired: false,
  paymentGatewayRequired: false,
  authenticationRequired: false,
  whatsappIntegration: false,
  emailIntegration: false,
  thirdPartyIntegrations: "",
  hostingRequired: false,
  domainRequired: false,
  maintenanceRequired: false,
  preferredTechnology: "",
  frontend: "",
  backend: "",
  database: "",
  apiRequirements: "",
  hostingDeploymentRequirements: "",
  otherTechnicalRequirements: "",
  clientBudget: "",
  expectedStartDate: "",
  expectedDeliveryDate: "",
  priority: "medium",
  estimatedDevelopmentCost: "",
  estimatedMaintenanceCost: "",
  clientExpectations: "",
  referenceWebsites: "",
  competitorWebsites: "",
  designPreferences: "",
  specialInstructions: "",
  internalNotes: "",
  pages: [],
};

const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

// An "Other" placeholder is not a real label - it must be replaced with custom text.
const socialLabel = (s) => {
  const label = (s?.label || "").trim();
  return label === "Other" ? "" : label;
};

// Returns an error message, or null when the social media entries are valid.
const validateSocialLinks = (list = []) => {
  for (let i = 0; i < list.length; i += 1) {
    const url = (list[i]?.url || "").trim();
    const label = socialLabel(list[i]);
    if (!url && !label) continue; // fully empty row - dropped on save
    if (!label || !url) return `Social media entry ${i + 1} needs both a label and a URL`;
    if (!isValidUrl(url)) return `"${label}" has an invalid URL. Include https://`;
  }
  return null;
};

const normalizeForSave = (form, contact) => {
  const pages = (form.pages || []).map(normalizePage).map((p, i) => ({
    ...p,
    order: i,
  }));
  return {
  contactId: contact?._id,
  businessName: (form.businessName || contact?.businessName || "").trim(),
  clientName: (form.clientName || contact?.contactPerson || contact?.businessName || "").trim(),
  mobileNumber: (form.mobileNumber || contact?.mobileNumber || "").trim(),
  email: (form.email || contact?.email || "").trim(),
  location: (form.location || contact?.location || "").trim(),
  existingWebsite: (form.existingWebsite || contact?.websiteLink || "").trim(),
  socialMediaLinks: (form.socialMediaLinks || [])
    .map((s) => ({ label: socialLabel(s), url: (s?.url || "").trim() }))
    .filter((s) => s.label && s.url),
  projectType: form.projectType,
  projectName: form.projectName.trim(),
  businessDescription: form.businessDescription.trim(),
  projectDescription: form.projectDescription.trim(),
  mainObjective: form.mainObjective.trim(),
  targetAudience: form.targetAudience.trim(),
  requiredFeatures: form.requiredFeatures.trim(),
  numberOfPages: pages.length,
  numberOfProducts: Math.max(0, Number(form.numberOfProducts) || 0),
  adminPanelRequired: Boolean(form.adminPanelRequired),
  paymentGatewayRequired: Boolean(form.paymentGatewayRequired),
  authenticationRequired: Boolean(form.authenticationRequired),
  whatsappIntegration: Boolean(form.whatsappIntegration),
  emailIntegration: Boolean(form.emailIntegration),
  thirdPartyIntegrations: form.thirdPartyIntegrations.trim(),
  hostingRequired: Boolean(form.hostingRequired),
  domainRequired: Boolean(form.domainRequired),
  maintenanceRequired: Boolean(form.maintenanceRequired),
  preferredTechnology: form.preferredTechnology.trim(),
  frontend: form.frontend.trim(),
  backend: form.backend.trim(),
  database: form.database.trim(),
  apiRequirements: form.apiRequirements.trim(),
  hostingDeploymentRequirements: form.hostingDeploymentRequirements.trim(),
  otherTechnicalRequirements: form.otherTechnicalRequirements.trim(),
  clientBudget: Math.max(0, Number(form.clientBudget) || 0),
  expectedStartDate: form.expectedStartDate ? new Date(form.expectedStartDate).toISOString() : null,
  expectedDeliveryDate: form.expectedDeliveryDate ? new Date(form.expectedDeliveryDate).toISOString() : null,
  priority: form.priority || "medium",
  estimatedDevelopmentCost: Math.max(0, Number(form.estimatedDevelopmentCost) || 0),
  estimatedMaintenanceCost: Math.max(0, Number(form.estimatedMaintenanceCost) || 0),
  clientExpectations: form.clientExpectations.trim(),
  referenceWebsites: form.referenceWebsites.trim(),
  competitorWebsites: form.competitorWebsites.trim(),
  designPreferences: form.designPreferences.trim(),
  specialInstructions: form.specialInstructions.trim(),
  internalNotes: form.internalNotes.trim(),
  pages,
};
};

export default function RequirementFormModal({ open, onClose, contact, requirement, onSaved }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isEdit = Boolean(requirement?._id);

  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [savingToQuote, setSavingToQuote] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const summary = useMemo(() => pagesSummary(form.pages), [form.pages]);

  const handleDownloadPdf = async () => {
    if (!requirement?._id) return;
    setPdfDownloading(true);
    try {
      const res = await adminGet(`/requirements/${requirement._id}`);
      await generateRequirementPDF(res.data);
      toast.ok("Requirement PDF downloaded successfully.");
    } catch (e) {
      toast.error("Unable to generate requirement PDF. Please try again.");
    } finally {
      setPdfDownloading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    if (requirement) {
      setForm({
        ...EMPTY,
        ...requirement,
        socialMediaLinks: normalizeSocialLinks(requirement.socialMediaLinks),
        numberOfPages: requirement.numberOfPages ?? "",
        numberOfProducts: requirement.numberOfProducts ?? "",
        clientBudget: requirement.clientBudget ?? "",
        estimatedDevelopmentCost: requirement.estimatedDevelopmentCost ?? "",
        estimatedMaintenanceCost: requirement.estimatedMaintenanceCost ?? "",
        expectedStartDate: toDateInput(requirement.expectedStartDate),
        expectedDeliveryDate: toDateInput(requirement.expectedDeliveryDate),
        pages: Array.isArray(requirement.pages) && requirement.pages.length ? requirement.pages.map(normalizePage) : [],
      });
    } else {
      setForm({
        ...EMPTY,
        businessName: contact?.businessName || "",
        clientName: contact?.contactPerson || "",
        mobileNumber: contact?.mobileNumber || "",
        email: contact?.email || "",
        location: contact?.location || "",
        existingWebsite: contact?.websiteLink || "",
        socialMediaLinks: normalizeSocialLinks(contact?.socialMediaLinks),
      });
    }
  }, [open, requirement, contact]);

  const set = (key) => (e) => {
    const value = e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const setBool = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  const setLinkLabel = (i) => (e) => {
    setForm((f) => {
      const next = [...(f.socialMediaLinks || [])];
      next[i] = { ...next[i], label: e?.target?.value };
      return { ...f, socialMediaLinks: next };
    });
  };

  const setLinkUrl = (i) => (e) => {
    setForm((f) => {
      const next = [...(f.socialMediaLinks || [])];
      next[i] = { ...next[i], url: e?.target?.value };
      return { ...f, socialMediaLinks: next };
    });
  };

  const removeLink = (i) => {
    setForm((f) => {
      const next = [...(f.socialMediaLinks || [])];
      next.splice(i, 1);
      return { ...f, socialMediaLinks: next };
    });
  };

  const addLink = () => setForm((f) => ({ ...f, socialMediaLinks: [...(f.socialMediaLinks || []), { label: "Instagram", url: "" }] }));

  const moveLink = (index, dir) => {
    setForm((f) => {
      const next = [...(f.socialMediaLinks || [])];
      const j = index + dir;
      if (j < 0 || j >= next.length) return f;
      const tmp = next[index];
      next[index] = next[j];
      next[j] = tmp;
      return { ...f, socialMediaLinks: next };
    });
  };

  const openAddPage = () => {
    setEditingPage(null);
    setPageModalOpen(true);
  };

  const openEditPage = (index) => {
    setEditingPage(index);
    setPageModalOpen(true);
  };

  const savePage = (page) => {
    setForm((f) => {
      const next = [...(f.pages || [])];
      if (editingPage === null) next.push(page);
      else next[editingPage] = page;
      return { ...f, pages: next };
    });
    setPageModalOpen(false);
  };

  const removePage = (index) => {
    setForm((f) => {
      const next = [...(f.pages || [])];
      next.splice(index, 1);
      return { ...f, pages: next };
    });
    toast.ok("Page removed");
  };

  const movePage = (index, dir) => {
    setForm((f) => {
      const next = [...(f.pages || [])];
      const j = index + dir;
      if (j < 0 || j >= next.length) return f;
      const tmp = next[index];
      next[index] = next[j];
      next[j] = tmp;
      return { ...f, pages: next };
    });
  };

  const estimate = useMemo(
    () => Math.max(0, Number(form.estimatedDevelopmentCost) || 0) + Math.max(0, Number(form.estimatedMaintenanceCost) || 0),
    [form.estimatedDevelopmentCost, form.estimatedMaintenanceCost]
  );

  const validate = (asQuotation) => {
    if (asQuotation && !form.projectType) {
      toast.error("Select a Project Type before moving to quotation");
      return false;
    }
    if (asQuotation && !form.projectName.trim()) {
      toast.error("Enter a Project Name before moving to quotation");
      return false;
    }
    const socialError = validateSocialLinks(form.socialMediaLinks);
    if (socialError) {
      toast.error(socialError);
      return false;
    }
    return true;
  };

  const persist = async (status, thenNavigate = false) => {
    const payload = normalizeForSave(form, contact);
    try {
      let id = requirement?._id;
      if (isEdit) {
        await adminPut(`/requirements/${id}`, { ...payload, status });
      } else {
        const res = await adminPost("/requirements", { ...payload, status });
        id = res.data?._id || id;
      }
      toast.ok(status === "ready_for_quotation" ? "Requirement marked ready for quotation" : "Requirement saved");
      if (thenNavigate && id) {
        onClose();
        navigate(`/admin/quotations/create?requirementId=${id}`);
      } else {
        onSaved?.(id);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const saveDraft = async () => {
    if (!validate(false)) return;
    setSaving(true);
    try {
      await persist(requirement?.status || "collected", false);
    } finally {
      setSaving(false);
    }
  };

  const saveToQuotation = async () => {
    if (!validate(true)) return;
    setSavingToQuote(true);
    try {
      await persist("ready_for_quotation", true);
    } finally {
      setSavingToQuote(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm">
      <div className="mt-4 w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              {isEdit ? "Edit Requirement" : "Collect Requirement"}
            </h3>
            <p className="text-xs text-ink/50">
              {contact?.businessName} · {formatMobileNumber(contact?.mobileNumber)}
            </p>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Close">✕</button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <div className="mb-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide">
            {[
              [FaUser, "Client Details"],
              [FaProjectDiagram, "Project Details"],
              [FaLayerGroup, "Website Pages"],
              [FaListCheck, "Features"],
              [FaCode, "Technical"],
              [FaCoins, "Budget & Timeline"],
              [FaClipboardList, "Additional"],
            ].map(([Icon, label]) => (
              <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-base bg-base/40 px-3 py-1 text-ink/50">
                <Icon className="h-3 w-3 text-primary" /> {label}
              </span>
            ))}
          </div>

          <div className="space-y-6">
            {/* Client Details */}
            <Section icon={<FaUser />} title="Client Details" hint="Pre-filled from the contact - edit if needed">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business Name">
                  <Input value={form.businessName} onChange={set("businessName")} placeholder="Business name" />
                </Field>
                <Field label="Client / Contact Person">
                  <Input value={form.clientName} onChange={set("clientName")} placeholder="Contact person" />
                </Field>
                <Field label="Mobile Number">
                  <Input value={form.mobileNumber} onChange={set("mobileNumber")} placeholder="98765 43210" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={form.email} onChange={set("email")} placeholder="client@business.com" />
                </Field>
                <Field label="Location">
                  <Input value={form.location} onChange={set("location")} placeholder="City / area" />
                </Field>
                <Field label="Existing Website">
                  <Input value={form.existingWebsite} onChange={set("existingWebsite")} placeholder="https://..." />
                </Field>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink/70">Social Media Links</span>
                  <Button size="sm" variant="secondary" type="button" onClick={addLink}>
                    <FaPlus className="h-3 w-3" /> Add Social Media
                  </Button>
                </div>
                {(!form.socialMediaLinks || form.socialMediaLinks.length === 0) ? (
                  <p className="rounded-xl border border-dashed border-base bg-base/20 px-4 py-4 text-center text-xs text-ink/40">
                    No social media links added. Click "Add Social Media" to add a platform.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(form.socialMediaLinks || []).map((entry, i) => {
                      const label = entry?.label || "";
                      const isCustom = label === "Other" || !SOCIAL_LABELS.includes(label);
                      const customValue = label === "Other" ? "" : label;
                      return (
                        <div key={i} className="rounded-xl border border-base bg-base/30 p-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Platform">
                              <Select
                                value={isCustom ? "Other" : label}
                                onChange={setLinkLabel(i)}
                                options={SOCIAL_LABELS.map((l) => ({ value: l, label: l }))}
                              />
                              {isCustom && (
                                <div className="mt-2">
                                  <Input value={customValue} onChange={setLinkLabel(i)} placeholder="Custom label (e.g. Google Business Profile)" />
                                </div>
                              )}
                            </Field>
                            <Field label="Link / URL">
                              <Input value={entry?.url || ""} onChange={setLinkUrl(i)} placeholder="https://..." />
                            </Field>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            <button type="button" onClick={() => moveLink(i, -1)} disabled={i === 0} className="rounded-lg border border-base bg-white p-1.5 text-ink/50 hover:text-primary disabled:opacity-30" title="Move up">
                              <FaChevronUp className="h-3 w-3" />
                            </button>
                            <button type="button" onClick={() => moveLink(i, 1)} disabled={i === (form.socialMediaLinks || []).length - 1} className="rounded-lg border border-base bg-white p-1.5 text-ink/50 hover:text-primary disabled:opacity-30" title="Move down">
                              <FaChevronDown className="h-3 w-3" />
                            </button>
                            <button type="button" onClick={() => removeLink(i)} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100" title="Remove">
                              <FaTrash className="h-3 w-3" /> Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Section>

            {/* Project Details */}
            <Section icon={<FaProjectDiagram />} title="Project Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Project Type">
                  <Select value={form.projectType} onChange={set("projectType")} options={PROJECT_TYPES.map((p) => ({ value: p, label: p }))} placeholder="Select project type" />
                </Field>
                <Field label="Project Name">
                  <Input value={form.projectName} onChange={set("projectName")} placeholder="e.g. Restaurant Website with Online Ordering" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Business Description">
                    <Textarea rows={2} value={form.businessDescription} onChange={set("businessDescription")} placeholder="Describe the client's business" />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Project Description">
                    <Textarea rows={3} value={form.projectDescription} onChange={set("projectDescription")} placeholder="Scope, goals and deliverables" />
                  </Field>
                </div>
                <Field label="Main Objective">
                  <Input value={form.mainObjective} onChange={set("mainObjective")} placeholder="Primary goal of the project" />
                </Field>
                <Field label="Target Audience">
                  <Input value={form.targetAudience} onChange={set("targetAudience")} placeholder="Who is this for?" />
                </Field>
                <Field label="Number of Products / Services">
                  <Input type="number" min="0" value={form.numberOfProducts} onChange={set("numberOfProducts")} placeholder="e.g. 50" />
                </Field>
              </div>
            </Section>

            {/* Website Pages */}
            <Section icon={<FaLayerGroup />} title="Website Pages / Screens" hint="Break down the project page by page.">
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  ["Total Pages", summary.totalPages],
                  ["Total Sections", summary.totalSections],
                  ["Total Features", summary.totalFeatures],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-base bg-base/40 px-3 py-2.5 text-center">
                    <div className="text-xs text-ink/50">{label}</div>
                    <div className="mt-0.5 text-sm font-bold text-ink">{value}</div>
                  </div>
                ))}
              </div>

              {form.pages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-base bg-base/20 px-4 py-8 text-center text-sm text-ink/40">
                  No pages added yet. Add the pages of this website to capture detailed requirements.
                </div>
              ) : (
                <div className="space-y-2">
                  {form.pages.map((p, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-base bg-white px-4 py-3">
                      <button
                        type="button"
                        onClick={() => movePage(i, -1)}
                        disabled={i === 0}
                        className="rounded-lg border border-base bg-base/40 p-1.5 text-ink/50 hover:text-primary disabled:opacity-30"
                        title="Move up"
                      >
                        <FaChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePage(i, 1)}
                        disabled={i === form.pages.length - 1}
                        className="rounded-lg border border-base bg-base/40 p-1.5 text-ink/50 hover:text-primary disabled:opacity-30"
                        title="Move down"
                      >
                        <FaChevronDown className="h-3 w-3" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-ink">{p.pageName || "Untitled Page"}</span>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PAGE_PRIORITY_BADGE[p.priority] || PAGE_PRIORITY_BADGE.medium}`}>
                            {p.priority}
                          </span>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PAGE_STATUS_BADGE[p.status] || PAGE_STATUS_BADGE.required}`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="mt-0.5 truncate text-xs text-ink/50">
                          {p.pageType || "Page"} · {p.sections?.length || 0} section{(p.sections?.length || 0) === 1 ? "" : "s"} · {enabledFeatureLabels(p.features).length} features
                          {p.dynamicData?.enabled ? " · dynamic data" : ""}
                        </div>
                      </div>
                      <button type="button" onClick={() => openEditPage(i)} className="rounded-lg border border-base bg-white p-2 text-ink/50 hover:text-primary" title="Edit page">
                        <FaPencilAlt className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => removePage(i)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100" title="Remove page">
                        <FaTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button size="sm" variant="secondary" type="button" className="mt-4" onClick={openAddPage}>
                <FaPlus className="h-3 w-3" /> Add Page
              </Button>
            </Section>

            {/* Features */}
            <Section icon={<FaListCheck />} title="Required Features">
              <Field label="Required Features" hint="List must-have functionality, one per line">
                <Textarea rows={4} value={form.requiredFeatures} onChange={set("requiredFeatures")} placeholder={"Online ordering\nPayment gateway\nUser dashboard..."} />
              </Field>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BOOL_FIELDS.map(([key, label]) => (
                  <div key={key} className="rounded-xl border border-base bg-base/40 px-3 py-2.5">
                    <Switch checked={Boolean(form[key])} onChange={setBool(key)} label={label} />
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Field label="Third-party Integrations" hint="e.g. Razorpay, WhatsApp Business API, Google Maps">
                  <Input value={form.thirdPartyIntegrations} onChange={set("thirdPartyIntegrations")} placeholder="Comma separated integrations" />
                </Field>
              </div>
            </Section>

            {/* Technical Requirements */}
            <Section icon={<FaCode />} title="Technical Requirements">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Preferred Technology">
                  <Input value={form.preferredTechnology} onChange={set("preferredTechnology")} placeholder="e.g. MERN, Laravel, Flutter" />
                </Field>
                <Field label="Frontend">
                  <Input value={form.frontend} onChange={set("frontend")} placeholder="e.g. React, Vue" />
                </Field>
                <Field label="Backend">
                  <Input value={form.backend} onChange={set("backend")} placeholder="e.g. Node.js, Django" />
                </Field>
                <Field label="Database">
                  <Input value={form.database} onChange={set("database")} placeholder="e.g. MongoDB, PostgreSQL" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="API Requirements">
                    <Input value={form.apiRequirements} onChange={set("apiRequirements")} placeholder="Any external APIs to integrate" />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Hosting / Deployment Requirements">
                    <Input value={form.hostingDeploymentRequirements} onChange={set("hostingDeploymentRequirements")} placeholder="Preferred hosting, CI/CD needs" />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Other Technical Requirements">
                    <Textarea rows={2} value={form.otherTechnicalRequirements} onChange={set("otherTechnicalRequirements")} placeholder="Anything else technical" />
                  </Field>
                </div>
              </div>
            </Section>

            {/* Budget & Timeline */}
            <Section icon={<FaCoins />} title="Budget & Timeline">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Client Budget (Rs.)">
                  <Input type="number" min="0" value={form.clientBudget} onChange={set("clientBudget")} placeholder="e.g. 80000" />
                </Field>
                <Field label="Priority">
                  <Select value={form.priority} onChange={set("priority")} options={REQUIREMENT_PRIORITIES} placeholder={false} />
                </Field>
                <Field label="Expected Start Date">
                  <Input type="date" value={form.expectedStartDate} onChange={set("expectedStartDate")} />
                </Field>
                <Field label="Expected Delivery Date">
                  <Input type="date" value={form.expectedDeliveryDate} onChange={set("expectedDeliveryDate")} />
                </Field>
                <Field label="Estimated Development Cost (Rs.)">
                  <Input type="number" min="0" value={form.estimatedDevelopmentCost} onChange={set("estimatedDevelopmentCost")} placeholder="e.g. 25000" />
                </Field>
                <Field label="Estimated Maintenance Cost (Rs.)">
                  <Input type="number" min="0" value={form.estimatedMaintenanceCost} onChange={set("estimatedMaintenanceCost")} placeholder="e.g. 3000" />
                </Field>
              </div>
              {estimate > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-2.5 text-sm">
                  <span className="text-ink/60">Estimated project value</span>
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(estimate)}
                  </span>
                </div>
              )}
            </Section>

            {/* Additional Information */}
            <Section icon={<FaClipboardList />} title="Additional Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Client Expectations">
                  <Textarea rows={2} value={form.clientExpectations} onChange={set("clientExpectations")} placeholder="What the client expects from this project" />
                </Field>
                <Field label="Design Preferences">
                  <Textarea rows={2} value={form.designPreferences} onChange={set("designPreferences")} placeholder="Colors, style, mood" />
                </Field>
                <Field label="Reference Websites" hint="Sites the client likes">
                  <Input value={form.referenceWebsites} onChange={set("referenceWebsites")} placeholder="https://..." />
                </Field>
                <Field label="Competitor Websites">
                  <Input value={form.competitorWebsites} onChange={set("competitorWebsites")} placeholder="https://..." />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Special Instructions">
                    <Textarea rows={2} value={form.specialInstructions} onChange={set("specialInstructions")} placeholder="Anything the team must know" />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Internal Notes" hint="Only visible to the Skyntrix team">
                    <Textarea rows={2} value={form.internalNotes} onChange={set("internalNotes")} placeholder="Internal commentary" />
                  </Field>
                </div>
              </div>
            </Section>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t px-5 py-4">
          {isEdit && (
            <Button variant="ghost" onClick={handleDownloadPdf} loading={pdfDownloading} disabled={saving || savingToQuote} className="mr-auto">
              <FaDownload className="h-3.5 w-3.5" /> Download PDF
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={saveDraft} loading={saving}>
            <FaSave className="h-3.5 w-3.5" /> Save Requirement
          </Button>
          <Button onClick={saveToQuotation} loading={savingToQuote}>
            <FaFileInvoiceDollar className="h-3.5 w-3.5" /> Save & Move to Quotation
          </Button>
        </div>
      </div>

      <PageFormModal
        open={pageModalOpen}
        onClose={() => setPageModalOpen(false)}
        page={editingPage === null ? null : form.pages[editingPage]}
        onSave={savePage}
      />
    </div>
  );
}

function Section({ icon, title, hint, children }) {
  return (
    <div className="rounded-2xl border border-base bg-white p-5">
      <h4 className="mb-4 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-ink/60">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-gradient text-white">{icon}</span>
        {title}
      </h4>
      {hint && <p className="mb-4 -mt-2 text-xs text-ink/40">{hint}</p>}
      {children}
    </div>
  );
}
