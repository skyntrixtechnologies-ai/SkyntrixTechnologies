import { useParams, Link } from "react-router-dom";
import { FaChevronLeft, FaLinkedin, FaXTwitter, FaGithub, FaDribbble, FaArrowRight } from "react-icons/fa6";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import CtaSection from "../components/CtaSection";
import { authors } from "../data/authors";
import { blogPosts } from "../data/content";
import { commercialBlogPosts } from "../data/blog-articles";

export default function AuthorPage() {
  const { slug } = useParams();
  const author = authors.find((a) => a.id === slug);

  if (!author) {
    return (
      <>
        <Seo title="Author not found" path={`/authors/${slug}`} noindex />
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="heading-lg text-ink">Author not found</h1>
          <Link to="/blog" className="btn-primary mt-6">Back to Blog</Link>
        </div>
      </>
    );
  }

  const allPosts = [...blogPosts, ...commercialBlogPosts];
  const authorArticles = allPosts.filter((p) => p.authorId === author.id);
  const socialLinks = author.social ? Object.entries(author.social) : [];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: author.name }
  ];

  return (
    <>
      <Seo
        title={`${author.name} - ${author.role}`}
        path={`/authors/${slug}`}
        description={`${author.name} is the ${author.role} at Skyntrix Technologies. ${author.bio}`}
        breadcrumbs={breadcrumbs}
        keywords={[author.name, author.role, "Skyntrix Technologies", ...author.expertise]}
      />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl">
            <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-primary"><FaChevronLeft className="h-3 w-3" /> Back to Blog</Link>
          </Reveal>

          <Reveal className="mx-auto mt-8 max-w-3xl">
            <div className="flex items-start gap-6">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary-gradient font-display text-2xl font-bold text-white">{author.avatar}</span>
              <div>
                <h1 className="heading-xl text-ink">{author.name}</h1>
                <p className="mt-1 text-lg text-primary">{author.role}</p>
                <p className="mt-4 text-ink/70 leading-relaxed">{author.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {author.expertise.map((skill) => (
                    <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{skill}</span>
                  ))}
                </div>
                {socialLinks.length > 0 && (
                  <div className="mt-5 flex gap-3">
                    {socialLinks.map(([platform, url]) => (
                      <a key={platform} href={url} target="_blank" rel="noreferrer" aria-label={platform}
                        className="grid h-10 w-10 place-items-center rounded-full bg-ink/5 text-ink/60 transition-all hover:bg-primary hover:text-white">
                        {platform === "linkedin" && <FaLinkedin className="h-4 w-4" />}
                        {platform === "twitter" && <FaXTwitter className="h-4 w-4" />}
                        {platform === "github" && <FaGithub className="h-4 w-4" />}
                        {platform === "dribbble" && <FaDribbble className="h-4 w-4" />}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {authorArticles.length > 0 && (
            <Reveal className="mx-auto mt-16 max-w-3xl">
              <h2 className="heading-lg mb-8">Articles by {author.name}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {authorArticles.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="card group block p-6 hover:-translate-y-1 hover:shadow-soft">
                    <div className="text-xs font-semibold text-primary">{post.category}</div>
                    <h3 className="mt-2 font-display text-lg font-bold text-ink transition-colors group-hover:text-primary">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-ink/55">{post.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read Article <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
