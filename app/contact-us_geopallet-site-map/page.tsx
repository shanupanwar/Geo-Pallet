import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getBlogPosts } from "@/lib/posts";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { BUSINESS } from "@/lib/site";
import styles from "./sitemap.module.css";

export const metadata = pageMetadata({
  title: "Contact Us for Custom Made, Heat Treated, & Recycled Pallets",
  description:
    "Geo Pallet offers top-tier, customizable service for all your wooden and recycled pallet needs. Contact us for the best solutions.",
  path: "/contact-us_geopallet-site-map/",
});

type Item = { label: string; href: string; children?: Item[] };

export default function SiteMapPage() {
  const sections: { title: string; items: Item[] }[] = [
    { title: "Home", items: [{ label: "Overview of services and products", href: "/" }] },
    {
      title: "About Us",
      items: [
        { label: "Company History", href: "/about/" },
        { label: "Mission and Vision", href: "/about/" },
        { label: "Team", href: "/about/" },
      ],
    },
    {
      title: "Products",
      items: [
        {
          label: "Wooden Pallets",
          href: "/custom-pallets-british-columbia/",
          children: [
            { label: "Custom Pallets", href: "/custom-pallets-british-columbia/#custom" },
            { label: "Heat Treated Pallets", href: "/pallet-supplier-british-columbia/#heat" },
            { label: "Recycled Pallets", href: "/custom-pallets-british-columbia/#recycle" },
          ],
        },
        { label: "Other Products", href: "/custom-pallets-british-columbia/#Crates" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Pallet Repair", href: "/pallet-supplier-british-columbia/#repair" },
        { label: "Delivery Solutions", href: "/pallet-supplier-british-columbia/#delivery" },
      ],
    },
    { title: "Blogs", items: getBlogPosts().map((p) => ({ label: p.title, href: `/${p.slug}/` })) },
    {
      title: "Contact",
      items: [
        { label: "Contact Form", href: "/contact-geo-pallet/" },
        { label: "Pallet quote request", href: "/pallet-inquiry-forms/" },
      ],
    },
    {
      title: "Additional Pages",
      items: [
        { label: "Testimonials", href: "/about/" },
        { label: "Business Quality Policy", href: "/about/" },
        { label: "FAQ", href: "/contact-geo-pallet/" },
      ],
    },
  ];
  const render = (items: Item[]) => (
    <ul>
      {items.map((it) => (
        <li key={it.label}>
          <Link href={it.href}>{it.label}</Link>
          {it.children ? render(it.children) : null}
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <section className="section">
        <div className={`container ${styles.grid}`}>
          <h1 className={styles.h1}>Geo Pallet Sitemap</h1>
          <div className={styles.toggles}>
            {sections.map((s, i) => (
              <details key={s.title} open={i === 0}>
                <summary>{s.title}</summary>
                {render(s.items)}
              </details>
            ))}
            <div className="btn-row" style={{ marginTop: 30 }}>
              <a href={`tel:${BUSINESS.phones[0].tel}`} className="btn">+1 (604) 584-4368</a>
              <a href={`mailto:${BUSINESS.email}`} className="btn btn-ghost">Email Now</a>
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Site Map", path: "/contact-us_geopallet-site-map/" }])} />
    </>
  );
}
