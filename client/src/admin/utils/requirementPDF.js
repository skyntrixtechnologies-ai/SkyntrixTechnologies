import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../../assets/logo.png";
import { PAGE_FEATURE_TOGGLES, normalizeFeatures } from "./requirementPages";
import { normalizeSocialLinks } from "./requirement";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = { top: 34, right: 12, bottom: 22, left: 12 };
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN.left - MARGIN.right;
const RIGHT = PAGE_WIDTH - MARGIN.right;
const MAX_Y = PAGE_HEIGHT - MARGIN.bottom;

const COLORS = {
  brand: [109, 40, 217],
  brandLight: [243, 232, 255],
  blue: [37, 99, 235],
  ink: [15, 23, 42],
  slate: [71, 85, 105],
  slateLight: [100, 116, 139],
  muted: [148, 163, 184],
  bg: [248, 250, 252],
  border: [226, 232, 240],
  green: [5, 150, 105],
  amberBg: [254, 243, 199],
  amberText: [146, 64, 14],
};

const STATUS_COLORS = {
  draft: [100, 116, 139],
  collected: [8, 145, 178],
  under_review: [217, 119, 6],
  ready_for_quotation: [5, 150, 105],
};

const STATUS_LABELS = {
  draft: "Draft",
  collected: "Collected",
  under_review: "Under Review",
  ready_for_quotation: "Ready for Quotation",
};

const statusLabel = (s) => STATUS_LABELS[s] || String(s || "").replace(/_/g, " ");

const hasValue = (v) => {
  if (v === undefined || v === null) return false;
  if (typeof v === "number") return v > 0;
  if (Array.isArray(v)) return v.some(hasValue);
  return String(v).trim().length > 0;
};

const titleCase = (s) =>
  String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const formatDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatDateTime = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const money = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "";
  return `Rs. ${n.toLocaleString("en-IN")}`;
};

// Breaks unreasonably long unbroken tokens (URLs etc.) so they wrap instead of clipping.
const softWrap = (text, max = 50) =>
  String(text || "")
    .split(/(\s+)/)
    .map((part) =>
      /\s/.test(part) || part.length <= max ? part : part.match(new RegExp(`.{1,${max}}`, "g")).join(" ")
    )
    .join("");

const formatValue = (raw, fmt) => {
  if (!hasValue(raw)) return "Not Provided";
  if (fmt === "money") return money(raw) || "Not Provided";
  if (fmt === "date") return formatDate(raw) || "Not Provided";
  if (fmt === "title") return titleCase(raw) || "Not Provided";
  if (Array.isArray(raw)) return softWrap(raw.filter(hasValue).join(", "));
  return softWrap(String(raw).trim());
};

const buildFilename = (r) => {
  const base = String(r.projectName || r.businessName || "Project")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return `SkynTrix_Requirement_${r._id}_${base || "Project"}.pdf`;
};

const loadImageDataUrl = (url) =>
  new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    } catch {
      resolve(null);
    }
  });

const drawCheck = (doc, x, y) => {
  doc.setLineWidth(0.8);
  doc.setDrawColor(...COLORS.green);
  doc.lines([[1.5, 1.6], [1.4, -3]], x - 1.4, y - 0.6, [1, 1], "S");
};

const drawCross = (doc, x, y) => {
  doc.setLineWidth(0.7);
  doc.setDrawColor(...COLORS.muted);
  doc.line(x - 1.5, y - 1.5, x + 1.5, y + 1.5);
  doc.line(x - 1.5, y + 1.5, x + 1.5, y - 1.5);
};

const drawPageHeader = (doc, logo) => {
  if (logo) {
    doc.addImage(logo, "PNG", MARGIN.left, 8, 9, 9);
  } else {
    doc.setFillColor(...COLORS.brand);
    doc.roundedRect(MARGIN.left, 8, 9, 9, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text("S", MARGIN.left + 4.5, 15, { align: "center" });
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(...COLORS.ink);
  doc.text("SkynTrix Technologies", MARGIN.left + 11, 13.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slateLight);
  doc.text("Building Digital Experiences That Drive Growth", MARGIN.left + 11, 18.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLORS.brand);
  doc.text("PROJECT REQUIREMENT DOCUMENT", RIGHT, 13, { align: "right" });
  doc.setDrawColor(...COLORS.brand);
  doc.setLineWidth(0.5);
  doc.line(MARGIN.left, 25, RIGHT, 25);
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.2);
  doc.line(MARGIN.left, 26.5, RIGHT, 26.5);
};

const drawPageFooter = (doc, pageNum, total, generated) => {
  const y = PAGE_HEIGHT - 12;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(MARGIN.left, y, RIGHT, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.slate);
  doc.text("SkynTrix Technologies", MARGIN.left, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.slateLight);
  doc.text("Building Digital Experiences That Drive Growth", MARGIN.left + 32, y + 4);
  doc.setFontSize(7.5);
  doc.text(`Page ${pageNum} of ${total}`, RIGHT, y + 4, { align: "right" });
  doc.setTextColor(...COLORS.slateLight);
  doc.text(`Generated ${generated}`, RIGHT, y + 8.5, { align: "right" });
};

const drawStatusBadge = (doc, status, x, y) => {
  const label = statusLabel(status);
  const color = STATUS_COLORS[status] || COLORS.slate;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const w = doc.getTextWidth(label) + 8;
  doc.setFillColor(...color);
  doc.roundedRect(x, y, w, 6, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(label, x + w / 2, y + 4.2, { align: "center" });
};

const drawTitleBlock = (doc, r) => {
  const y0 = MARGIN.top;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.ink);
  doc.text("PROJECT REQUIREMENT DOCUMENT", MARGIN.left, y0 + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.slate);
  doc.text(`${r.businessName || "Client Requirement"} · Requirement Specification`, MARGIN.left, y0 + 12);

  const boxY = y0 + 17;
  const boxH = 20;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN.left, boxY, CONTENT_WIDTH, boxH, 1.5, 1.5, "S");

  const colW = CONTENT_WIDTH / 4;
  const cells = [
    { label: "Requirement ID", value: r._id || "", badge: false },
    { label: "Status", value: r.status, badge: true },
    { label: "Created", value: formatDate(r.createdAt), badge: false },
    { label: "Last Updated", value: formatDate(r.updatedAt), badge: false },
  ];

  cells.forEach((c, i) => {
    const cx = MARGIN.left + i * colW;
    if (i > 0) {
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.2);
      doc.line(cx, boxY, cx, boxY + boxH);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.slateLight);
    doc.text(c.label.toUpperCase(), cx + 3, boxY + 5);
    if (c.badge) {
      drawStatusBadge(doc, c.value, cx + 3, boxY + 8);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...COLORS.ink);
      doc.text(String(c.value || "—"), cx + 3, boxY + 13.5, { maxWidth: colW - 6 });
    }
  });

  return boxY + boxH + 8;
};

const drawSectionTitle = (doc, title, y, extra = {}) => {
  const h = extra.height || 8;
  doc.setFillColor(...(extra.bg || COLORS.brandLight));
  doc.rect(MARGIN.left, y, CONTENT_WIDTH, h, "F");
  doc.setFillColor(...(extra.accent || COLORS.brand));
  doc.rect(MARGIN.left, y, 2.5, h, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...(extra.textColor || COLORS.brand));
  doc.text(String(title).toUpperCase(), MARGIN.left + 6.5, y + h / 2 + 1);
  if (extra.rightLabel) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...(extra.rightColor || COLORS.slateLight));
    doc.text(extra.rightLabel, RIGHT - 5, y + h / 2 + 1, { align: "right" });
  }
  return y + h + 2.5;
};

const drawSubLabel = (doc, title, y) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.brand);
  doc.text(String(title).toUpperCase(), MARGIN.left, y + 4);
  return y + 7;
};

// Adds a page (with header) when the given vertical space does not fit on the
// current page, so section titles / blocks are never orphaned at a page bottom.
const ensureSpace = (doc, logo, y, needed) => {
  if (y + needed > MAX_Y) {
    doc.addPage();
    drawPageHeader(doc, logo);
    return MARGIN.top;
  }
  return y;
};

const baseTableOptions = (logo, startY) => ({
  startY,
  margin: MARGIN,
  didDrawPage: (data) => drawPageHeader(data.doc, logo),
});

const renderLabelValueTable = (doc, logo, rows, startY, opts = {}) => {
  autoTable(doc, {
    ...baseTableOptions(logo, startY),
    theme: "grid",
    body: rows,
    styles: {
      fontSize: opts.fontSize || 9,
      cellPadding: { top: 2, right: 3.5, bottom: 2, left: 3.5 },
      lineColor: COLORS.border,
      lineWidth: 0.2,
      textColor: COLORS.ink,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: opts.labelWidth || 42, fontStyle: "bold", fontSize: (opts.fontSize || 9) - 0.5, textColor: COLORS.slate, fillColor: COLORS.bg },
      1: { cellWidth: CONTENT_WIDTH - (opts.labelWidth || 42) },
    },
  });
  return doc.lastAutoTable.finalY;
};

const renderSection = (doc, logo, title, rawRows, startY, titleExtra) => {
  if (!rawRows.some(([, raw]) => hasValue(raw))) return startY;
  const y0 = drawSectionTitle(doc, title, ensureSpace(doc, logo, startY, 20), titleExtra);
  const body = rawRows.map((row) => [row[0], formatValue(row[1], row[2])]);
  autoTable(doc, {
    ...baseTableOptions(logo, y0),
    theme: "grid",
    body,
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 2, right: 3.5, bottom: 2, left: 3.5 },
      lineColor: COLORS.border,
      lineWidth: 0.2,
      textColor: COLORS.ink,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 52, fontStyle: "bold", fontSize: 9, textColor: COLORS.slate, fillColor: COLORS.bg },
      1: { cellWidth: CONTENT_WIDTH - 52 },
    },
    didDrawCell: (data) => {
      if (data.column.index !== 1) return;
      const linkUrl = rawRows[data.row.index]?.[3];
      if (typeof linkUrl === "string" && linkUrl) {
        try {
          data.doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: linkUrl });
        } catch {
          // annotation only - never block PDF generation
        }
      }
    },
  });
  return doc.lastAutoTable.finalY + 6;
};

const renderFeatureChecklist = (doc, logo, r, startY) => {
  const features = [
    ["Admin Panel", Boolean(r.adminPanelRequired)],
    ["Payment Gateway", Boolean(r.paymentGatewayRequired)],
    ["Authentication", Boolean(r.authenticationRequired)],
    ["WhatsApp Integration", Boolean(r.whatsappIntegration)],
    ["Email Integration", Boolean(r.emailIntegration)],
    ["Hosting", Boolean(r.hostingRequired)],
    ["Domain", Boolean(r.domainRequired)],
    ["Maintenance", Boolean(r.maintenanceRequired)],
  ];

  const y0 = ensureSpace(doc, logo, startY, 58);
  autoTable(doc, {
    ...baseTableOptions(logo, y0),
    theme: "plain",
    body: features.map(([label, required]) => [`    ${label}`, required ? "Required" : "Not Required"]),
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 2, right: 4, bottom: 2, left: 2 },
      textColor: COLORS.ink,
      overflow: "linebreak",
    },
    columnStyles: { 0: { cellWidth: 93 }, 1: { cellWidth: 93 } },
    didParseCell: (data) => {
      if (data.column.index === 1) {
        data.cell.styles.textColor = data.cell.raw === "Required" ? COLORS.green : COLORS.muted;
        data.cell.styles.fontStyle = data.cell.raw === "Required" ? "bold" : "normal";
      }
    },
    didDrawCell: (data) => {
      if (data.column.index === 0) {
        const required = features[data.row.index]?.[1];
        const cx = data.cell.x + 3.5;
        const cy = data.cell.y + data.cell.height / 2;
        if (required) drawCheck(data.doc, cx, cy);
        else drawCross(data.doc, cx, cy);
      }
    },
  });
  return doc.lastAutoTable.finalY + 6;
};

const renderInternalNotes = (doc, logo, notes, startY) => {
  if (!hasValue(notes)) return startY;
  const y0 = drawSectionTitle(doc, "Internal Notes", ensureSpace(doc, logo, startY, 20), {
    accent: COLORS.amberText,
    bg: COLORS.amberBg,
    textColor: COLORS.amberText,
    rightLabel: "INTERNAL - NOT FOR CLIENT",
    rightColor: COLORS.amberText,
  });
  autoTable(doc, {
    ...baseTableOptions(logo, y0),
    theme: "grid",
    body: [[formatValue(notes)]],
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
      fillColor: [255, 251, 235],
      textColor: COLORS.amberText,
      lineColor: [245, 202, 135],
      lineWidth: 0.3,
      overflow: "linebreak",
      fontStyle: "italic",
    },
  });
  return doc.lastAutoTable.finalY + 6;
};

const clientRows = (r) => {
  const links = normalizeSocialLinks(r.socialMediaLinks);
  return [
    ["Business Name", r.businessName],
    ["Client Name", r.clientName],
    ["Mobile Number", r.mobileNumber],
    ["Email", r.email],
    ["Location", r.location],
    ["Existing Website", r.existingWebsite],
    ...(links.length
      ? links.map((s) => [s.label, s.url, null, s.url])
      : [["Social Media Links", ""]]),
  ];
};

const projectRows = (r) => [
  ["Project Type", r.projectType],
  ["Project Name", r.projectName],
  ["Business Description", r.businessDescription],
  ["Project Description", r.projectDescription],
  ["Project Objective", r.mainObjective],
  ["Target Audience", r.targetAudience],
  ["Total Number of Pages", r.numberOfPages],
  ["Total Number of Products", r.numberOfProducts],
  ["Client Budget", r.clientBudget, "money"],
  ["Estimated Development Cost", r.estimatedDevelopmentCost, "money"],
  ["Estimated Maintenance Cost", r.estimatedMaintenanceCost, "money"],
];

const featureTextRows = (r) => [
  ["Required Features", r.requiredFeatures],
];

const thirdPartyRows = (r) => {
  const v = String(r.thirdPartyIntegrations || "").trim();
  return v ? [["Integrations", v]] : [];
};

const technicalRows = (r) => [
  ["Preferred Technology Stack", r.preferredTechnology],
  ["Frontend", r.frontend],
  ["Backend", r.backend],
  ["Database", r.database],
  ["API Requirements", r.apiRequirements],
  ["Hosting / Deployment", r.hostingDeploymentRequirements],
  ["Other Technical Requirements", r.otherTechnicalRequirements],
];

const budgetRows = (r) => [
  ["Client Budget", r.clientBudget, "money"],
  ["Estimated Development Cost", r.estimatedDevelopmentCost, "money"],
  ["Estimated Maintenance Cost", r.estimatedMaintenanceCost, "money"],
  ["Expected Start Date", r.expectedStartDate, "date"],
  ["Expected Delivery Date", r.expectedDeliveryDate, "date"],
  ["Priority", r.priority, "title"],
];

const additionalRows = (r) => [
  ["Client Expectations", r.clientExpectations],
  ["Reference Websites", r.referenceWebsites],
  ["Competitor Websites", r.competitorWebsites],
  ["Design Preferences", r.designPreferences],
  ["Special Instructions", r.specialInstructions],
];

// ---------------------------------------------------------------------------
// Website Pages / Screens
// ---------------------------------------------------------------------------

const CONTENT_SOURCE_LABELS = {
  client_provides: "Client Provides",
  skyntrix_creates: "Skyntrix Creates",
  not_available: "Not Available Yet",
};

const pageValue = (raw) => (hasValue(raw) ? softWrap(String(raw).trim()) : "Not Provided");

const reqLabel = (v) => (v ? "Required" : "Not Required");

const dynamicDataText = (p) => {
  const dd = p.dynamicData || {};
  if (!dd.enabled) return "";
  const lines = ["Enabled: Yes"];
  if (dd.dataSource) lines.push(`Data Source: ${dd.dataSource}`);
  if (dd.apiRequired) lines.push("API Required: Yes");
  if (dd.apiDescription) lines.push(`API Description: ${dd.apiDescription}`);
  if (dd.databaseTable) lines.push(`Database: ${dd.databaseTable}`);
  if (Array.isArray(dd.crudOperations) && dd.crudOperations.length) lines.push(`CRUD: ${dd.crudOperations.map((c) => titleCase(c)).join(", ")}`);
  if (dd.adminManagement) lines.push("Admin Management: Yes");
  return lines.join("\n");
};

const designText = (p) => {
  const d = p.design || {};
  const lines = [];
  if (d.preference) lines.push(`Design Preference: ${d.preference}`);
  if (d.layout) lines.push(`Layout Preference: ${d.layout}`);
  if (d.colorPreference) lines.push(`Color Preference: ${d.colorPreference}`);
  if (d.typography) lines.push(`Typography: ${d.typography}`);
  if (d.referenceWebsite) lines.push(`Reference Website: ${d.referenceWebsite}`);
  if (d.referenceUrl) lines.push(`Reference URL: ${d.referenceUrl}`);
  if (d.animation && d.animation !== "none") lines.push(`Animation: ${titleCase(d.animation)}`);
  if (d.notes) lines.push(`Design Notes: ${d.notes}`);
  return lines.join("\n");
};

const contentText = (p) => {
  const c = p.content || {};
  const lines = [];
  if (c.source) lines.push(`Content Source: ${CONTENT_SOURCE_LABELS[c.source] || titleCase(c.source)}`);
  if (Array.isArray(c.types) && c.types.length) {
    lines.push("Content Types:");
    c.types.forEach((t) => lines.push(`   • ${t}`));
  }
  lines.push(`Images Required: ${c.imagesRequired ? "Yes" : "No"}`);
  lines.push(`Videos Required: ${c.videosRequired ? "Yes" : "No"}`);
  if (c.notes) lines.push(`Content Notes: ${c.notes}`);
  return lines.join("\n");
};

const seoText = (p) => {
  const s = p.seo || {};
  if (!s.enabled) return "";
  const lines = ["SEO Required: Yes"];
  if (s.metaTitle) lines.push(`Meta Title: ${s.metaTitle}`);
  if (s.metaDescription) lines.push(`Meta Description: ${s.metaDescription}`);
  if (s.keywords) lines.push(`Target Keywords: ${s.keywords}`);
  if (s.notes) lines.push(`Notes: ${s.notes}`);
  return lines.join("\n");
};

const responsiveText = (p) => {
  const resp = p.responsive || {};
  const lines = [
    `Desktop: ${reqLabel(resp.desktop !== false)}`,
    `Tablet: ${reqLabel(resp.tablet !== false)}`,
    `Mobile: ${reqLabel(resp.mobile !== false)}`,
  ];
  if (resp.notes) lines.push(`Responsive Notes: ${resp.notes}`);
  return lines.join("\n");
};

const drawPageHeading = (doc, page, index, y) => {
  const h = 9;
  doc.setFillColor(...COLORS.bg);
  doc.rect(MARGIN.left, y, CONTENT_WIDTH, h, "F");
  doc.setFillColor(...COLORS.brand);
  doc.roundedRect(MARGIN.left, y, 8, h, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(String(index + 1).padStart(2, "0"), MARGIN.left + 4, y + h / 2 + 1, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...COLORS.ink);
  doc.text(`${String(page.pageName || `Page ${index + 1}`).slice(0, 60).toUpperCase()}`, MARGIN.left + 10.5, y + h / 2 + 1);
  const meta = [page.pageType, page.priority && titleCase(page.priority), page.status && titleCase(page.status)].filter(Boolean).join(" · ");
  if (meta) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.slateLight);
    doc.text(meta, RIGHT - 5, y + h / 2 + 1, { align: "right" });
  }
  return y + h + 2.5;
};

const pageInfoRows = (page) => [
  ["URL / Slug", pageValue(page.slug)],
  ["Page Type", pageValue(page.pageType)],
  ["Priority", pageValue(page.priority ? titleCase(page.priority) : "")],
  ["Status", pageValue(page.status ? titleCase(page.status) : "")],
  ["Purpose", pageValue(page.purpose)],
];

const cleanLabel = (s) => String(s || "Custom").replace(/\s+/g, " ").trim();

const sectionsTableRows = (page) => {
  const list = Array.isArray(page.sections) ? page.sections : [];
  return list.map((s, i) => {
    const left = `${i + 1}. ${cleanLabel(s.sectionType)}${s.name ? ` — ${s.name}` : ""}`;
    const right = [
      s.description ? `Description: ${s.description}` : "",
      s.contentRequirements ? `Content Requirements: ${s.contentRequirements}` : "",
      `Images Required: ${s.imagesRequired ? "Yes" : "No"}`,
      `Videos Required: ${s.videosRequired ? "Yes" : "No"}`,
      `CTA Required: ${s.ctaRequired ? "Yes" : "No"}`,
      s.notes ? `Notes: ${s.notes}` : "",
    ].filter(Boolean);
    return [left, right.length ? right.join("\n") : "Not Provided"];
  });
};

const renderPageSections = (doc, logo, page, startY) => {
  const rows = sectionsTableRows(page);
  if (!rows.length) return startY;
  const y0 = drawSubLabel(doc, "Page Sections", startY);
  autoTable(doc, {
    ...baseTableOptions(logo, y0),
    theme: "grid",
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: { top: 2, right: 3.5, bottom: 2, left: 3.5 },
      lineColor: COLORS.border,
      lineWidth: 0.2,
      textColor: COLORS.ink,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 52, fontStyle: "bold", fontSize: 8.5, textColor: COLORS.slate, fillColor: COLORS.bg },
      1: { cellWidth: CONTENT_WIDTH - 52 },
    },
  });
  return doc.lastAutoTable.finalY + 4;
};

const renderPageFeaturesChecklist = (doc, logo, page, startY) => {
  const selected = normalizeFeatures(page.features);
  const items = PAGE_FEATURE_TOGGLES.map(([key, name]) => ({ name, on: Boolean(selected[key]) }));
  const customText = String(page.otherFeatures || "").trim();
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1]]);
  }
  if (customText) {
    rows.push([{ name: "Custom", on: true, custom: customText }, null]);
  }

  const rowH = 5.4;
  const y0 = ensureSpace(doc, logo, startY, rows.length * rowH + 8);
  const ySub = drawSubLabel(doc, "Page Features", y0);
  autoTable(doc, {
    ...baseTableOptions(logo, ySub),
    theme: "plain",
    body: rows.map(([a, b]) => [a, b]),
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 1.4, right: 3.5, bottom: 1.4, left: 6.5 },
      textColor: COLORS.ink,
      overflow: "linebreak",
      valign: "middle",
      minCellHeight: rowH,
    },
    columnStyles: { 0: { cellWidth: CONTENT_WIDTH / 2 }, 1: { cellWidth: CONTENT_WIDTH / 2 } },
    didParseCell: (data) => {
      const cellRow = rows[data.row.index];
      const item = data.column.index === 0 ? cellRow[0] : cellRow[1];
      if (!item) return;
      data.cell.text = [item.name === "Custom" && item.custom ? `Custom — ${softWrap(item.custom)}` : item.name];
      if (item.on) {
        data.cell.styles.textColor = COLORS.ink;
        data.cell.styles.fontStyle = "bold";
      } else {
        data.cell.styles.textColor = COLORS.slateLight;
        data.cell.styles.fontStyle = "normal";
      }
    },
    didDrawCell: (data) => {
      const cellRow = rows[data.row.index];
      const item = data.column.index === 0 ? cellRow[0] : cellRow[1];
      if (!item) return;
      const cx = data.cell.x + 3;
      const cy = data.cell.y + data.cell.height / 2;
      if (item.on) drawCheck(data.doc, cx, cy);
      else drawCross(data.doc, cx, cy);
    },
  });
  return doc.lastAutoTable.finalY + 4;
};

const pageRequirementsRows = (page) => {
  const dd = page.dynamicData || {};
  return [
    ["Dynamic Data / API", dd.enabled ? dynamicDataText(page) || "Enabled: Yes" : "Not Required"],
    ["Page Design", pageValue(designText(page))],
    ["Page Content", pageValue(contentText(page))],
    ["Page SEO", pageValue(seoText(page))],
    ["Page Responsive", responsiveText(page)],
  ];
};

const renderPageBlock = (doc, logo, page, index, startY) => {
  let y = ensureSpace(doc, logo, startY, 24);
  y = drawPageHeading(doc, page, index, y);
  y = renderLabelValueTable(doc, logo, pageInfoRows(page), y);
  if (Array.isArray(page.sections) && page.sections.length) {
    y = ensureSpace(doc, logo, y, 18);
    y = renderPageSections(doc, logo, page, y);
  }
  y = renderPageFeaturesChecklist(doc, logo, page, y + 2);
  y = renderLabelValueTable(doc, logo, pageRequirementsRows(page), y);
  return y + 4;
};

const renderWebsitePages = (doc, logo, r, startY) => {
  const pages = Array.isArray(r.pages) ? r.pages : [];
  if (!pages.length) return startY;

  let y = ensureSpace(doc, logo, startY, 18);
  y = drawSectionTitle(doc, "Website Pages / Screens", y, { rightLabel: `Total Pages: ${pages.length}` });
  for (let i = 0; i < pages.length; i += 1) {
    y = renderPageBlock(doc, logo, pages[i], i, y);
  }
  return y + 4;
};

/**
 * Builds a professionally formatted Project Requirement PDF and downloads it.
 * @param {object} requirement Complete requirement document from the API.
 * @returns {Promise<{ filename: string, pages: number }>}
 */
export async function generateRequirementPDF(requirement) {
  if (!requirement || !requirement._id) {
    throw new Error("Invalid requirement");
  }
  const r = requirement;
  const logo = await loadImageDataUrl(logoUrl);
  const generated = formatDateTime(new Date());

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  doc.setProperties({
    title: `Project Requirement Document - ${r.projectName || r.businessName || r._id}`,
    subject: "Project requirement specification",
    author: "SkynTrix Technologies",
    creator: "SkynTrix Technologies",
  });

  let y = drawTitleBlock(doc, r);
  y = renderSection(doc, logo, "Client Information", clientRows(r), y);
  y = renderSection(doc, logo, "Project Overview", projectRows(r), y);
  y = renderWebsitePages(doc, logo, r, y);
  y = renderSection(doc, logo, "Features & Functional Requirements", featureTextRows(r), y);
  y = renderFeatureChecklist(doc, logo, r, y);
  y = renderSection(doc, logo, "Third-party Integrations", thirdPartyRows(r), y);
  y = renderSection(doc, logo, "Technical Requirements", technicalRows(r), y);
  y = renderSection(doc, logo, "Budget & Timeline", budgetRows(r), y);
  y = renderSection(doc, logo, "Additional Requirements", additionalRows(r), y);
  y = renderInternalNotes(doc, logo, r.internalNotes, y);

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    drawPageFooter(doc, i, pages, generated);
  }

  const filename = buildFilename(r);
  doc.save(filename);
  return { filename, pages };
}
