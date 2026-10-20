import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import { env } from "../config/env.js";
import { nextSequence } from "../models/Counter.model.js";
import {
  normalizeMobileNumber,
  buildWaMeUrl,
  sendWhatsAppMessage,
  sendWhatsAppDocument,
  sendWhatsAppTemplate,
  isWhatsAppConfigured,
  isActiveConversation,
  markConversationOutbound,
  isPubliclyReachableUrl,
  SESSION_ENDED_ERROR,
} from "./whatsapp.service.js";
import logger from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const QUOTES_DIR = path.join(__dirname, "..", "uploads", "quotes");
export const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.png");

/** Static company details used across the PDF and WhatsApp message. */
export const COMPANY = {
  name: "Skyntrix Technologies",
  shortName: "Skyntrix",
  tagline: "Building Digital Experiences That Drive Growth",
  email: "skyntrixtechnologies@gmail.com",
  phone: "+91 8925393946",
  phone2: "+91 9790586747",
  website: env.whatsapp.website || "https://skyntrix.vercel.app/",
  address: "Madurai, Tamil Nadu, India",
  founder: "Senthil Kumar",
  founderTitle: "Founder",
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 45;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLORS = {
  ink: "#0B1120",
  primary: "#6D28D9",
  muted: "#6B7280",
  border: "#E5E7EB",
  light: "#F8FAFC",
  white: "#FFFFFF",
  softPurple: "#EDE9FE",
  label: "#9CA3AF",
};

export const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// Layout metrics (pt). Everything is derived from these so spacing stays
// consistent across sections and pages.
const SECTION_TITLE_HEIGHT = 30;
const SIGNATURE_HEIGHT = 100;
const SECTION_GAP = 10;

const QUOTATION_TERMS = [
  {
    heading: "1. Advance Payment",
    items: [
      { type: "para", text: "A 50% advance payment is required to initiate the project." },
    ],
  },
  {
    heading: "2. Project Review & Payment Process",
    items: [
      { type: "para", text: "After the initial development, a model/preview of the website will be shared with the client for review." },
      { type: "bullet", text: "If corrections or revisions are required within the agreed scope, the client shall pay the next 30% milestone payment, after which the requested corrections will be completed." },
      { type: "bullet", text: "Once the corrections are completed and the website is finalized, the remaining 20% final payment must be settled before the website is made live." },
      { type: "bullet", text: "If no corrections are required, the remaining 50% balance payment must be settled before the website is made live." },
    ],
  },
  {
    heading: "3. Project Commencement",
    items: [
      { type: "para", text: "Project development will begin only after confirmation and receipt of the advance payment." },
    ],
  },
  {
    heading: "4. Additional Requirements",
    items: [
      { type: "para", text: "Any additional features, functionalities, pages, or requirements outside the originally agreed project scope will be charged separately." },
    ],
  },
  {
    heading: "5. Third-Party Charges",
    items: [
      { type: "para", text: "Any third-party charges, including domain, hosting, payment gateway, SMS, email services, APIs, plugins, subscriptions, or other external services, will be borne by the client." },
    ],
  },
  {
    heading: "6. Client Responsibilities",
    items: [
      { type: "para", text: "The client is responsible for providing all required content, images, logos, product details, business information, and other project materials within the agreed timeline." },
    ],
  },
  {
    heading: "7. Content & Approval Delays",
    items: [
      { type: "para", text: "Any delay in providing required content, feedback, approvals, or confirmations from the client may affect the project delivery timeline." },
    ],
  },
  {
    heading: "8. Revisions",
    items: [
      { type: "para", text: "Minor revisions within the agreed project scope are included. Major design changes, new requirements, or revisions beyond the agreed scope may incur additional charges." },
    ],
  },
  {
    heading: "9. Cancellation & Refund Policy",
    items: [
      { type: "para", text: "Once project development has commenced, the 50% advance payment is non-refundable. If the client decides to discontinue the project after development has started, the advance payment will not be refunded. Any remaining amount paid by the client, after deducting the applicable charges for work completed up to the cancellation date, will be refunded. The completed project assets will be handed over after settlement of all applicable dues." },
    ],
  },
  {
    heading: "10. Final Delivery & Ownership",
    items: [
      { type: "para", text: "Final project files/source code and deployment will be provided only after full payment has been settled. Project ownership and handover will be completed upon receipt of the full project payment." },
    ],
  },
  {
    heading: "11. Optional Maintenance & Support",
    items: [
      { type: "para", text: "Maintenance and ongoing technical support are optional and are not included in the project development charges unless specifically mentioned in the quotation." },
      { type: "para", text: "If the client chooses a maintenance plan, it will be charged separately based on the selected plan and agreed services." },
      { type: "para", text: "Maintenance may include:" },
      { type: "bullet", text: "Website bug fixing and technical support" },
      { type: "bullet", text: "Minor content or text updates" },
      { type: "bullet", text: "Minor UI adjustments" },
      { type: "bullet", text: "Basic website monitoring" },
      { type: "bullet", text: "Deployment and hosting-related support" },
      { type: "para", text: "Major feature additions, new pages, redesigns, third-party integrations, or functionality changes are not included in maintenance and will be charged separately." },
      { type: "para", text: "If the client does not opt for a maintenance plan, any future updates, bug fixes, technical support, or modifications after project handover may be charged separately based on the work required." },
    ],
  },
];

/**
 * Auto-generate a unique quotation number, e.g. SKT-2026-0001.
 * Uses an atomic counter so concurrent requests can never collide, and the
 * unique index on quotationNumber is the final safety net.
 */
export const generateQuotationNumber = async () => {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const seq = await nextSequence(`quotation-${year}`);
    const number = `SKT-${year}-${String(seq).padStart(4, "0")}`;
    // Guard against a stale/duplicate sequence (belt & braces).
    const exists = await import("../models/Quotation.model.js").then((m) => m.default.exists({ quotationNumber: number }));
    if (!exists) return number;
    logger.warn(`[Quotation] number collision on ${number}, retrying...`);
  }
  throw new Error("Could not generate a unique quotation number");
};

/**
 * Personalized WhatsApp text message that is sent BEFORE the quotation PDF.
 * Uses code-point escapes (`\u20B9` = ₹, `\u2014` = —) so the source stays
 * ASCII-only and can never be corrupted by a non-UTF-8 read/write round-trip.
 *
 * When `includePdfLink` is set, the PDF link is appended ONLY if it is publicly
 * reachable - a localhost/private URL is never sent to a client.
 */
export const buildQuotationMessage = (quotation, { includePdfLink = false } = {}) => {
  const name = (quotation.clientName || "").trim() || "there";
  const total = Number(quotation.totalAmount || 0).toLocaleString("en-IN");
  const project = (quotation.projectName || "").trim() || "\u2014";
  const lines = [
    `Hello ${name},`,
    "",
    "Thank you for choosing Skyntrix Technologies.",
    "",
    "Please find your quotation attached.",
    "",
    `Quotation No: ${quotation.quotationNumber || "\u2014"}`,
    `Project: ${project}`,
    `Total Amount: \u20B9${total}`,
  ];
  if (includePdfLink && isPubliclyReachableUrl(quotation.pdfUrl)) {
    lines.push("", `Download PDF: ${quotation.pdfUrl}`);
  }
  lines.push(
    "",
    "If you have any questions or would like any changes, feel free to contact us.",
    "",
    "Regards,",
    "Senthil Kumar",
    "Founder",
    "Skyntrix Technologies"
  );
  return lines.join("\n");
};

/**
 * Short caption shown under the quotation PDF preview in the WhatsApp chat.
 * The full greeting/details live in the separate text message, so this stays
 * compact while still identifying the quotation on the document itself.
 */
export const buildQuotationDocumentCaption = (quotation) => {
  const total = Number(quotation.totalAmount || 0).toLocaleString("en-IN");
  const project = (quotation.projectName || "").trim() || "\u2014";
  return [
    "Please find your quotation attached.",
    "",
    `Quotation No: ${quotation.quotationNumber || "\u2014"}`,
    `Project: ${project}`,
    `Total Amount: \u20B9${total}`,
  ].join("\n");
};

// ---------------------------------------------------------------------------
// PDF helpers
// ---------------------------------------------------------------------------

/**
 * Page-break helper. Everything is drawn with explicit coordinates, so before a
 * section we check whether it fits within the content area (below the header,
 * above the footer band) and force a clean page break if it does not.
 */
const ensureSpace = (doc, height) => {
  if (doc.y + height > doc.page.maxY()) {
    doc.addPage();
  }
};

const drawSectionTitle = (doc, title) => {
  ensureSpace(doc, SECTION_TITLE_HEIGHT);
  const y = doc.y;
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(COLORS.ink).text(title.toUpperCase(), MARGIN, y, { width: CONTENT_WIDTH });
  doc.rect(MARGIN, y + 13, 26, 2.5).fillColor(COLORS.primary).fill();
  doc.moveTo(MARGIN, y + 19.5).lineTo(PAGE_WIDTH - MARGIN, y + 19.5).lineWidth(0.7).strokeColor(COLORS.border).stroke();
  doc.y = y + SECTION_TITLE_HEIGHT;
};

const drawHeader = (doc, quotation) => {
  doc.rect(0, 0, PAGE_WIDTH, 116).fillColor(COLORS.ink).fill();
  doc.rect(0, 116, PAGE_WIDTH, 4).fillColor(COLORS.primary).fill();

  try {
    if (fs.existsSync(LOGO_PATH)) {
      doc.image(LOGO_PATH, MARGIN, 30, { width: 54, height: 54 });
    }
  } catch (err) {
    logger.warn(`[Quotation] logo render skipped: ${err.message}`);
  }

  doc.font("Helvetica-Bold").fontSize(17).fillColor(COLORS.white).text(COMPANY.name, 118, 34, { width: 240 });
  doc.font("Helvetica").fontSize(8.5).fillColor("#C4B5FD").text(COMPANY.tagline, 118, 58, { width: 240 });

  doc.font("Helvetica-Bold").fontSize(15).fillColor(COLORS.white).text("QUOTATION", 340, 30, { width: 210, align: "right" });
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#E9D5FF").text(`No: ${quotation.quotationNumber}`, 340, 56, { width: 210, align: "right" });
  doc.font("Helvetica").fontSize(8.5).fillColor("#A5B4FC").text(`Date: ${formatDate(quotation.createdAt || new Date())}`, 340, 72, { width: 210, align: "right" });
};

/** Format an E.164 Indian mobile number as "+91 XXXXX XXXXX" for display. */
const formatMobileDisplay = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return String(value || "—");
};

/**
 * Compact two-column information card: Client Details on the left, Project
 * Details on the right, inside a single bordered card. Replaces the previous
 * separate full-width client/project blocks so the page reads as one balanced,
 * premium unit with no wasted space.
 */
const drawInfoCard = (doc, quotation) => {
  const titleH = 28;
  const rowH = 16;
  const rowCount = 4;
  const padY = 12;
  const cardH = titleH + rowCount * rowH + padY;
  ensureSpace(doc, cardH + SECTION_GAP);
  const y = doc.y;
  const colGap = 14;
  const colW = (CONTENT_WIDTH - colGap) / 2;
  const leftX = MARGIN + 14;
  const rightX = MARGIN + colW + colGap + 14;
  const labelW = 62;
  const valueW = colW - labelW - 14;

  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, cardH, 6).fillColor(COLORS.light).fill();
  doc.roundedRect(MARGIN, y, CONTENT_WIDTH, cardH, 6).lineWidth(0.8).strokeColor(COLORS.border).stroke();

  doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.primary);
  doc.text("CLIENT DETAILS", leftX, y + 10);
  doc.text("PROJECT DETAILS", rightX, y + 10);

  const rows = [
    [["NAME", quotation.clientName], ["PROJECT", quotation.projectName]],
    [["BUSINESS", quotation.businessName], ["TIMELINE", quotation.projectTimeline]],
    [["MOBILE", formatMobileDisplay(quotation.mobile)], ["PAYMENT TERMS", quotation.paymentTerms]],
    [["EMAIL", quotation.email], ["ADVANCE", quotation.advanceAmount ? formatMoney(quotation.advanceAmount) : "—"]],
  ];

  rows.forEach((pair, i) => {
    const ry = y + titleH + i * rowH;
    pair.forEach(([label, value], col) => {
      const x = col === 0 ? leftX : rightX;
      doc.font("Helvetica-Bold").fontSize(7).fillColor(COLORS.label).text(label, x, ry, { width: labelW, lineBreak: false });
      doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.ink).text(String(value || "—"), x + labelW, ry, { width: valueW, lineBreak: false, ellipsis: true });
    });
  });

  doc.y = y + cardH + SECTION_GAP;
};

const drawScope = (doc, quotation) => {
  const desc = (quotation.projectDescription || "No additional description provided.").trim();
  const descH = doc.font("Helvetica").fontSize(9).heightOfString(desc, { width: CONTENT_WIDTH });
  const nameH = 15;
  ensureSpace(doc, SECTION_TITLE_HEIGHT + nameH + descH + SECTION_GAP);
  drawSectionTitle(doc, "Project Scope");
  const y0 = doc.y;
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.ink).text(quotation.projectName, MARGIN, y0, { width: CONTENT_WIDTH });
  doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted).text(desc, MARGIN, y0 + 15, { width: CONTENT_WIDTH, lineGap: 2 });
  doc.y = y0 + 15 + descH + SECTION_GAP;
};

const drawTableHeader = (doc, widths, y) => {
  const rowStart = MARGIN;
  doc.rect(rowStart, y, CONTENT_WIDTH, 20).fillColor(COLORS.ink).fill();
  doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.white);
  doc.text("#", rowStart + 8, y + 6, { width: 20 });
  doc.text("SERVICE", rowStart + widths[0] + 6, y + 6, { width: widths[1] - 12 });
  doc.text("DESCRIPTION", rowStart + widths[0] + widths[1] + 6, y + 6, { width: widths[2] - 12 });
  doc.text("AMOUNT", rowStart + widths[0] + widths[1] + widths[2] + 6, y + 6, { width: widths[3] - 12, align: "right" });
};

const drawCostTable = (doc, quotation) => {
  const widths = [30, 155, 220, 100];
  const rowStart = MARGIN;
  const services = (quotation.services || []).filter((s) => s && s.name);
  const cellHeight = (desc) => Math.max(22, doc.font("Helvetica").fontSize(8).heightOfString(desc, { width: widths[2] - 12 }) + 12);
  const rowHeights = services.length ? services.map((s) => cellHeight((s.description || "").trim() || "—")) : [22];
  const tableH = SECTION_TITLE_HEIGHT + 20 + rowHeights.reduce((a, b) => a + b, 0) + 26 + 6;
  // If the whole table cannot fit on the current page, move the title with it.
  ensureSpace(doc, tableH);
  drawSectionTitle(doc, "Service Cost Breakdown");

  let headerY = doc.y;
  drawTableHeader(doc, widths, headerY);

  let cy = headerY + 20;
  if (!services.length) {
    doc.rect(rowStart, cy, CONTENT_WIDTH, 22).fillColor(COLORS.white).fill();
    doc.rect(rowStart, cy, CONTENT_WIDTH, 22).lineWidth(0.6).strokeColor(COLORS.border).stroke();
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.muted).text("No line items listed", rowStart + widths[0] + 6, cy + 7, { width: CONTENT_WIDTH - 40 });
    cy += 22;
  } else {
    services.forEach((service, i) => {
      const desc = (service.description || "").trim() || "—";
      const cellH = cellHeight(desc);
      if (cy + cellH > doc.page.maxY()) {
        doc.addPage();
        headerY = doc.y;
        drawTableHeader(doc, widths, headerY);
        cy = headerY + 20;
      }
      doc.rect(rowStart, cy, CONTENT_WIDTH, cellH)
        .fillColor(i % 2 === 0 ? COLORS.light : COLORS.white).fill();
      doc.rect(rowStart, cy, CONTENT_WIDTH, cellH).lineWidth(0.6).strokeColor(COLORS.border).stroke();
      doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.muted).text(String(i + 1), rowStart + 8, cy + 5, { width: 20 });
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.ink).text(service.name, rowStart + widths[0] + 6, cy + 5, { width: widths[1] - 12 });
      doc.font("Helvetica").fontSize(8).fillColor(COLORS.muted).text(desc, rowStart + widths[0] + widths[1] + 6, cy + 5, { width: widths[2] - 12, lineGap: 1 });
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.ink).text(formatMoney(service.amount), rowStart + widths[0] + widths[1] + widths[2] + 6, cy + 5, { width: widths[3] - 12, align: "right" });
      cy += cellH;
    });
  }

  const total = services.length ? services.reduce((a, s) => a + (Number(s.amount) || 0), 0) : Number(quotation.totalAmount) || 0;
  if (cy + 26 > doc.page.maxY()) {
    doc.addPage();
    headerY = doc.y;
    drawTableHeader(doc, widths, headerY);
    cy = headerY + 20;
  }
  doc.rect(rowStart, cy, CONTENT_WIDTH, 26).fillColor(COLORS.softPurple).fill();
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.ink).text("GRAND TOTAL", rowStart + 12, cy + 7, { width: 200 });
  doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.primary).text(formatMoney(total), rowStart + CONTENT_WIDTH - 200, cy + 5, { width: 188, align: "right" });

  doc.y = cy + 26 + SECTION_GAP;
};

const drawPaymentBoxes = (doc, quotation) => {
  const boxH = 62;
  ensureSpace(doc, SECTION_TITLE_HEIGHT + boxH + SECTION_GAP);
  drawSectionTitle(doc, "Payment & Delivery");
  const y0 = doc.y;
  const boxW = (CONTENT_WIDTH - 24) / 3;
  const boxes = [
    ["Project Timeline", quotation.projectTimeline || "—"],
    ["Advance Amount", quotation.advanceAmount ? formatMoney(quotation.advanceAmount) : "—"],
    ["Payment Terms", quotation.paymentTerms || "—"],
  ];
  boxes.forEach(([title, value], i) => {
    const x = MARGIN + i * (boxW + 12);
    doc.roundedRect(x, y0, boxW, boxH, 6).fillColor(COLORS.light).fill();
    doc.roundedRect(x, y0, boxW, boxH, 6).lineWidth(0.8).strokeColor(COLORS.border).stroke();
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(COLORS.primary).text(title.toUpperCase(), x + 10, y0 + 8, { width: boxW - 20 });
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.ink).text(value, x + 10, y0 + 24, { width: boxW - 20, lineGap: 1 });
  });
  doc.y = y0 + boxH + SECTION_GAP;
};

const TERM_HEADING_FONT = 8.5;
const TERM_BODY_FONT = 8.5;
const TERM_BULLET_FONT = 8;
const TERM_BODY_INDENT = 16;
const TERM_BULLET_INDENT = 30;
const TERM_GAP = 6;

/**
 * Render a block of Terms & Conditions text, breaking cleanly across pages.
 * Each term is a { heading, items } object; items are paragraphs or bullet
 * points. A heading is never orphaned at the bottom of a page.
 */
const drawTermItem = (doc, item) => {
  if (item.type === "bullet") {
    const width = CONTENT_WIDTH - TERM_BULLET_INDENT;
    const itemH = doc.font("Helvetica").fontSize(TERM_BULLET_FONT).heightOfString(item.text, { width });
    ensureSpace(doc, itemH + 2);
    const y = doc.y;
    doc.font("Helvetica").fontSize(TERM_BULLET_FONT).fillColor(COLORS.primary).text("\u2022", MARGIN + TERM_BODY_INDENT, y, { width: 10, lineBreak: false });
    doc.font("Helvetica").fontSize(TERM_BULLET_FONT).fillColor(COLORS.muted).text(item.text, MARGIN + TERM_BULLET_INDENT, y, { width, lineGap: 1 });
    doc.y = y + itemH + 2;
    return;
  }
  const itemH = doc.font("Helvetica").fontSize(TERM_BODY_FONT).heightOfString(item.text, { width: CONTENT_WIDTH });
  ensureSpace(doc, itemH + 2);
  const y = doc.y;
  doc.font("Helvetica").fontSize(TERM_BODY_FONT).fillColor(COLORS.muted).text(item.text, MARGIN, y, { width: CONTENT_WIDTH, lineGap: 1 });
  doc.y = y + itemH + 2;
};

const drawTerms = (doc, quotation) => {
  drawSectionTitle(doc, "Terms & Conditions");
  QUOTATION_TERMS.forEach((term) => {
    const headingH = doc.font("Helvetica-Bold").fontSize(TERM_HEADING_FONT).heightOfString(term.heading, { width: CONTENT_WIDTH });
    ensureSpace(doc, headingH + 3);
    const hy = doc.y;
    doc.font("Helvetica-Bold").fontSize(TERM_HEADING_FONT).fillColor(COLORS.primary).text(term.heading, MARGIN, hy, { width: CONTENT_WIDTH });
    doc.y = hy + headingH + 3;
    term.items.forEach((item) => drawTermItem(doc, item));
    doc.y += TERM_GAP;
  });
  if (quotation.additionalNotes) {
    const notesH = doc.font("Helvetica").fontSize(8.5).heightOfString(quotation.additionalNotes, { width: CONTENT_WIDTH });
    doc.y += 4;
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.ink).text("Additional Notes", MARGIN, y);
    doc.font("Helvetica").fontSize(8.5).fillColor(COLORS.muted).text(quotation.additionalNotes, MARGIN, y + 12, { width: CONTENT_WIDTH, lineGap: 1 });
    doc.y = y + notesH + 16;
  }
};

/**
 * Two-column quotation approval section: company details on the left, a client
 * approval block on the right. Styled to match the existing payment boxes
 * (light fill, thin border, rounded corners) with a vertical divider down the
 * middle.
 */
const drawSignature = (doc) => {
  const y = doc.y;
  const boxX = MARGIN;
  const boxW = CONTENT_WIDTH;
  const boxH = SIGNATURE_HEIGHT;
  const pad = 16;
  const dividerX = boxX + boxW / 2;

  doc.roundedRect(boxX, y, boxW, boxH, 6).fillColor(COLORS.light).fill();
  doc.roundedRect(boxX, y, boxW, boxH, 6).lineWidth(0.8).strokeColor(COLORS.border).stroke();
  doc.moveTo(dividerX, y).lineTo(dividerX, y + boxH).lineWidth(0.8).strokeColor(COLORS.border).stroke();

  // LEFT — COMPANY DETAILS
  const lx = boxX + pad;
  doc.font("Helvetica-Bold").fontSize(9).fillColor(COLORS.ink).text(COMPANY.name.toUpperCase(), lx, y + pad, { lineBreak: false });
  doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted).text(COMPANY.tagline, lx, y + pad + 15, { lineBreak: false });
  doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted).text(COMPANY.email, lx, y + pad + 42, { lineBreak: false });
  doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted).text("skyntrix.vercel.app", lx, y + pad + 54, { lineBreak: false });
  doc.font("Helvetica").fontSize(7.5).fillColor(COLORS.muted).text("+91 97905 86747 | +91 89253 93946", lx, y + pad + 66, { lineBreak: false });

  // RIGHT — CLIENT APPROVAL
  const rx = dividerX + pad;
  doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLORS.primary).text("CLIENT APPROVAL", rx, y + pad, { lineBreak: false });
  doc.font("Helvetica").fontSize(8).fillColor(COLORS.ink).text("Name: ______________________", rx, y + pad + 26, { lineBreak: false });
  doc.font("Helvetica").fontSize(8).fillColor(COLORS.ink).text("Signature: __________________", rx, y + pad + 48, { lineBreak: false });
  doc.font("Helvetica").fontSize(8).fillColor(COLORS.ink).text("Date: _______________________", rx, y + pad + 70, { lineBreak: false });

  doc.y = y + boxH + 6;
};

/**
 * Bottom footer band. Drawn once per page AFTER all content is laid out so the
 * total page count is known and "Page X of Y" can be rendered. Uses fixed
 * coordinates so the footer always sits at the bottom of the page.
 */
const drawFooter = (doc, pageIndex, totalPages) => {
  const y = PAGE_HEIGHT - 52;
  doc.rect(0, y - 12, PAGE_WIDTH, 46).fillColor("#111827").fill();
  doc.rect(0, y - 12, PAGE_WIDTH, 3).fillColor(COLORS.primary).fill();
  // lineBreak:false AND no width -> bypasses the LineWrapper entirely. A width
  // (or width auto-set) forces text through LineWrapper, whose auto page-break
  // check sees the footer below the bottom margin and adds a page, recursing.
  doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#E5E7EB").text(COMPANY.name, MARGIN, y, { lineBreak: false });
  doc.font("Helvetica").fontSize(7.5).fillColor("#9CA3AF").text(COMPANY.address, MARGIN, y + 11, { lineBreak: false });
  doc.font("Helvetica").fontSize(7.5).fillColor("#D1D5DB").text(`${COMPANY.website}  |  ${COMPANY.email}  |  ${COMPANY.phone}`, MARGIN, y + 22, { lineBreak: false });
  const pageLabel = `Page ${pageIndex} of ${totalPages}`;
  doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#9CA3AF").text(pageLabel, PAGE_WIDTH - MARGIN - doc.widthOfString(pageLabel), y + 22, { lineBreak: false });
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a branded A4 PDF quotation and write it to uploads/quotes.
 *
 * The WhatsApp document is sent via the Cloud API Media Upload (no public URL
 * needed). `url` is the origin-based URL used for the admin's PDF preview and
 * the wa.me fallback link - it is only embedded in a client message when it is
 * publicly reachable (production domain or a dev tunnel).
 *
 * @returns {{ path: string, url: string, filename: string }}
 */
export const generateQuotationPdf = async (quotation) => {
  fs.mkdirSync(QUOTES_DIR, { recursive: true });
  const filename = `${quotation.quotationNumber}.pdf`;
  const filePath = path.join(QUOTES_DIR, filename);
  const fileUrl = `${String(env.uploadUrl).replace(/\/+$/, "")}/uploads/quotes/${filename}`;

  // Write to a temp file in the same directory, then atomically rename it over
  // the target. A PDF viewer holding the old file open (Windows) can never
  // observe a truncated or partially-written PDF, and a failed regeneration
  // leaves the previously generated file untouched instead of corrupting it.
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    await new Promise((resolve, reject) => {
      // bufferPages keeps every page buffered until doc.end() so the footer can
      // be redrawn on all pages with the correct "Page X of Y" numbering.
      const doc = new PDFDocument({ size: "A4", margin: { top: 40, left: MARGIN, right: MARGIN, bottom: 90 }, bufferPages: true });
      const stream = fs.createWriteStream(tmpPath);

      stream.on("finish", resolve);
      stream.on("error", reject);
      doc.on("error", reject);

      doc.pipe(stream);
      drawHeader(doc, quotation);
      doc.y = 148;

      drawInfoCard(doc, quotation);
      drawScope(doc, quotation);
      drawCostTable(doc, quotation);
      drawPaymentBoxes(doc, quotation);

      drawTerms(doc, quotation);
      ensureSpace(doc, SIGNATURE_HEIGHT);
      drawSignature(doc);

      // Footers are drawn after all content is laid out so the total page count
      // is known and "Page X of Y" can be rendered on every page. The footer is
      // always positioned at the bottom via fixed coordinates.
      const { count: totalPages } = doc.bufferedPageRange();
      for (let i = 0; i < totalPages; i += 1) {
        doc.switchToPage(i);
        drawFooter(doc, i + 1, totalPages);
      }
      doc.switchToPage(totalPages - 1);

      doc.end();
    });

    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch (_) {}
    throw err;
  }

  logger.info(`[Quotation] PDF generated: ${filePath}`);
  return { path: filePath, url: fileUrl, filename };
};

/**
 * Make sure a current PDF exists for the quotation, optionally forcing a
 * regeneration from the latest data. Persists the refreshed pdfUrl/pdfPath so
 * downloads, previews and WhatsApp sends always reflect the current state.
 */
export const ensureQuotationPdf = async (quotation, { force = false } = {}) => {
  if (!force && quotation.pdfPath && fs.existsSync(quotation.pdfPath)) {
    return quotation;
  }
  const pdf = await generateQuotationPdf(quotation);
  quotation.pdfUrl = pdf.url;
  quotation.pdfPath = pdf.path;
  await quotation.save();
  return quotation;
};

/** Remove the quotation PDF file from disk (best effort). */
export const deleteQuotationPdf = (pdfPath) => {
  if (!pdfPath) return;
  try {
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
  } catch (err) {
    logger.warn(`[Quotation] could not delete PDF ${pdfPath}: ${err.message}`);
  }
};

/**
 * Body parameters for the pre-approved quotation template. The template body
 * must define exactly: {{1}} client name, {{2}} quotation no, {{3}} project,
 * {{4}} total amount. Uses code-point escapes so the source stays ASCII-only.
 */
export const buildQuotationTemplateParams = (quotation) => {
  const total = Number(quotation.totalAmount || 0).toLocaleString("en-IN");
  return [
    (quotation.clientName || "").trim() || "there",
    quotation.quotationNumber || "-",
    (quotation.projectName || "").trim() || "-",
    `\u20B9${total}`,
  ];
};

/**
 * Send the quotation PDF followed by the personalized text message. Used both
 * for the active-session path and by the webhook once the customer replies.
 * The document is uploaded and sent BEFORE the text so a client never receives
 * a "quotation attached" message when the PDF failed to attach. The text
 * message never contains a localhost URL.
 *
 * @returns {Promise<{status, textMessageId?, documentMessageId?, error?, errorCode?}>}
 */
export const sendQuotationFollowUp = async (quotation) => {
  const digits = normalizeMobileNumber(quotation.mobile);
  if (!digits) {
    return { status: "failed", textMessageId: "", documentMessageId: "", error: "Invalid mobile number", errorCode: 0 };
  }
  if (!isWhatsAppConfigured()) {
    const waUrl = buildWaMeUrl(digits, buildQuotationMessage(quotation, { includePdfLink: true }));
    return { status: "fallback", textMessageId: "", documentMessageId: "", waUrl, error: "", errorCode: 0 };
  }

  // 1) PDF document attachment FIRST (Media Upload API - no public URL
  // required). The quotation is only marked sent when this succeeds.
  const doc = await sendWhatsAppDocument({
    to: digits,
    filePath: quotation.pdfPath || "",
    link: isPubliclyReachableUrl(quotation.pdfUrl) ? quotation.pdfUrl : "",
    caption: buildQuotationDocumentCaption(quotation),
    filename: `Quotation - ${quotation.quotationNumber}.pdf`,
  });

  if (doc.status !== "success") {
    const error = doc.error || "WhatsApp PDF document send failed";
    logger.error(`[Quotation] document send failed for ${digits}: ${error}`);
    return { status: "failed", textMessageId: "", documentMessageId: "", error, errorCode: doc.errorCode || 0 };
  }

  // 2) Personalized text message.
  const text = await sendWhatsAppMessage({
    to: digits,
    body: buildQuotationMessage(quotation, { includePdfLink: false }),
  });
  if (text.status === "failed") {
    logger.error(`[Quotation] text message failed for ${digits}: ${text.error}`);
    return { status: "failed", textMessageId: "", documentMessageId: doc.providerMessageId || "", error: text.error || "WhatsApp text message failed", errorCode: text.errorCode || 0 };
  }

  logger.info(`[Quotation] document + text sent to ${digits}`);
  return {
    status: "success",
    textMessageId: text.providerMessageId || "",
    documentMessageId: doc.providerMessageId || "",
    error: "",
    errorCode: 0,
  };
};

/**
 * Send a quotation to the client's WhatsApp number, fully automated:
 *
 *   A) 24-hour customer service window OPEN -> free-form PDF DOCUMENT
 *      attachment (Media Upload API, no public URL needed) followed by the
 *      TEXT message.
 *   B) 24-hour window CLOSED (no active conversation) -> send a pre-approved
 *      MESSAGE TEMPLATE to initiate the conversation, set awaitingReply, and
 *      the webhook automatically delivers the PDF + personalized message once
 *      the customer replies.
 *
 * Session status is detected automatically from the webhook-tracked
 * conversation; when there is no record yet, the system attempts the free-form
 * send and falls back to the template on Meta error 131026 (no open window).
 * No admin intervention is required.
 *
 * @returns {Promise<{status, textMessageId?, documentMessageId?, templateMessageId?, waUrl?, error?, errorCode?}>}
 */
export const sendQuotationWhatsApp = async (quotation) => {
  const digits = normalizeMobileNumber(quotation.mobile);
  if (!digits) {
    return { status: "failed", textMessageId: "", documentMessageId: "", templateMessageId: "", error: "Invalid mobile number", errorCode: 0 };
  }

  if (!isWhatsAppConfigured()) {
    const waUrl = buildWaMeUrl(digits, buildQuotationMessage(quotation, { includePdfLink: true }));
    logger.info(`[Quotation] Cloud API unavailable - fallback link for ${digits}`);
    return { status: "fallback", textMessageId: "", documentMessageId: "", templateMessageId: "", waUrl, error: "", errorCode: 0 };
  }

  // Fast path: we know the session is open (customer messaged within 24h).
  if (await isActiveConversation(digits)) {
    logger.info(`[Quotation] active session for ${digits} - sending free-form PDF + text`);
    const followUp = await sendQuotationFollowUp(quotation);
    return { ...followUp, templateMessageId: "" };
  }

  // Unknown / closed session: try free-form, fall back to a template on 131026.
  const followUp = await sendQuotationFollowUp(quotation);
  if (followUp.status === "success") {
    return { ...followUp, templateMessageId: "" };
  }

  if (followUp.errorCode === SESSION_ENDED_ERROR) {
    logger.info(`[Quotation] no open session for ${digits} - initiating via template`);
    const template = await sendWhatsAppTemplate({
      to: digits,
      templateName: env.whatsapp.quotationTemplateName,
      language: env.whatsapp.quotationTemplateLang,
      bodyParams: buildQuotationTemplateParams(quotation),
    });

    if (template.status === "success") {
      await markConversationOutbound(digits, template.providerMessageId);
      return {
        status: "template",
        textMessageId: "",
        documentMessageId: "",
        templateMessageId: template.providerMessageId || "",
        error: "",
        errorCode: 0,
      };
    }

    logger.error(`[Quotation] template initiation failed for ${digits}: ${template.error}`);
    return {
      status: "failed",
      textMessageId: "",
      documentMessageId: "",
      templateMessageId: "",
      error: template.error || "WhatsApp template send failed",
      errorCode: template.errorCode || 0,
    };
  }

  // A genuine failure (invalid number, media upload, network, etc.).
  return { ...followUp, templateMessageId: "" };
};
