import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Blocks";
import JsonLd from "@/components/JsonLd";
import PostCard from "@/components/PostCard";
import { getBlogPosts, getCategories } from "@/lib/posts";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import styles from "../../blogs-geopallet/blogs.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase()).replace(/\bAnd\b/g, "and");

export async function generateMetadata({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const cat = getCategories().find((c) => c.slug === slug);
  if (!cat) return {};
  return pageMetadata({
    title: `${titleCase(cat.name)} Articles | Geo Pallet Ltd.`,
    description: `Articles from Geo Pallet Ltd. about ${titleCase(cat.name).toLowerCase()}: practical pallet guides for businesses across British Columbia.`,
    path: `/category/${cat.slug}/`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const cat = getCategories().find((c) => c.slug === slug);
  if (!cat) notFound();
  const posts = getBlogPosts().filter((p) => p.categories.includes(slug));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs-geopallet/" },
    { name: titleCase(cat.name), path: `/category/${slug}/` },
  ];
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <Breadcrumbs items={crumbs} />
          <h1 className="h-md">{titleCase(cat.name)}</h1>
          <p className={styles.sub}>{posts.length} {posts.length === 1 ? "article" : "articles"}</p>
        </div>
      </section>
      <section className="section">
        <div className={`container ${styles.grid}`}>
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
