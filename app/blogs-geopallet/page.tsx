import Link from "next/link";
import { Breadcrumbs } from "@/components/Blocks";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import { getBlogPosts, getCategories } from "@/lib/posts";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import styles from "./blogs.module.css";

export const metadata = pageMetadata({
  title: "Pallet Industry Insights & Guides | Geo Pallet Ltd.",
  description:
    "Explore guides on wooden pallets, pallet type, warehousing, and shipping. Get practical insights for businesses across British Columbia.",
  path: "/blogs-geopallet/",
});

export default function BlogsPage() {
  const posts = getBlogPosts();
  const cats = getCategories();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Blogs", path: "/blogs-geopallet/" }];
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <h1 className="h-md">Pallet Industry Insights &amp; Guides</h1>
          <p className={styles.sub}>Explore our Latest Pallet Articles</p>
        </div>
      </section>
      <section className="section" aria-label="Articles">
        <div className="container">
          <nav aria-label="Article categories" className={styles.filters}>
            <Link href="/blogs-geopallet/" aria-current="page">All</Link>
            {cats.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}/`}>{c.name}</Link>
            ))}
          </nav>
          <div className={styles.grid}>
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Pallet Industry Insights & Guides",
            url: absoluteUrl("/blogs-geopallet/"),
            blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/${p.slug}/`), datePublished: p.date })),
          },
        ]}
      />
    </>
  );
}
