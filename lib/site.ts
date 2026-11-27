/**
 * Site-wide settings. Change business details here and every page, the footer and
 * Google's structured data update together.
 */

/** Public address of the site. Set SITE_URL in the deploy workflow; no trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://geopalletltd.com").replace(/\/$/, "");

/** "/Geo-Pallet" on the github.io test address, "" on geopalletltd.com. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * true only when Google may list the site. The test address keeps this false so Google
 * doesn't see a second copy of geopalletltd.com. Set NEXT_PUBLIC_INDEXABLE=true at go-live.
 */
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/** Full public (canonical) URL for a path, e.g. absoluteUrl("/about/") -> https://geopalletltd.com/about/. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Path with the base path, for plain <img>/<a> tags outside next/link and next/image. */
export function withBase(path: string): string {
  return /^https?:/.test(path) ? path : `${BASE_PATH}${path}`;
}

export const BUSINESS = {
  name: "Geo Pallet Ltd.",
  shortName: "Geo Pallet",
  tagline: "For lower cost get more strength",
  description:
    "Wooden pallet manufacturer in Surrey and Langley, BC: new, custom, heat-treated and recycled pallets, skids, crates, cribbing, pallet repair and delivery.",
  email: "sales@geopalletltd.com",
  formEmail: "office@geopalletltd.com",
  phones: [
    { label: "604 584 4368", tel: "+16045844368" },
    { label: "604 584 4367", tel: "+16045844367" },
  ],
  /** "Text us" number in the quote section. TESTING number for now: swap for the company's texting number before go-live. */
  textNumber: { label: "+91 97797 25737", tel: "+919779725737" },
  locations: [
    {
      id: "surrey",
      label: "Surrey",
      street: "11180 120 Street",
      city: "Surrey",
      region: "BC",
      postalCode: "V3V 8B8",
      country: "CA",
      display: "Surrey: 11180 120 Street Surrey, BC Canada V3V 8B8",
    },
    {
      id: "langley",
      label: "Langley",
      street: "8910 256 Street Unit #1",
      city: "Langley Township",
      region: "BC",
      postalCode: "V1M 3N7",
      country: "CA",
      display: "Langley: 8910 256 Street Unit #1, Langley Township, BC V1M 3N7",
    },
  ],
  hoursText: "Mon-Thur: 7:00am - 4:00pm | Fri: 7:00 am to 3:00 pm | Sat & Sun: Closed",
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "07:00", closes: "16:00" },
    { days: ["Friday"], opens: "07:00", closes: "15:00" },
  ],
  logo: "/wp-content/uploads/2024/04/GP-logo-without-tagline-removebg-preview.png",
  shareImage: "/home-hero-poster.jpg",
  social: [
    { name: "Facebook", icon: "facebook", url: "https://www.facebook.com/GeoPallet" },
    { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/company/geo-pallet-ltd." },
    { name: "Instagram", icon: "instagram", url: "https://www.instagram.com/geopallet" },
    { name: "TikTok", icon: "tiktok", url: "https://www.tiktok.com/@geopallet" },
    { name: "X (Twitter)", icon: "twitter", url: "https://x.com/geopalletltd" },
    { name: "YouTube", icon: "youtube", url: "https://www.youtube.com/@GeoPallet" },
  ],
  areaServed: ["Surrey", "Langley", "Vancouver", "Richmond", "Coquitlam", "British Columbia"],
} as const;

export type NavItem = { label: string; href: string; children?: { label: string; items: { label: string; href: string }[] }[] };

const P = "/custom-pallets-british-columbia/";
export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  {
    label: "Products",
    href: P,
    children: [
      {
        label: "Pallet Types",
        items: [
          { label: "2-way Pallet", href: `${P}#twoway` },
          { label: "4-way Pallet", href: `${P}#4way` },
          { label: "Skid Pallet", href: `${P}#skid` },
          { label: "Wing Pallet", href: `${P}#wing` },
          { label: "Block Pallet", href: `${P}#block` },
          { label: "Custom Pallet", href: `${P}#custom` },
          { label: "Wood Cribbing", href: `${P}#crib` },
          { label: "Grade-A Pallet", href: `${P}#grade1` },
          { label: "Grade-B Pallet", href: `${P}#grade2` },
        ],
      },
      { label: "Crate Types", items: [{ label: "Wooden Crate", href: `${P}#Crates` }] },
    ],
  },
  { label: "Services", href: "/pallet-supplier-british-columbia/" },
  { label: "Blogs", href: "/blogs-geopallet/" },
  { label: "Contact", href: "/contact-geo-pallet/" },
];
