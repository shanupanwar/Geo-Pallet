import type { MetadataRoute } from "next";
import { INDEXABLE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** robots.txt. The test address blocks everything; the real domain allows everything and lists the sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: absoluteUrl("/sitemap.xml"), host: absoluteUrl("/") };
}
