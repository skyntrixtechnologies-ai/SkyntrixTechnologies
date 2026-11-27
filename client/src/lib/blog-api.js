// Direct, query-driven public blog endpoints - used by the blog listing,
// article detail, homepage preview and author pages so each fetches exactly
// what it needs from MongoDB (the single source of truth) instead of
// filtering a single capped, unfiltered batch from SiteDataContext.
import { toBlogPost } from "./site-data";
import { API_URL } from "../config/site";

const API = (API_URL || "/api").replace(/\/$/, "");

async function get(path, { signal } = {}) {
  const res = await fetch(`${API}${path}`, { signal });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.message || `${path} failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
};

/** Paginated, filterable published-article listing. Returns { posts, meta }. */
export async function listBlogPosts(params = {}, { signal } = {}) {
  const body = await get(`/blogs${toQuery(params)}`, { signal });
  return { posts: (body.data || []).map(toBlogPost), meta: body.meta || null };
}

/**
 * Single published article by slug. Increments its view count server-side,
 * so callers should pass an AbortController signal and abort on effect
 * cleanup - otherwise React 18 StrictMode's dev-only double-invoke (and any
 * rapid slug change) fires this twice and double-counts the view.
 * Throws (status 404) if not found.
 */
export async function getBlogBySlug(slug, { signal } = {}) {
  const body = await get(`/blogs/public/${encodeURIComponent(slug)}`, { signal });
  return toBlogPost(body.data);
}
