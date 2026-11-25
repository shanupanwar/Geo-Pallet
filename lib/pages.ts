/** Every fixed page of the site, used by the sitemap and the Site Map page. */
export const STATIC_PAGES = [
  { path: "/", name: "Home", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about/", name: "About", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/custom-pallets-british-columbia/", name: "Products", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/pallet-supplier-british-columbia/", name: "Services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/blogs-geopallet/", name: "Blogs", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/contact-geo-pallet/", name: "Contact", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/contact-form/", name: "Contact form", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/pallet-inquiry-forms/", name: "Pallet inquiry forms", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/contact-us_geopallet-site-map/", name: "Site Map", priority: 0.3, changeFrequency: "monthly" as const },
];
