import type { MetadataRoute } from "next";
import { STATIC_PAGES } from "@/lib/pages";
import { getAllPosts, getCategories } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** sitemap.xml: the list of pages Google should know about (built automatically). */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts[0]?.updated;
  return [
    ...STATIC_PAGES.map((p) => ({
      url: absoluteUrl(p.path),
      lastModified: p.path === "/blogs-geopallet/" && latest ? new Date(latest) : undefined,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/${p.slug}/`),
      lastModified: new Date(p.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: p.hasImage ? [absoluteUrl(p.image)] : undefined,
    })),
    ...getCategories().map((c) => ({ url: absoluteUrl(`/category/${c.slug}/`), changeFrequency: "weekly" as const, priority: 0.4 })),
  ];
}
