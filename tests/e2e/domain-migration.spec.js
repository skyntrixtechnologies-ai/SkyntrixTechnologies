// Domain-migration regression suite.
//
// Proves, through the REAL admin UI (login -> create -> Download PDF button
// -> actual GET /:id/download route -> actual PDF generator), that every
// newly generated quotation/invoice/receipt PDF shows the canonical domain
// and never the retired Vercel URL - and specifically exercises the stale
// on-disk-file caching bug that let the old domain survive the first domain
// fix (see tests/e2e/README.md for the full root-cause writeup).
//
// This suite never sends a real WhatsApp message, email, or payment: it only
// uses "Save Draft", "Download PDF", "Mark Paid" and "Generate Receipt",
// all of which are local/no-external-side-effect actions. All records it
// creates are clearly labelled Playwright QA fixtures.
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { extractPdfPagesText, extractLinkAnnotations } = require("./utils/pdf");

const OLD_DOMAIN = "skyntrix.vercel.app";
const CANONICAL_DOMAIN = "www.skyntrixtechnologies.in";
const CANONICAL_URL = `https://${CANONICAL_DOMAIN}/`;

// Credentials come from the server's own seed script / env, never hardcoded
// here and never printed - see server/utils/seed.js and server/.env.
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@skyntrix.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

// Where this app actually writes generated PDFs (server/services/*.service.js).
const SERVER_ROOT = path.resolve(__dirname, "..", "..", "server");
const QUOTES_DIR = path.join(SERVER_ROOT, "uploads", "quotes");
const INVOICES_DIR = path.join(SERVER_ROOT, "uploads", "invoices");
const RECEIPTS_DIR = path.join(SERVER_ROOT, "uploads", "receipts");

const DOWNLOAD_DIR = path.join(__dirname, ".output", "downloads");
fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

const RUN_TAG = `PWQA-${Date.now()}`;

async function login(page) {
  await page.goto("/admin/login");
  await page.getByPlaceholder("admin@skyntrix.com").fill(ADMIN_EMAIL);
  await page.getByPlaceholder("••••••••").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /Sign in/i }).click();
  await page.waitForURL(/\/admin\/dashboard/);
}

/** Download via the real "Download PDF" button and save the file locally. */
async function clickDownload(page, outName) {
  const downloadBtn = page.locator("button", { hasText: "Download PDF" }).first();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    downloadBtn.click(),
  ]);
  const outPath = path.join(DOWNLOAD_DIR, outName);
  await download.saveAs(outPath);
  return outPath;
}

/**
 * Assert a downloaded PDF is clean: every page inspected, old domain absent
 * everywhere, canonical domain present somewhere, and the document identifier
 * is actually in the text (proves we parsed the real document, not a blank).
 */
function assertDomainClean(pages, identifier, label) {
  expect(pages.length, `${label}: PDF must have at least one page`).toBeGreaterThan(0);

  pages.forEach((pageText, i) => {
    expect(pageText.toLowerCase(), `${label}: page ${i + 1} must not contain the old Vercel domain`)
      .not.toContain(OLD_DOMAIN.toLowerCase());
  });

  const fullText = pages.join("\n");
  expect(fullText, `${label}: document identifier must appear in the extracted text`).toContain(identifier);
  expect(fullText, `${label}: canonical domain must appear somewhere in the document`)
    .toContain(CANONICAL_DOMAIN);
}

/** Report (not fail-on-absence) the hyperlink annotations found in a PDF. */
function reportLinkAnnotations(pdfPath, label) {
  const annots = extractLinkAnnotations(pdfPath);
  if (annots.length === 0) {
    console.log(`[${label}] No Link annotations found in this PDF (website shown as plain text only).`);
    return annots;
  }
  annots.forEach((a, i) => {
    expect(a.uri, `${label}: link annotation #${i} must target the canonical URL exactly`).toBe(CANONICAL_URL);
  });
  console.log(`[${label}] ${annots.length} link annotation(s) found, all targeting ${CANONICAL_URL}`);
  return annots;
}

/**
 * Simulate the exact real-world condition that caused the bug: a record
 * whose PDF was already generated and cached on disk BEFORE a config change
 * (e.g. the domain migration). We don't fabricate this through the UI
 * because the UI has no way to "time travel" a file's age - we write the
 * fixture file directly, exactly mirroring what already existed on disk for
 * every historical record (SKT-2026-0002, 0005, 0010, ... all had this).
 */
async function simulateStaleCachedFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    stream.on("finish", resolve);
    stream.on("error", reject);
    doc.pipe(stream);
    doc.fontSize(14).text(
      `Simulated pre-fix cached PDF. This file stands in for a document generated before a COMPANY config change and still contains https://${OLD_DOMAIN}/`
    );
    doc.end();
  });
}

test.describe("Domain migration - Quotation PDF", () => {
  test("newly generated quotation PDF never shows the old Vercel domain, including after a stale cached file", async ({ page }) => {
    await login(page);

    await page.goto("/admin/quotations/create");
    await page.getByPlaceholder("e.g. Mr. Arun Kumar").fill(`Playwright QA Client ${RUN_TAG}`);
    await page.getByPlaceholder("98765 43210").fill("9876543210");
    await page.getByPlaceholder("e.g. Restaurant Website with Online Ordering").fill(`Domain Migration QA ${RUN_TAG}`);
    await page.getByPlaceholder("e.g. Website Design").fill("QA Verification Service");
    await page.getByPlaceholder("25000").fill("1000");

    const [createResp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/quotations") && r.request().method() === "POST"),
      page.getByRole("button", { name: "Save Draft" }).click(),
    ]);
    const created = (await createResp.json()).data;
    expect(created?._id, "quotation create response must include an id").toBeTruthy();

    await page.goto(`/admin/quotations/${created._id}`);
    await expect(page.getByRole("heading", { name: new RegExp(created.quotationNumber) })).toBeVisible();

    // 1) First download: fresh record, no cached file yet on disk.
    const freshPath = await clickDownload(page, `quotation-fresh-${RUN_TAG}.pdf`);
    const freshPages = await extractPdfPagesText(freshPath);
    assertDomainClean(freshPages, created.quotationNumber, "Quotation (fresh)");
    reportLinkAnnotations(freshPath, "Quotation (fresh)");

    // 2) Overwrite the on-disk file with a synthetic pre-fix "stale cached"
    // PDF, then click Download again through the exact same UI button/route.
    const onDiskPath = path.join(QUOTES_DIR, `${created.quotationNumber}.pdf`);
    await simulateStaleCachedFile(onDiskPath);

    const afterStalePath = await clickDownload(page, `quotation-after-stale-${RUN_TAG}.pdf`);
    const afterStalePages = await extractPdfPagesText(afterStalePath);
    assertDomainClean(afterStalePages, created.quotationNumber, "Quotation (after simulated stale cache)");
  });
});

test.describe("Domain migration - Invoice PDF", () => {
  test("newly generated invoice PDF never shows the old Vercel domain, including after a stale cached file", async ({ page }) => {
    await login(page);

    await page.goto("/admin/invoices/create");
    await page.getByPlaceholder("e.g. Mr. Arun Kumar").fill(`Playwright QA Client ${RUN_TAG}`);
    await page.getByPlaceholder("98765 43210").fill("9876543210");
    await page.getByPlaceholder("e.g. Restaurant Website with Online Ordering").fill(`Domain Migration QA ${RUN_TAG}`);
    await page.getByPlaceholder("e.g. Website Design").fill("QA Verification Item");
    await page.getByPlaceholder("25000").fill("1000");

    const [createResp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/invoices") && r.request().method() === "POST"),
      page.getByRole("button", { name: "Save Draft" }).click(),
    ]);
    const created = (await createResp.json()).data;
    expect(created?._id, "invoice create response must include an id").toBeTruthy();

    await page.goto(`/admin/invoices/${created._id}`);
    await expect(page.getByRole("heading", { name: new RegExp(created.invoiceNumber) })).toBeVisible();

    const freshPath = await clickDownload(page, `invoice-fresh-${RUN_TAG}.pdf`);
    const freshPages = await extractPdfPagesText(freshPath);
    assertDomainClean(freshPages, created.invoiceNumber, "Invoice (fresh)");
    reportLinkAnnotations(freshPath, "Invoice (fresh)");

    const onDiskPath = path.join(INVOICES_DIR, `${created.invoiceNumber}.pdf`);
    await simulateStaleCachedFile(onDiskPath);

    const afterStalePath = await clickDownload(page, `invoice-after-stale-${RUN_TAG}.pdf`);
    const afterStalePages = await extractPdfPagesText(afterStalePath);
    assertDomainClean(afterStalePages, created.invoiceNumber, "Invoice (after simulated stale cache)");
  });
});

test.describe("Domain migration - Receipt PDF", () => {
  test("newly generated payment receipt PDF never shows the old Vercel domain, including after a stale cached file", async ({ page }) => {
    await login(page);

    // Receipts require an invoice that is (a) marked Paid and (b) linked to
    // an approved quotation (server/controllers/receipt.controller.js
    // rejects standalone invoices with no project reference), so the real
    // workflow is: quotation -> accept -> invoice (linked) -> mark paid ->
    // generate receipt. No real payment gateway or WhatsApp send involved.
    await page.goto("/admin/quotations/create");
    await page.getByPlaceholder("e.g. Mr. Arun Kumar").fill(`Playwright QA Client ${RUN_TAG}`);
    await page.getByPlaceholder("98765 43210").fill("9876543210");
    await page.getByPlaceholder("e.g. Restaurant Website with Online Ordering").fill(`Domain Migration QA Receipt ${RUN_TAG}`);
    await page.getByPlaceholder("e.g. Website Design").fill("QA Verification Service");
    await page.getByPlaceholder("25000").fill("1000");

    const [quoteResp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/quotations") && r.request().method() === "POST"),
      page.getByRole("button", { name: "Save Draft" }).click(),
    ]);
    const quotation = (await quoteResp.json()).data;
    expect(quotation?._id, "quotation create response must include an id").toBeTruthy();

    await page.goto(`/admin/quotations/${quotation._id}`);
    const [approveResp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/approve") && r.request().method() === "POST"),
      page.getByRole("button", { name: "Accept" }).click(),
    ]);
    expect(approveResp.ok(), "quotation approve request must succeed").toBeTruthy();

    await page.goto(`/admin/invoices/create?quotationId=${quotation._id}`);
    // Re-assert the fields explicitly rather than trusting the quotation-based
    // autofill, so this test doesn't depend on exactly how that prefill maps.
    await page.getByPlaceholder("e.g. Mr. Arun Kumar").fill(`Playwright QA Client ${RUN_TAG}`);
    await page.getByPlaceholder("98765 43210").fill("9876543210");
    await page.getByPlaceholder("e.g. Restaurant Website with Online Ordering").fill(`Domain Migration QA Receipt ${RUN_TAG}`);
    await page.getByPlaceholder("e.g. Website Design").first().fill("QA Verification Item");
    await page.getByPlaceholder("25000").first().fill("1000");

    const [createResp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/invoices") && r.request().method() === "POST"),
      page.getByRole("button", { name: "Save Draft" }).click(),
    ]);
    const invoice = (await createResp.json()).data;
    expect(invoice?._id, "invoice create response must include an id").toBeTruthy();

    await page.goto(`/admin/invoices/${invoice._id}`);

    const [markPaidResp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/mark-paid") && r.request().method() === "POST"),
      page.getByRole("button", { name: "Mark Paid" }).click(),
    ]);
    expect(markPaidResp.ok(), "mark-paid request must succeed").toBeTruthy();

    await page.getByRole("button", { name: "Generate Receipt" }).click();
    const [genResp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/api/receipts/generate") && r.request().method() === "POST"),
      page.getByRole("button", { name: "Generate Receipt" }).last().click(),
    ]);
    expect(genResp.ok(), `receipt generate request must succeed (status ${genResp.status()})`).toBeTruthy();
    const receipt = (await genResp.json()).data;
    expect(receipt?._id, "receipt generate response must include an id").toBeTruthy();

    await page.goto(`/admin/receipts/${receipt._id}`);
    await expect(page.getByRole("heading", { name: new RegExp(receipt.receiptNumber) })).toBeVisible();

    const freshPath = await clickDownload(page, `receipt-fresh-${RUN_TAG}.pdf`);
    const freshPages = await extractPdfPagesText(freshPath);
    assertDomainClean(freshPages, receipt.receiptNumber, "Receipt (fresh)");
    reportLinkAnnotations(freshPath, "Receipt (fresh)");

    const onDiskPath = path.join(RECEIPTS_DIR, `${receipt.receiptNumber}.pdf`);
    await simulateStaleCachedFile(onDiskPath);

    const afterStalePath = await clickDownload(page, `receipt-after-stale-${RUN_TAG}.pdf`);
    const afterStalePages = await extractPdfPagesText(afterStalePath);
    assertDomainClean(afterStalePages, receipt.receiptNumber, "Receipt (after simulated stale cache)");
  });
});
