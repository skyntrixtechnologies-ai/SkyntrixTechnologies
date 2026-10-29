// PDF inspection helpers for the domain-migration E2E suite.
//
// We deliberately do NOT use pdf-parse's getHyperlinks()/rendering APIs here:
// they depend on an optional canvas rendering backend and throw an opaque,
// unhelpful error in this environment. PDFKit (the library this app's PDF
// generators use) writes Link annotations as plain, uncompressed indirect
// PDF objects, so they can be found directly in the raw file bytes without
// needing any PDF rendering engine at all.
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

/**
 * Extract the text of every page of a PDF as an array of strings.
 * @param {string} pdfPath
 * @returns {Promise<string[]>} one entry per page, in page order
 */
async function extractPdfPagesText(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: buf });
  const { pages } = await parser.getText();
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error(`extractPdfPagesText: no pages could be extracted from ${pdfPath}`);
  }
  return pages.map((p) => p.text || "");
}

/**
 * Extract every Link annotation's target URI from a PDF, with its page
 * number and rect (bounding box), by scanning the raw (uncompressed) PDF
 * object table that PDFKit writes.
 *
 * Returns [] if the PDF has no Link annotations at all (e.g. documents
 * generated before hyperlink annotations were added to the generator).
 *
 * @param {string} pdfPath
 * @returns {Array<{ uri: string|null, rect: number[]|null }>}
 */
function extractLinkAnnotations(pdfPath) {
  const raw = fs.readFileSync(pdfPath, "latin1");

  const objects = new Map();
  const objRe = /(\d+) 0 obj\s*<<([\s\S]*?)>>\s*endobj/g;
  let m;
  while ((m = objRe.exec(raw))) objects.set(m[1], m[2]);

  const annots = [];
  for (const [, body] of objects) {
    if (!/\/Subtype\s*\/Link/.test(body)) continue;
    const rectMatch = body.match(/\/Rect\s*\[([^\]]*)\]/);
    const actionRefMatch = body.match(/\/A\s+(\d+)\s+0\s+R/);
    let uri = null;
    if (actionRefMatch) {
      const actionBody = objects.get(actionRefMatch[1]) || "";
      const uriMatch = actionBody.match(/\/URI\s*\(([^)]*)\)/);
      uri = uriMatch ? uriMatch[1] : null;
    }
    annots.push({
      uri,
      rect: rectMatch ? rectMatch[1].trim().split(/\s+/).map(Number) : null,
    });
  }
  return annots;
}

module.exports = { extractPdfPagesText, extractLinkAnnotations };
