import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronLeft, FaClock, FaXTwitter, FaLinkedinIn, FaFacebookF, FaCalendar, FaArrowRight } from "react-icons/fa6";
import Seo, { getArticleSchema } from "../components/Seo";
import Reveal from "../components/Reveal";
import CtaSection from "../components/CtaSection";
import NotFound from "./NotFound";
import { SITE } from "../config/site";
import { services } from "../data/services";
import { getBlogBySlug, listBlogPosts } from "../lib/blog-api";
import { renderArticleBody, blogCover } from "../lib/content";

function relatedScore(candidate, post) {
  const tagOverlap = (candidate.tags || []).filter((t) => (post.tags || []).includes(t)).length;
  const sameCategory = candidate.category === post.category ? 10 : 0;
  return sameCategory + tagOverlap;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | not-found | error

  useEffect(() => {
    // Aborts the in-flight request on cleanup (not just a "cancelled" flag) so
    // React 18 StrictMode's dev-only double-invoke - or a fast slug change -
    // never lets a stale request reach the server and double-count a view.
    const controller = new AbortController();

    setStatus("loading");
    setPost(null);
    setRelated([]);

    (async () => {
      try {
        const data = await getBlogBySlug(slug, { signal: controller.signal });
        setPost(data);
        setStatus("ok");

        try {
          const { posts } = await listBlogPosts(
            { category: data.category, excludeSlug: data.slug, limit: 6 },
            { signal: controller.signal }
          );
          const ranked = [...posts].sort((a, b) => relatedScore(b, data) - relatedScore(a, data)).slice(0, 3);
          setRelated(ranked);
        } catch {
          // Related articles are a nice-to-have - a failed fetch shouldn't break the article page.
        }
      } catch (e) {
        if (e.name === "AbortError") return;
        setStatus(e.status === 404 ? "not-found" : "error");
      }
    })();

    return () => controller.abort();
  }, [slug]);

  if (status === "loading") {
    return (
      <>
        <Seo title="Loading..." path={`/blog/${slug}`} noindex />
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </>
    );
  }

  if (status === "not-found") {
    return <NotFound title="Article Not Found" />;
  }

  if (status === "error") {
    return (
      <>
        <Seo title="Something went wrong" path={`/blog/${slug}`} noindex />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="heading-lg text-ink">Couldn't load this article</h1>
          <p className="mt-3 text-ink/60">Please check your connection and try again.</p>
          <Link to="/blog" className="btn-primary mt-6">Back to Blog</Link>
        </div>
      </>
    );
  }

  const shareUrl = `${SITE.url}/blog/${post.slug}`;
  const bodyHtml = renderArticleBody(post.content, post.contentFormat);
  const cover = blogCover(post);

  const relatedService = post.relatedServices?.[0]
    ? services.find((s) => s.slug === post.relatedServices[0])
    : null;

  const articleSchema = getArticleSchema(post, `/blog/${post.slug}`);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title }
  ];

  return (
    <>
      <Seo
        title={post.title}
        path={`/blog/${post.slug}`}
        description={post.excerpt}
        image={cover || undefined}
        type="article"
        jsonLd={articleSchema}
        breadcrumbs={breadcrumbs}
        keywords={[post.title, post.category, ...post.tags, "Skyntrix Technologies Blog"]}
      />
      <article className="pt-32 pb-20 md:pt-40">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl">
            <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-primary"><FaChevronLeft className="h-3 w-3" /> Back to Blog</Link>
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
            <h1 className="heading-xl mt-4 text-ink">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/50">
              <span className="flex items-center gap-1.5"><FaXTwitter className="h-3.5 w-3.5" />{post.author}</span>
              <span className="flex items-center gap-1.5"><FaCalendar className="h-3.5 w-3.5" />{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className="flex items-center gap-1.5"><FaClock className="h-3.5 w-3.5" />{post.readTime} read</span>
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-8 max-w-3xl">
            {cover ? (
              <img
                src={cover}
                alt={post.title}
                className="h-64 w-full rounded-3xl object-cover md:h-96"
                loading="eager"
              />
            ) : (
              <div className="h-64 rounded-3xl bg-gradient-to-br from-primary to-secondary md:h-96" />
            )}
          </Reveal>

          <div className="mx-auto mt-10 max-w-3xl">
            {bodyHtml ? (
              <div
                className="prose-article leading-relaxed text-ink/70"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            ) : (
              <p className="leading-relaxed text-ink/70">{post.excerpt}</p>
            )}

            {relatedService && (
              <Reveal className="my-10 rounded-2xl bg-primary/5 p-6 border border-primary/10">
                <h2 className="heading-md text-ink">Need {relatedService.name}?</h2>
                <p className="mt-2 text-ink/70">{relatedService.short}</p>
                <Link to={`/services/${relatedService.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  View {relatedService.name} Service <FaArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            )}

            <Reveal className="mt-10 flex items-center justify-between border-t border-ink/10 pt-6">
              <Link to={`/authors/${post.authorId || "arjun-skyntrix"}`} className="flex items-center gap-3 group">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-gradient font-bold text-white">{post.author.split(" ").map((w) => w[0]).join("")}</span>
                <div>
                  <div className="font-semibold text-ink group-hover:text-primary transition-colors">{post.author}</div>
                  <div className="text-xs text-ink/50">Skyntrix Technologies</div>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink/50">Share</span>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Twitter" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/70 hover:bg-primary hover:text-white"><FaXTwitter className="h-3.5 w-3.5" /></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/70 hover:bg-primary hover:text-white"><FaLinkedinIn className="h-3.5 w-3.5" /></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/70 hover:bg-primary hover:text-white"><FaFacebookF className="h-3.5 w-3.5" /></a>
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-pad pt-0">
          <div className="container-x">
            <h2 className="heading-lg mb-8">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((b) => (
                <Link key={b.id} to={`/blog/${b.slug}`} className="card group block p-6 hover:-translate-y-1 hover:shadow-soft">
                  <div className="text-xs font-semibold text-primary">{b.category}</div>
                  <h3 className="mt-2 font-display text-lg font-bold text-ink transition-colors group-hover:text-primary">{b.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/55">{b.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaSection />
    </>
  );
}
