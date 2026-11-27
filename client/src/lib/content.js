// Shared, sanitized renderer for blog article bodies. Content is authored as
// Markdown (Blog.contentFormat === "markdown", the only format anything
// currently produces); "html" is accepted too so a future rich-text editor
// phase can switch individual articles over without a renderer change.
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ breaks: true, gfm: true });

const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "a",
  "ul", "ol", "li", "blockquote",
  "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "pre", "code", "span",
];
const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class", "id"];

/** Parse + sanitize an article body into safe HTML ready for dangerouslySetInnerHTML. */
export function renderArticleBody(content, contentFormat = "markdown") {
  if (!content) return "";
  const rawHtml = contentFormat === "html" ? content : marked.parse(content);
  return DOMPurify.sanitize(rawHtml, { ALLOWED_TAGS, ALLOWED_ATTR });
}

/**
 * Real, uploaded thumbnail URL for a post, or "" when it only has the old
 * decorative theme-key string (e.g. "seo", "tech") - callers fall back to
 * the gradient placeholder in that case. Used consistently across the blog
 * listing, detail hero and homepage preview so thumbnails render the same
 * way everywhere.
 */
export function blogCover(post) {
  const src = post?.thumbnail || post?.featuredImage || "";
  return /^(https?:)?\/\/|^\//.test(src) ? src : "";
}
