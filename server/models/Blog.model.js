import mongoose from "mongoose";

export const BLOG_STATUS = ["draft", "published", "scheduled", "archived"];
export const BLOG_CONTENT_FORMATS = ["markdown", "html"];

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    category: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    // Authored as Markdown and rendered via a sanitized Markdown->HTML
    // pipeline (see client/src/lib/markdown.js). "html" is reserved for a
    // future rich-text editor phase - nothing produces it yet.
    content: { type: String, default: "" },
    contentFormat: { type: String, enum: BLOG_CONTENT_FORMATS, default: "markdown" },
    thumbnail: { type: String, default: "" },
    thumbnailPublicId: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    featuredImagePublicId: { type: String, default: "" },
    author: { type: String, default: "Skyntrix Team" },
    // Links to a static author record (client/src/data/authors.js) so author
    // pages can resolve this article's author without a separate Author
    // collection. Not a Mongo ref on purpose - keeps Phase 1 schema-light.
    authorId: { type: String, default: "" },
    authorPhoto: { type: String, default: "" },
    tags: [{ type: String }],
    relatedServices: [{ type: String }],
    status: { type: String, enum: BLOG_STATUS, default: "draft" },
    publishedDate: { type: Date },
    scheduledAt: { type: Date },
    readTime: { type: String, default: "5 min" },
    views: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", excerpt: "text", content: "text" });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ status: 1, publishedDate: -1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;