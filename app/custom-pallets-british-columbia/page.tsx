import Image from "next/image";
import Link from "next/link";
import AnchorTiles from "@/components/AnchorTiles";
import { Eyebrow, PageHero } from "@/components/Blocks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import styles from "./products.module.css";

export const metadata = pageMetadata({
  title: "Custom Pallets in British Columbia | Built for Your Load",
  description:
    "Looking for custom pallets in British Columbia? Geo Pallet provides durable wooden pallets to your exact size, load and shipping requirements across BC.",
  path: "/custom-pallets-british-columbia/",
  image: "/wp-content/uploads/2026/02/custom-pallet-1.png",
  imageAlt: "Custom wooden pallet",
});

const U = "/wp-content/uploads";
const TILES = [
  { href: "#twoway", src: `${U}/2025/12/2-IE-Way.jpg`, alt: "2-way pallet" },
  { href: "#4way", src: `${U}/2025/12/4-Way-1.jpg`, alt: "4-way pallet" },
  { href: "#skid", src: `${U}/2025/12/Skid-2.jpg`, alt: "Skid pallet" },
  { href: "#wing", src: `${U}/2025/12/Wing-1.jpg`, alt: "Wing pallet" },
  { href: "#block", src: `${U}/2025/12/Blockh.jpg`, alt: "Block pallet" },
  { href: "#custom", src: `${U}/2025/12/Custom-1.jpg`, alt: "Custom pallet" },
  { href: "#Crates", src: `${U}/2025/12/Crate-1.jpg`, alt: "Wooden crate" },
  { href: "#crib", src: `${U}/2025/12/Cribing-1.jpg`, alt: "Wood cribbing" },
  { href: "#grade1", src: `${U}/2025/12/Grade-A-1.jpg`, alt: "Grade A recycled pallet" },
  { href: "#grade2", src: `${U}/2025/12/Grade-B-1.jpg`, alt: "Grade B recycled pallet" },
];

type Product = {
  id: string;
  title: string;
  level?: 2 | 3;
  body: React.ReactNode;
  image?: { src: string; alt: string; w: number; h: number };
  readMore?: string;
  order?: string;
  /** Short description for Google's product list. */
  summary: string;
};

const ORDER = (v: string) => `/pallet-inquiry-forms/?selected=${v}`;

const PRODUCTS: Product[] = [
  {
    id: "custom",
    title: "1. Custom Pallets for Every Industry",
    summary: "Custom wooden pallets in any size, from 1’ x 2’ up to 8’ x 30’, including heat treated ISPM 15 export pallets.",
    image: { src: `${U}/2026/02/custom-pallet-1.png`, alt: "Custom wooden pallet", w: 2560, h: 1280 },
    readMore: "/custom-pallets-made-to-your-load/",
    body: (
      <>
        <p>
          Our custom pallets are built for products that don’t fit standard sizes or need extra support during storage and transport. We
          manufacture custom wooden pallets for manufacturing, agriculture, logistics, construction, retail, food production, and export
          shipping.
        </p>
        <p>Common sizes include 48” x 40”, 42” x 42”, 36” x 36”,</p>
        <ul className={styles.ticks}>
          <li>Large wooden pallets up to 8’ x 30’</li>
          <li>Small wooden pallets as compact as 1’ x 2’</li>
        </ul>
        <p>We also build heat treated custom pallets, ISPM 15 pallets, export skids, heat-treated crates, boxes, and export pallets for international shipping.</p>
      </>
    ),
  },
  {
    id: "stringer",
    title: "2. Stringer Wooden Pallets",
    summary: "Stringer pallets with parallel stringers supporting the deck boards, in 2-way and 4-way entry styles.",
    image: { src: `${U}/2024/04/Screenshot-2024-04-30-at-11.04.20-AM-1024x765.png`, alt: "Two Way Pallet side view", w: 1024, h: 765 },
    body: (
      <>
        <p>
          Stringer wooden pallets are one of the most common choices for shipping and warehouse use. They are built with parallel stringers
          that support the deck boards, giving the pallet a solid structure for regular handling and storage. These wooden shipping pallets
          can be made in different sizes and load capacities depending on what your business needs. They are available in both 2-way and
          4-way entry styles, making them useful for many warehouse layouts and forklift setups.
        </p>
        <p>
          As a custom <Link href="/pallet-supplier-british-columbia/">pallet manufacturer</Link>, we can adjust the lumber, spacing, size, and
          strength of stringer pallets to match your products and shipping process.
        </p>
      </>
    ),
  },
  {
    id: "twoway",
    title: "Two-Way Stringer Wooden Pallet",
    summary: "Two-way stringer pallets with forklift entry from the front and back, also available as reversible pallets.",
    image: { src: `${U}/2025/02/2-Way-Pallet-1024x512.png`, alt: "Two-way stringer pallet", w: 1024, h: 512 },
    readMore: "/2-way-pallets/",
    order: ORDER("2+Way+Pallet"),
    body: (
      <>
        <p>
          A <Link href="/2-way-pallets/">two-way stringer wooden pallet</Link> allows forklift entry from the front and back. This makes it a
          simple and dependable option for businesses that need straightforward handling and storage.
        </p>
        <p>
          Two-way pallets are often used when products move in a set direction through the warehouse. They can also be built as reversible
          pallets with deck boards on both sides, giving extra support when stacking heavier loads.
        </p>
      </>
    ),
  },
  {
    id: "4way",
    title: "Four-Way Stringer Wooden Pallet",
    summary: "Four-way stringer pallets with notched stringers for forklift entry from all four sides.",
    image: { src: `${U}/2025/02/4-Way-Pallet-1024x512.png`, alt: "Four-way stringer pallet", w: 1024, h: 512 },
    readMore: "/4-way-pallets/",
    order: ORDER("4+Way+Pallet"),
    body: (
      <>
        <p>
          A <Link href="/4-way-pallets/">four-way stringer wooden pallet</Link> includes notches in the stringers so forklifts can enter from
          all four sides. This makes handling easier, especially in busy warehouses where speed and flexibility matter.
        </p>
        <p>
          Four-way pallets help improve movement during loading, unloading, and storage. Businesses in Surrey and Vancouver often choose this
          style when they need better forklift access and smoother warehouse flow.
        </p>
      </>
    ),
  },
  {
    id: "block",
    title: "3-Block Wooden Pallets",
    summary: "Heavy-duty block pallets with solid blocks between the decks and four-way forklift access.",
    image: { src: `${U}/2025/02/Block-Pallet.png`, alt: "Heavy-duty block pallet with four-way forklift access for industrial use.", w: 1920, h: 1080 },
    readMore: "/block-pallets/",
    order: ORDER("Block+Pallet"),
    body: (
      <p>
        Block wooden pallets are built with solid blocks between the top and bottom deck boards. This design gives the pallet strong support
        and allows forklift access from all four sides. Block pallets are a good choice for heavier loads, warehouse racking, and industrial
        shipping. They offer better stability than many basic pallet styles and are often used when products need extra support during
        transport. Many companies looking for heavy duty pallets choose block designs because they offer strong weight distribution and
        long-lasting performance.
      </p>
    ),
  },
  {
    id: "wing",
    title: "4-Wing Wooden Pallets",
    summary: "Single-wing and double-wing pallets with extended deck boards for wider or uneven loads.",
    image: { src: `${U}/2025/02/Wing-Pallet.png`, alt: "Single-wing and double-wing pallets with extended deck boards for load stability.", w: 1920, h: 1080 },
    readMore: "/wing-pallets/",
    order: ORDER("Wing+Pallet"),
    body: (
      <p>
        Wing wooden pallets are available in single-wing and double-wing styles. A single-wing pallet has deck boards that extend beyond the
        stringers or blocks on the top only, while a double-wing pallet extends on both the top and bottom. This extra surface area helps
        support wider or uneven loads. Wing pallets are often used in industries such as automotive, metal, electronics, and manufacturing.
        For better forklift access, wing pallets can also be built with notched stringers. Businesses in Langley and Richmond often use this
        style for products that need more surface support during shipping.
      </p>
    ),
  },
  {
    id: "skid",
    title: "5-Wooden Skids",
    summary: "Wooden skids without bottom deck boards for heavy machinery and equipment.",
    image: { src: `${U}/2025/02/Skid-PAllet.png`, alt: "Wooden skid without bottom deck boards for heavy machinery transport.", w: 1920, h: 1080 },
    readMore: "/wooden-skids/",
    order: ORDER("Skid+Pallet"),
    body: (
      <p>
        Wooden skids are a simple and useful alternative to traditional pallets. They are built with parallel stringers and top deck boards,
        but they do not have bottom deck boards. Because of this design, skids are mainly used for horizontal movement rather than stacking.
        They work well for heavy machinery, equipment, temporary platforms, and industrial products that need stable ground support. Skids are
        often used in construction, manufacturing, and equipment transport where strength matters more than standard pallet stacking.
      </p>
    ),
  },
  {
    id: "crib",
    title: "6-Wood Cribbing",
    summary: "Wood cribbing for equipment lifting, rigging, machinery support and emergency response.",
    image: { src: `${U}/2025/12/crib.png`, alt: "Wood cribbing", w: 2182, h: 1908 },
    readMore: "/wood-cribbing/",
    order: ORDER("Cribbing"),
    body: (
      <p>
        Wood cribbing is used when strong, stable support is needed for heavy loads, equipment, or structural work. While cribbing is not a
        pallet, it plays an important role in industrial and construction settings. It is commonly used for equipment lifting, rigging,
        machinery support, emergency response, and maintenance work. Our wood cribbing is built to provide clean, secure, and dependable
        support where safety and stability matter. Businesses in Coquitlam and nearby industrial areas often use cribbing for heavy-duty
        support applications.
      </p>
    ),
  },
  {
    id: "Crates",
    title: "7. Wooden Crates & Boxes",
    summary: "Heat-treated ISPM-15 wooden crates and boxes for bulky, fragile or high-value shipments.",
    image: { src: `${U}/2025/02/Crate-PAllet.png`, alt: "Wooden Crates", w: 2000, h: 1000 },
    readMore: "/wooden-crates-boxes/",
    body: (
      <p>
        Our wooden crates and boxes are built for businesses that need extra product protection during shipping. They are especially useful
        for bulky, fragile, or high-value items that need more coverage than a regular pallet can provide. We build crates and boxes using
        heat-treated ISPM-15 compliant wood, making them suitable for international shipping. These packaging solutions help protect products
        from moisture, rough handling, and pressure during transportation. Our crates are strong, stackable, and designed to make better use of
        space in warehouses and shipping containers. They are a practical option for companies shipping machinery, equipment, parts, and export
        goods.
      </p>
    ),
  },
  {
    id: "recycle",
    title: "8-Recycled Wooden Pallets",
    summary: "Inspected and repaired recycled pallets, including heat-treated export-ready options.",
    image: { src: `${U}/2024/05/Recycle.webp`, alt: "Recycled wooden pallets", w: 1024, h: 1024 },
    readMore: "/recycled-wooden-pallets/",
    body: (
      <>
        <p>
          Recycled wooden pallets are a smart option for businesses that want to reduce costs and cut down on waste. Each pallet is inspected
          and repaired before being reused, making it a practical choice for many warehouse and shipping needs.
        </p>
        <p>
          These pallets are often more affordable than new pallets and may be available faster depending on inventory. Heat-treated recycled
          options are also available for businesses that need export-ready pallets. Our pallet recycling service helps keep usable wood in
          circulation while giving businesses a lower-cost pallet option.
        </p>
      </>
    ),
  },
  {
    id: "grade1",
    title: "Grade A Recycled Wooden Pallet (#1)",
    level: 3,
    summary: "Grade A recycled pallets restored to near-new condition for food, pharmaceutical and retail use.",
    image: { src: `${U}/2025/09/Grade-A-final-output-e1757573773530.png`, alt: "Grade A recycled pallet restored for food and pharmaceutical industries.", w: 1440, h: 810 },
    readMore: "/grade-a-recycled-wooden-pallet-1/",
    body: (
      <p>
        Grade A recycled wooden pallets are restored to near-new condition. They usually have fewer marks, cleaner boards, and better overall
        appearance compared to lower-grade recycled pallets. These pallets are a good choice for food production, pharmaceuticals, retail, and
        other industries where appearance and cleanliness matter more. They offer a nice balance of quality, strength, and savings.
      </p>
    ),
  },
  {
    id: "grade2",
    title: "Grade B Recycled Wooden Pallet (#2)",
    level: 3,
    summary: "Grade B recycled pallets repaired for strength: a cost-effective choice when appearance matters less.",
    image: { src: `${U}/2026/06/ChatGPT-Image-Jun-24-2026-11_18_17-AM.png`, alt: "Grade B recycled wooden pallet", w: 1536, h: 1024 },
    readMore: "/grade-b-recycled-wooden-pallet-2/",
    body: (
      <p>
        Grade B recycled wooden pallets are repaired for strength and usability, but they may show more visible wear. They are still useful for
        many warehouse, logistics, and manufacturing applications. These pallets are a cost-effective option when appearance is not the main
        concern. For businesses focused on performance and budget, Grade B pallets are often a practical choice.
      </p>
    ),
  },
];

export default function ProductsPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Products", path: "/custom-pallets-british-columbia/" }];
  return (
    <>
      <PageHero as="p" title="Our Products" intro={<p>Your Trusted Choice for Custom Pallets in British Columbia</p>} />
      <AnchorTiles tiles={TILES} label="Product types on this page" />

      <section className="section" id="new">
        <div className="container narrow center reveal">
          <Eyebrow>Explore our Products</Eyebrow>
          <h1 className="h-lg">Custom Pallets in British Columbia</h1>
          <p className="lead">
            We build strong and reliable custom pallets for businesses that need practical shipping, storage, and handling solutions. Our
            pallets are made for everyday use in busy logistics environments. Whether your business is moving products locally or preparing
            shipments for export, we focus on strength, consistency, and dependable performance. We proudly serve businesses in Surrey,
            Vancouver, Langley, Richmond, and Coquitlam, along with other areas across British Columbia.
          </p>
        </div>
      </section>

      {PRODUCTS.map((p, i) => {
        const H = `h${p.level || 2}` as "h2" | "h3";
        return (
          <section key={p.id} id={p.id} className={styles.product} aria-labelledby={`${p.id}-title`}>
            <div className={`container split ${i % 2 ? styles.flip : ""}`}>
              <div className="reveal">
                <H id={`${p.id}-title`} className={styles.title}>{p.title}</H>
                <div className={styles.body}>{p.body}</div>
                {p.readMore || p.order ? (
                  <div className="btn-row">
                    {p.readMore ? (
                      <Link href={p.readMore} className="btn">
                        Read More<span className="sr-only"> about {p.title.replace(/^[\d.\- ]+/, "")}</span>
                      </Link>
                    ) : null}
                    {p.order ? (
                      <Link href={p.order} className="btn btn-ghost">
                        Order Now<span className="sr-only">: {p.title.replace(/^[\d.\- ]+/, "")}</span>
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {p.image ? (
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={p.image.w}
                  height={p.image.h}
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className={styles.image}
                />
              ) : null}
            </div>
          </section>
        );
      })}

      <section className="section">
        <div className="container center reveal">
          <h2 className="h-sm">Your satisfaction is extremely important to us!</h2>
          <p className={styles.support}>Our Contact Support is available 24/7</p>
          <Link href="/contact-geo-pallet/" className="btn">Talk to us</Link>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "Wooden pallets, skids, crates and cribbing",
            url: absoluteUrl("/custom-pallets-british-columbia/"),
            provider: { "@id": `${SITE_URL}/#business` },
            itemListElement: PRODUCTS.map((p) => ({
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              areaServed: "British Columbia",
              itemOffered: {
                "@type": "Product",
                name: p.title.replace(/^[\d.\- ]+/, ""),
                description: p.summary,
                url: absoluteUrl(`/custom-pallets-british-columbia/#${p.id}`),
                ...(p.image ? { image: absoluteUrl(p.image.src) } : {}),
              },
            })),
          },
        ]}
      />
    </>
  );
}
