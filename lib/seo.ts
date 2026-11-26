import type { Metadata } from "next";
import { googleLinks } from "@/content/data/testimonials";
import { BUSINESS, INDEXABLE, SITE_URL, absoluteUrl } from "./site";

type PageSeo = {
  /** Google title (shown as-is; keep under ~60 characters). */
  title: string;
  /** Google description (keep 120-160 characters). */
  description: string;
  /** Path of the page, with trailing slash: "/about/". */
  path: string;
  /** Share picture (path under /public or full URL). */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Hide a single page from Google (e.g. redirects, thank-you pages). */
  noindex?: boolean;
};

/** Everything Google and social apps read for one page: title, description, canonical, previews, robots. */
export function pageMetadata(p: PageSeo): Metadata {
  const url = absoluteUrl(p.path);
  const image = p.image || BUSINESS.shareImage;
  const index = INDEXABLE && !p.noindex;
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
      : { index: false, follow: false },
    openGraph: {
      type: p.type || "website",
      url,
      title: p.title,
      description: p.description,
      siteName: BUSINESS.name,
      locale: "en_CA",
      images: [{ url: image, alt: p.imageAlt || p.title }],
      ...(p.type === "article" ? { publishedTime: p.publishedTime, modifiedTime: p.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [image] },
  };
}

/* ---------------- Structured data (schema.org JSON-LD) ---------------- */

const ORG_ID = `${SITE_URL}/#business`;

function hoursSpec() {
  return BUSINESS.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes }));
}

function address(i: number) {
  const l = BUSINESS.locations[i];
  return { "@type": "PostalAddress", streetAddress: l.street, addressLocality: l.city, addressRegion: l.region, postalCode: l.postalCode, addressCountry: l.country };
}

/** The business "card" Google uses for local search and the knowledge panel. */
export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl(BUSINESS.logo),
    image: absoluteUrl(BUSINESS.shareImage),
    telephone: BUSINESS.phones[0].tel,
    email: BUSINESS.email,
    address: address(0),
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: hoursSpec(),
    department: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#langley`,
      name: `${BUSINESS.name} – Langley`,
      telephone: BUSINESS.phones[0].tel,
      address: address(1),
      openingHoursSpecification: hoursSpec(),
      hasMap: googleLinks("Langley").map,
      sameAs: [googleLinks("Langley").map],
    },
    hasMap: googleLinks("Surrey").map,
    sameAs: [googleLinks("Surrey").map, ...BUSINESS.social.map((s) => s.url).filter(Boolean)],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: absoluteUrl("/"),
    name: BUSINESS.name,
    inLanguage: "en-CA",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function articleLd(a: { title: string; description: string; path: string; image: string; published: string; modified: string; category?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    image: absoluteUrl(a.image),
    datePublished: a.published,
    dateModified: a.modified,
    mainEntityOfPage: absoluteUrl(a.path),
    articleSection: a.category,
    author: { "@type": "Organization", name: BUSINESS.name, url: absoluteUrl("/") },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-CA",
  };
}


export function serviceLd(s: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: absoluteUrl(s.path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "AdministrativeArea", name: "British Columbia" },
  };
}
