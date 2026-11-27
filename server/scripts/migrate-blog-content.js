// One-off migration: moves the two static blog datasets
// (client/src/data/blog-articles.js and client/src/data/content.js) into
// MongoDB so the Blog collection becomes the single source of truth for
// public blog content. Idempotent - matches on slug, never creates
// duplicates on re-run. Usage: node scripts/migrate-blog-content.js
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import Blog from "../models/Blog.model.js";
import { commercialBlogPosts } from "../../client/src/data/blog-articles.js";
import { blogPosts as staticStubs } from "../../client/src/data/content.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skyntrix";

// Static posts predate the authorId field on content.js's own stubs (1-6);
// the commercial articles (7-12) already carry it.
const AUTHOR_ID_BY_NAME = {
  "Arjun Skyntrix": "arjun-skyntrix",
  "Vikram Singh": "vikram-singh",
  "Meera Nair": "meera-nair",
  "Ishita Patel": "ishita-patel",
};

const report = { migrated: [], skipped: [], duplicated: [], failed: [] };

const upsertOne = async (source, { status, reason }) => {
  const existing = await Blog.findOne({ slug: source.slug });
  if (existing) {
    report.duplicated.push({ slug: source.slug, reason: "already exists in MongoDB" });
    return;
  }
  try {
    const doc = await Blog.create({
      title: source.title,
      slug: source.slug,
      category: source.category || "",
      excerpt: source.excerpt || "",
      content: source.content || "",
      contentFormat: "markdown",
      author: source.author || "Skyntrix Team",
      authorId: source.authorId || AUTHOR_ID_BY_NAME[source.author] || "",
      tags: source.tags || [],
      relatedServices: source.relatedServices || [],
      status,
      publishedDate: status === "published" ? new Date(source.date || Date.now()) : undefined,
      readTime: source.readTime || "5 min",
      seo: {
        metaTitle: source.title || "",
        metaDescription: source.excerpt || "",
        keywords: source.tags || [],
      },
    });
    report.migrated.push({ slug: doc.slug, id: String(doc._id), status, reason });
  } catch (err) {
    report.failed.push({ slug: source.slug, error: err.message });
  }
};

const run = async () => {
  await mongoose.connect(MONGODB_URI);

  const seenSlugs = new Set();

  // 1) The six commercial articles (blog-articles.js) have complete bodies -
  //    migrate as published, single source of truth going forward.
  for (const post of commercialBlogPosts) {
    if (seenSlugs.has(post.slug)) {
      report.duplicated.push({ slug: post.slug, reason: "duplicate within blog-articles.js itself" });
      continue;
    }
    seenSlugs.add(post.slug);
    await upsertOne(post, { status: "published", reason: "commercial article with full body" });
  }

  // 2) content.js stubs. Six of these (ids 7-12) duplicate the slugs above
  //    with an incomplete copy - skip those entirely in favor of the full
  //    version already migrated. The other six (ids 1-6) have NO content
  //    field anywhere in the codebase - migrate as drafts (never public)
  //    instead of inventing filler text, so an editor can write a real body
  //    and publish deliberately.
  for (const post of staticStubs) {
    if (seenSlugs.has(post.slug)) {
      report.skipped.push({ slug: post.slug, reason: "superseded by the full commercial article with the same slug" });
      continue;
    }
    seenSlugs.add(post.slug);
    if (!post.content) {
      await upsertOne(post, { status: "draft", reason: "no content field in content.js - needs a real body before publishing" });
    } else {
      await upsertOne(post, { status: "published", reason: "content.js article with a body" });
    }
  }

  const reportDir = path.resolve(__dirname, "../migration-reports");
  fs.mkdirSync(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `blog-migration-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log("\n=== Blog migration report ===");
  console.log(`Migrated:   ${report.migrated.length}`);
  console.log(`Skipped:    ${report.skipped.length}`);
  console.log(`Duplicate:  ${report.duplicated.length}`);
  console.log(`Failed:     ${report.failed.length}`);
  if (report.failed.length) console.log(JSON.stringify(report.failed, null, 2));
  console.log(`\nFull report written to ${reportPath}`);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
