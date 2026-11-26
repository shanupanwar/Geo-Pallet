import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Blocks";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import QuoteForm from "@/components/QuoteForm";
import VideoFacade from "@/components/VideoFacade";
import { formatDate, getAllPosts, getCategories, getPost } from "@/lib/posts";
import { REDIRECTS } from "@/lib/redirects";
import { articleLd, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, withBase } from "@/lib/site";
import styles from "./post.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...getAllPosts().map((p) => ({ slug: p.slug })), ...Object.keys(REDIRECTS).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  if (REDIRECTS[slug]) {
    return { title: "Moved", alternates: { canonical: absoluteUrl(REDIRECTS[slug]) }, robots: { index: false, follow: true } };
  }
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle,
    description: post.description,
    path: `/${post.slug}/`,
    image: post.hasImage ? post.image : undefined,
    imageAlt: post.imageAlt,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated,
  });
}

const GALLERY = [
  { href: "/2-way-pallets/", src: "/wp-content/uploads/2026/05/2-way-stringer-pallet-768x432.jpeg", alt: "2-way pallets" },
  { href: "/4-way-pallets/", src: "/wp-content/uploads/2026/04/4-way-stringer-pallet.jpeg", alt: "4-way pallets" },
  { href: "/wooden-skids/", src: "/wp-content/uploads/2026/05/wooden-skid-768x432.jpeg", alt: "Wooden skids" },
  { href: "/wing-pallets/", src: "/wp-content/uploads/2026/05/wing-pallet-768x432.jpeg", alt: "Wing pallets" },
  { href: "/block-pallets/", src: "/wp-content/uploads/2026/05/block-pallet-768x432.jpeg", alt: "Block pallets" },
  { href: "/wood-cribbing/", src: "/wp-content/uploads/2026/05/wood-cribbing-768x432.jpeg", alt: "Wood cribbing" },
];

/** Forwarding page for an old address. */
function Moved({ to }: { to: string }) {
  const href = withBase(to);
  return (
    <section className="section">
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <script dangerouslySetInnerHTML={{ __html: `location.replace(${JSON.stringify(href)} + location.hash)` }} />
      <div className="container narrow center">
        <p className="lead">
          This page has moved. <a href={href}>Continue to the new page</a>.
        </p>
      </div>
    </section>
  );
}

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  if (REDIRECTS[slug]) return <Moved to={REDIRECTS[slug]} />;
  const post = getPost(slug);
  if (!post) notFound();
  const url = absoluteUrl(`/${post.slug}/`);
  const related = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 4);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs-geopallet/" },
    { name: post.title, path: `/${post.slug}/` },
  ];
  const share = [
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, cls: styles.fb },
    { name: "Twitter", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`, cls: styles.tw },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, cls: styles.li },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`, cls: styles.wa },
  ];

  return (
    <>
      <section className={styles.hero}>
        {post.hasImage ? <Image src={post.image} alt="" fill priority sizes="100vw" className={styles.heroImg} /> : null}
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.meta}>
            {getCategories().some((c) => c.slug === post.categorySlug) ? <Link href={`/category/${post.categorySlug}/`}>{post.category}</Link> : post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
            {post.readingMinutes} min read
          </p>
        </div>
      </section>

      <div className={`container ${styles.layout}`}>
        <article className={styles.article}>
          <Breadcrumbs items={crumbs} />
          {post.hasImage ? (
            <Image src={post.image} alt={post.imageAlt} width={1200} height={675} sizes="(max-width: 1024px) 100vw, 760px" className={styles.featured} />
          ) : null}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
          <VideoFacade />
          <ul className={styles.share} aria-label="Share this article">
            {share.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={s.cls}>
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <aside className={styles.sidebar} aria-label="Sidebar">
          <div className={styles.box}>
            <h2 className={styles.boxTitle}>Get Free Quote</h2>
            <span className={styles.dot} aria-hidden="true" />
            <QuoteForm compact idPrefix="sidebar-quote" />
          </div>
          <div className={styles.box}>
            <h2 className={styles.boxTitle}>Blog Categories</h2>
            <span className={styles.dot} aria-hidden="true" />
            <ul className={styles.cats}>
              {getCategories().map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}/`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className={styles.gallery} aria-label="Pallet types">
            {GALLERY.map((g) => (
              <li key={g.href}>
                <Link href={g.href}>
                  <Image src={g.src} alt={g.alt} width={384} height={216} sizes="160px" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="section" aria-labelledby="more-title">
        <div className="container">
          <h2 id="more-title" className="h-sm center">More Interesting Posts</h2>
          <div className={styles.related}>
            {related.map((p) => (
              <PostCard key={p.slug} post={p} compact headingLevel={3} />
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          articleLd({
            title: post.title,
            description: post.description,
            path: `/${post.slug}/`,
            image: post.image,
            published: post.date,
            modified: post.updated,
            category: post.category,
          }),
          breadcrumbLd(crumbs),
        ]}
      />
    </>
  );
}
