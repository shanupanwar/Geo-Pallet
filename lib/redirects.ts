/**
 * Old WordPress addresses that other sites or old Google results may still use.
 * GitHub Pages can't do server redirects, so each gets a tiny page that forwards
 * instantly and tells Google the new address (canonical) without being listed itself.
 */
export const REDIRECTS: Record<string, string> = {
  aboutgeo: "/about/",
  "wooden-pallet-solutions": "/about/",
  contact: "/contact-geo-pallet/",
  geocontact: "/contact-geo-pallet/",
  products: "/custom-pallets-british-columbia/",
  geoproducts: "/custom-pallets-british-columbia/",
  services: "/pallet-supplier-british-columbia/",
  geoservices: "/pallet-supplier-british-columbia/",
  geoblogs: "/blogs-geopallet/",
  "custom-pallet-solutions": "/custom-pallets-british-columbia/",
  "wooden-pallets-british-columbia": "/custom-pallets-british-columbia/",
};
