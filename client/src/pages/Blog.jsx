import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaMagnifyingGlass, FaArrowRight, FaClock, FaRegNewspaper } from "react-icons/fa6";
import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import CtaSection from "../components/CtaSection";
import { listBlogPosts } from "../lib/blog-api";
import { blogCover } from "../lib/content";

const PAGE_SIZE = 9;
const SORTS = [
  { value: "publishedDate:-1", label: "Newest first" },
  { value: "publishedDate:1", label: "Oldest first" },
];

function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function BlogCard({ b, delay }) {
  const cover = blogCover(b);
  return (
    <Reveal delay={delay}>
      <Link to={`/blog/${b.slug}`} className="card group block h-full overflow-hidden hover:-translate-y-1 hover:shadow-soft">
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary to-secondary">
          {cover ? (
            <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <FaRegNewspaper aria-hidden="true" className="absolute -bottom-6 -right-6 h-28 w-28 rotate-[-8deg] text-white/15" />
          )}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{b.category}</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-ink/50">
            <span>{b.author}</span><span>•</span><span className="flex items-center gap-1.5"><FaClock className="h-3 w-3" />{b.readTime}</span>
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-ink transition-colors group-hover:text-primary">{b.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-ink/55">{b.excerpt}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read Article <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></div>
        </div>
      </Link>
    </Reveal>
  );
}

function CardSkeleton() {
  return (
    <div className="card h-full animate-pulse overflow-hidden">
      <div className="h-44 bg-base" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-1/3 rounded bg-base" />
        <div className="h-4 w-4/5 rounded bg-base" />
        <div className="h-3 w-full rounded bg-base" />
        <div className="h-3 w-2/3 rounded bg-base" />
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(SORTS[0].value);
  const [status, setStatus] = useState("loading"); // loading | ok | empty | error | loading-more
  const requestIdRef = useRef(0);

  const debouncedQuery = useDebounced(query);

  const fetchPage = useCallback(async (pageNum, { append }) => {
    const requestId = ++requestIdRef.current;
    setStatus(append ? "loading-more" : "loading");
    try {
      const { posts: data, meta: m } = await listBlogPosts({
        page: pageNum,
        limit: PAGE_SIZE,
        search: debouncedQuery,
        category: cat,
        sort,
      });
      if (requestId !== requestIdRef.current) return;
      setPosts((prev) => (append ? [...prev, ...data] : data));
      setMeta(m);
      setPage(pageNum);
      setCategories((prev) => ["All", ...new Set([...prev.slice(1), ...data.map((p) => p.category).filter(Boolean)])]);
      setStatus(!append && data.length === 0 ? "empty" : "ok");
    } catch {
      if (requestId !== requestIdRef.current) return;
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, cat, sort]);

  useEffect(() => {
    fetchPage(1, { append: false });
  }, [fetchPage]);

  const loadMore = () => fetchPage(page + 1, { append: true });

  return (
    <>
      <Seo
        title="Blog"
        path="/blog"
        description="Insights, guides and trends from Skyntrix Technologies on SEO, web design, development and digital growth strategies for businesses in Madurai."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog" }
        ]}
        keywords={[
          "SEO Services in Madurai",
          "Digital Marketing Services in Madurai",
          "Web Development Company in Madurai",
          "UI UX Design Services"
        ]}
      />
      <PageHero title="Insights & Ideas" subtitle="Actionable guides on design, development, SEO and growth — from the team that builds and grows brands." crumb="Blog" />

      <section className="section-pad bg-base">
        <div className="container-x">
          <div className="mx-auto mb-8 flex max-w-lg flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-3 shadow-card">
              <FaMagnifyingGlass className="text-ink/40" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70 shadow-card outline-none"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${cat === c ? "bg-primary-gradient text-white shadow-soft" : "bg-white text-ink/70 hover:text-primary"}`}>
                {c}
              </button>
            ))}
          </div>

          {status === "loading" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          )}

          {status === "error" && (
            <div className="py-16 text-center">
              <p className="text-ink/60">Couldn't load articles right now. Please try again shortly.</p>
            </div>
          )}

          {status === "empty" && (
            <p className="py-16 text-center text-ink/50">No articles match your search.</p>
          )}

          {(status === "ok" || status === "loading-more") && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((b, i) => <BlogCard key={b.id} b={b} delay={(i % PAGE_SIZE) * 0.05} />)}
              </div>
              {meta?.hasNextPage && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={status === "loading-more"}
                    className="btn-secondary disabled:opacity-60"
                  >
                    {status === "loading-more" ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <CtaSection title="Want a custom growth strategy?" subtitle="Get tailored insights for your business — book a free consultation today." />
    </>
  );
}
