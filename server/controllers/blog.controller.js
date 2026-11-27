import Blog from "../models/Blog.model.js";
import createCrudController from "./crud.factory.js";
import generateUniqueSlug from "./slug.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/response.js";
import ApiError from "../utils/ApiError.js";
import { uploadFile, deleteFile } from "../services/cloudinary.service.js";
import { listDocuments } from "../services/query.service.js";

const base = createCrudController(Blog, {
  searchFields: ["title", "excerpt", "content", "category", "tags"],
  defaultSort: { publishedDate: -1, createdAt: -1 },
  documentName: "Blog",
});

const withThumbnail = async (req, body) => {
  if (req.file) {
    const img = await uploadFile(req.file, { folder: "skyntrix/blogs" });
    body.thumbnail = img.url;
    body.thumbnailPublicId = img.public_id;
    body.featuredImage = img.url;
    body.featuredImagePublicId = img.public_id;
  }
  return body;
};

/**
 * Status changes (draft -> published/scheduled/archived) require the
 * "publish" permission, same rule the dedicated /status route enforces -
 * closes the bypass where the normal create/update endpoint let any
 * authenticated admin publish by sending `status` in the body.
 */
const canChangeStatus = (req) => {
  if (!req.admin) return false;
  if (req.admin.role === "super-admin") return true;
  return !!req.admin.permissions?.publish;
};

const assertStatusChangeAllowed = (req, nextStatus, currentStatus) => {
  if (!nextStatus || nextStatus === currentStatus) return;
  if (!canChangeStatus(req)) {
    throw ApiError.forbidden("Missing 'publish' permission to change blog status.");
  }
};

export const createBlog = asyncHandler(async (req, res) => {
  const body = req.body;
  assertStatusChangeAllowed(req, body.status, "draft");
  if (!body.slug) body.slug = await generateUniqueSlug(Blog, body.title);
  if (body.status === "published" && !body.publishedDate) body.publishedDate = new Date();
  if (body.status === "scheduled" && !body.publishedDate && body.scheduledAt) body.publishedDate = body.scheduledAt;
  const enriched = await withThumbnail(req, body);
  const doc = await Blog.create(enriched);
  // Approximate read time from content
  if (doc.content) {
    const words = doc.content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    doc.readTime = `${Math.max(1, Math.round(words / 200))} min`;
    await doc.save();
  }
  return ApiResponse.created(res, "Blog created", doc);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const existing = await Blog.findById(req.params.id);
  if (!existing) throw ApiError.notFound("Blog not found");

  const body = req.body;
  assertStatusChangeAllowed(req, body.status, existing.status);

  // Slug stays stable across edits unless the admin explicitly sends a
  // different, non-empty slug - never regenerated just because the title
  // (or any other field) changed.
  if (body.slug && body.slug !== existing.slug) {
    body.slug = await generateUniqueSlug(Blog, body.slug, existing._id);
  } else {
    delete body.slug;
  }
  if (body.status === "published" && !existing.publishedDate) body.publishedDate = new Date();
  if (body.status === "scheduled" && body.scheduledAt) body.publishedDate = body.scheduledAt;
  const enriched = await withThumbnail(req, body);
  if (req.file && existing.thumbnailPublicId) await deleteFile(existing.thumbnailPublicId);

  existing.set(enriched);
  await existing.save();

  if (existing.content) {
    const words = existing.content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    existing.readTime = `${Math.max(1, Math.round(words / 200))} min`;
    await existing.save();
  }
  return ApiResponse.ok(res, "Blog updated", existing);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const existing = await Blog.findById(req.params.id);
  if (!existing) throw ApiError.notFound("Blog not found");
  if (existing.thumbnailPublicId) await deleteFile(existing.thumbnailPublicId);
  await existing.deleteOne();
  return ApiResponse.ok(res, "Blog deleted");
});

// Increment view counter when a public post is fetched
export const fetchBlogBySlug = asyncHandler(async (req, res) => {
  const doc = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!doc) throw ApiError.notFound("Blog post not found");
  return ApiResponse.ok(res, "Blog post fetched", doc);
});

/**
 * Public listing with blog-specific filters (category, authorId) on top of
 * the generic search/sort/page/limit support - lets the blog listing page
 * and author pages query exactly what they need instead of client-side
 * filtering a capped, unfiltered batch.
 */
export const fetchPublicBlogs = asyncHandler(async (req, res) => {
  const extraFilters = {};
  if (req.query.category && req.query.category !== "All") extraFilters.category = req.query.category;
  if (req.query.authorId) extraFilters.authorId = req.query.authorId;
  if (req.query.excludeSlug) extraFilters.slug = { $ne: req.query.excludeSlug };

  const { data, meta } = await listDocuments(Blog, req, {
    searchFields: ["title", "excerpt", "content", "category", "tags"],
    defaultSort: { publishedDate: -1, createdAt: -1 },
    publicOnly: true,
    extraFilters,
  });
  return ApiResponse.ok(res, "Blog fetched", data, meta);
});
export const listBlogs = base.list;
export const listBlogDetail = base.detail;
export const updateBlogStatus = base.updateStatus;