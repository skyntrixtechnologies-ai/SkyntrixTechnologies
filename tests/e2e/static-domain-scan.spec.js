// Static regression scan: fails if the retired Vercel hostname reappears
// anywhere in live source, config or public assets. This is supplementary to
// (not a replacement for) the PDF E2E tests in domain-migration.spec.js -
// a string being absent from source doesn't prove a *running* PDF is clean
// (see that suite's stale-cache scenario), and a string's presence here
// doesn't necessarily mean a live bug (see ALLOWLIST below).
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const OLD_DOMAIN = "skyntrix.vercel.app";
const REPO_ROOT = path.resolve(__dirname, "..", "..");

// Directories never worth scanning: dependencies, build output, VCS, and this
// test suite's own output (downloaded/generated test PDFs).
const EXCLUDED_DIRS = new Set([
  "node_modules", ".git", "build", "dist", ".output",
  "uploads", // generated PDFs / user documents, not source
]);

// Files that are INTENTIONALLY allowed to mention the old domain, and why.
const ALLOWLIST = [
  {
    file: "tests/e2e/domain-migration.spec.js",
    reason: "defines OLD_DOMAIN as a constant to assert its absence from generated PDFs",
  },
  {
    file: "tests/e2e/static-domain-scan.spec.js",
    reason: "this file - defines OLD_DOMAIN to scan for it",
  },
  {
    file: "tests/e2e/README.md",
    reason: "documents the migration history and this suite's test strategy",
  },
];

/** Recursively collect candidate source files under root, honoring EXCLUDED_DIRS. */
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

const TEXT_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".txt", ".html", ".xml", ".env", ".example",
]);

test("no unintentional references to the retired skyntrix.vercel.app domain remain in source", () => {
  const allFiles = walk(REPO_ROOT);
  const allowedRelPaths = new Set(ALLOWLIST.map((a) => a.file.replace(/\\/g, "/")));

  const unintentionalHits = [];
  const intentionalHitsSeen = new Set();

  for (const absPath of allFiles) {
    const ext = path.extname(absPath).toLowerCase();
    const base = path.basename(absPath).toLowerCase();
    const isEnvFile = base.startsWith(".env");
    if (!TEXT_EXTENSIONS.has(ext) && !isEnvFile) continue;

    let content;
    try {
      content = fs.readFileSync(absPath, "utf8");
    } catch {
      continue; // binary or unreadable - not a text source file
    }
    if (!content.toLowerCase().includes(OLD_DOMAIN)) continue;

    const relPath = path.relative(REPO_ROOT, absPath).replace(/\\/g, "/");
    const lines = content.split(/\r?\n/);
    const hitLines = [];
    lines.forEach((line, i) => {
      if (line.toLowerCase().includes(OLD_DOMAIN)) hitLines.push({ line: i + 1, text: line.trim() });
    });

    if (allowedRelPaths.has(relPath)) {
      intentionalHitsSeen.add(relPath);
    } else {
      unintentionalHits.push({ file: relPath, hits: hitLines });
    }
  }

  if (unintentionalHits.length > 0) {
    const report = unintentionalHits
      .map((h) => `  ${h.file}:\n${h.hits.map((x) => `    line ${x.line}: ${x.text}`).join("\n")}`)
      .join("\n");
    throw new Error(
      `Found ${unintentionalHits.length} file(s) with unintentional references to the retired domain "${OLD_DOMAIN}":\n${report}`
    );
  }

  console.log(
    `Static scan clean. Intentional references found in: ${[...intentionalHitsSeen].join(", ") || "(none present)"}`
  );
  expect(unintentionalHits.length).toBe(0);
});
