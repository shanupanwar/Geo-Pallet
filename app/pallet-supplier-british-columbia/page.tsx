import Image from "next/image";
import Link from "next/link";
import AnchorTiles from "@/components/AnchorTiles";
import { Eyebrow, PageHero, Testimonials } from "@/components/Blocks";
import CoverFlow from "@/components/CoverFlow";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata, serviceLd } from "@/lib/seo";
import styles from "./services.module.css";

export const metadata = pageMetadata({
  title: "Pallet Supplier in British Columbia | Geo Pallet Ltd.",
  description:
    "Quality wooden pallets supplied across Canada by Geo Pallet. Serving businesses throughout British Columbia, including Vancouver and nearby areas.",
  path: "/pallet-supplier-british-columbia/",
  image: "/wp-content/uploads/2026/03/IMG_3008-1.jpeg",
  imageAlt: "Pallet delivery service",
});

const TILES = [
  { href: "#delivery", src: "/wp-content/uploads/2026/03/IMG_3008-1.jpeg", alt: "Pallet delivery service", title: "Delivery Solutions" },
  { href: "#repair", src: "/wp-content/uploads/2026/03/Repair.jpg-e1775853615414.jpeg", alt: "Pallet repair", title: "Pallet Repair" },
  { href: "#heat", src: "/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-05-at-02.55.02-1.jpeg", alt: "Heat treated pallets", title: "Heat treated Pallets" },
  { href: "#choose", src: "/wp-content/uploads/2026/03/WhatsApp-Image-2025-08-07-at-16.02.47-1.jpeg", alt: "Wooden pallet supplier | Geo pallet Ltd", title: "Why Choose Us" },
  { href: "#gallery", src: "/wp-content/uploads/2026/04/WhatsApp-Image-2026-03-12-at-5.42.26-AM-1.jpeg", alt: "Pallet Gallery", title: "Pallet Gallery" },
];

const GALLERY = [
  "/wp-content/uploads/2026/04/WhatsApp-Image-2026-03-12-at-5.42.25-AM-2.jpeg",
  "/wp-content/uploads/2026/04/WhatsApp-Image-2026-03-12-at-5.42.25-AM.jpeg",
  "/wp-content/uploads/2026/04/WhatsApp-Image-2026-03-12-at-5.42.26-AM-1.jpeg",
  "/wp-content/uploads/2026/04/WhatsApp-Image-2026-03-12-at-5.42.31-AM-1.jpeg",
  "/wp-content/uploads/2026/04/WhatsApp-Image-2026-03-12-at-5.42.30-AM.jpeg",
].map((src, i) => ({ src, alt: `Wooden pallets at Geo Pallet Ltd. (photo ${i + 1})` }));

const WHY = [
  { icon: "/wp-content/uploads/2026/03/icons8-pricing-48.png", title: "Value for Money", text: <>Affordable pallets that deliver strength and performance helping businesses reduce costs without sacrificing durability.</> },
  {
    icon: "/wp-content/uploads/2026/03/icons8-example-50-1.png",
    title: "Tailor-made Strategies",
    text: (
      <>
        <Link href="/custom-pallets-british-columbia/">Custom pallet solutions</Link> aligned with your needs, improving handling efficiency &amp; performance.
      </>
    ),
  },
  { icon: "/wp-content/uploads/2026/03/icons8-goal-oriented-focus-50-1.png", title: "Customer-First Approach", text: <>Your needs come first. We provide dependable service, quick responses, and pallets built for long-term use.</> },
  { icon: "/wp-content/uploads/2026/03/icons8-good-quality-50-1.png", title: "Quality Assurance", text: <>Every pallet is checked to meet high standards so you receive a reliable wooden pallet supply you can count on.</> },
  { icon: "/wp-content/uploads/2026/03/icons8-team-goal-48.png", title: "Professional Support", text: <>Expert support to help with orders, logistics, and fast issue resolution exactly what you expect from trusted pallet suppliers.</> },
];

export default function ServicesPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Services", path: "/pallet-supplier-british-columbia/" }];
  return (
    <>
      <PageHero
        as="p"
        title="Our Services"
        intro={<p>End-to-end wooden pallet solutions: supply, repair, recovery, and delivery</p>}
      />
      <AnchorTiles tiles={TILES} label="Services on this page" />

      <section className="section">
        <div className="container narrow center reveal">
          <h1 className="h-md">Affordable Pallet Supplier</h1>
          <p className="lead">
            As an experienced pallet supplier, we provide affordable wooden pallets that deliver reliable strength for shipping, warehousing,
            and everyday operations. Our pallet supplier team helps you choose the right pallet style based on your load weight,
            forklift/pallet jack handling, and storage needs so you get the best value without sacrificing durability.
          </p>
        </div>
      </section>

      <section className="section" id="delivery" aria-labelledby="delivery-title">
        <div className="container split">
          <Image
            src="/wp-content/uploads/2024/05/BC-and-WA-geo-pallet-map.svg"
            alt="Map of Geo Pallet's delivery area in British Columbia and Washington"
            width={650}
            height={1024}
            className={styles.map}
          />
          <div className="reveal">
            <Eyebrow>Wooden Pallet Supplier</Eyebrow>
            <div className={styles.iconBox}>
              <span className={styles.boxIcon}><Icon name="truckFast" /></span>
              <div>
                <h2 id="delivery-title" className={styles.h3}>Delivery Solutions</h2>
                <p>
                  As a <Link href="/">wooden pallet supplier</Link> serving British Columbia, we provide pallet delivery across the Lower
                  Mainland and U.S. border areas. Our trucks are ideal for small to medium orders, ensuring timely and efficient service for
                  your business.
                </p>
              </div>
            </div>
            <div className={styles.iconBox}>
              <span className={styles.boxIcon}><Icon name="truck" /></span>
              <div>
                <h3 className={styles.h3}>Freight Options for Large Orders</h3>
                <p>
                  For larger orders, we can arrange freight pickup from our yard through trusted logistics partners. This gives businesses
                  seamless shipping support and dependable service from trusted pallet suppliers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="repair" aria-labelledby="repair-title">
        <div className="container split">
          <div className="reveal">
            <h2 id="repair-title" className={styles.h2}>
              <Icon name="hammer" className="gold" /> Pallet Repair
            </h2>
            <p>
              Maintaining wooden pallets properly is essential for any business. If pallets become damaged or worn, fast repairs help extend
              their lifespan, reduce replacement costs, and keep your operations running smoothly.
            </p>
            <h3 className={styles.h3}>Our Pallet Repair Process</h3>
            <ol className={styles.steps}>
              <li><Icon name="circleCheck" /> <span><strong>Inspection:</strong> Identify and assess pallet damage</span></li>
              <li><Icon name="circleCheck" /> <span><strong>Removal:</strong> Remove broken or weakened components</span></li>
              <li><Icon name="circleCheck" /> <span><strong>Replacement:</strong> Install strong materials to restore durability</span></li>
              <li><Icon name="circleCheck" /> <span><strong>Final Check:</strong> Confirm correct alignment, safety, and performance</span></li>
            </ol>
          </div>
          <Image
            src="/wp-content/uploads/2026/03/Repair-02.jpg.jpeg"
            alt="Wooden pallet being repaired at Geo Pallet"
            width={1920}
            height={2560}
            sizes="(max-width: 1024px) 100vw, 560px"
            className={styles.photo}
          />
        </div>
      </section>

      <section className="section" id="heat" aria-labelledby="heat-title">
        <div className="container split">
          <Image
            src="/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-05-at-02.55.02-1-819x1024.jpeg"
            alt="Heat treated pallets"
            width={819}
            height={1024}
            sizes="(max-width: 1024px) 100vw, 560px"
            className={styles.photo}
          />
          <div className="reveal">
            <h2 id="heat-title" className={styles.h2}>
              <Icon name="fire" className="gold" /> Heat Treated Pallets (ISPM-15 Compliant)
            </h2>
            <p>
              Geo Pallet Ltd. provides <strong>ISPM-15 compliant heat-treated pallets</strong> to help businesses ship internationally with
              fewer delays at the border. Heat treatment is required in global trade to reduce the risk of spreading wood pests through
              packaging materials. <strong>Our ISPM-15 process:</strong> We purchase <strong>pre-heat-treated lumber from certified mills</strong>{" "}
              and apply the <strong>HT stamp after the pallets are assembled</strong>, ensuring pallets are export-ready.
            </p>
            <h3 className={styles.h3}>Approved ISPM-15 treatment options include</h3>
            <ul className={styles.steps}>
              <li><Icon name="fire" /> <span><strong>Heat Treatment (HT):</strong> minimum 56°C core temperature for 30 minutes</span></li>
              <li><Icon name="leaf" /> <span><strong>Methyl Bromide (MB) fumigation</strong></span></li>
            </ul>
            <p>
              <strong>Note:</strong> ISPM-15 applies to both <strong>softwood (coniferous)</strong> and <strong>hardwood (non-coniferous)</strong>{" "}
              wood packaging materials.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="choose" aria-labelledby="choose-title">
        <div className="container narrow center reveal">
          <Eyebrow>Why Choose Us</Eyebrow>
          <h2 id="choose-title" className="h-md">Built on Quality. Backed by Service.</h2>
          <p>
            Quality and excellence drive everything we do from planning to final delivery. As industrial pallet suppliers, we don’t just
            provide pallets—we deliver consistent support, reliable supply, and long-term value for your business.
          </p>
        </div>
        <ul className={`container ${styles.why}`}>
          {WHY.map((w) => (
            <li key={w.title} className="reveal">
              <Image src={w.icon} alt="" width={50} height={50} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" id="gallery" aria-labelledby="gallery-title">
        <div className="container narrow center reveal">
          <Eyebrow>Pallets Gallery</Eyebrow>
          <h2 id="gallery-title" className="h-md">Experience wooden pallet at its best.</h2>
          <p>
            At <Link href="/about/">Geo Pallet Ltd</Link>, every project is a chance to make an impression. At Geo Pallet we demonstrate our
            dedication to providing premium, innovative pallet solutions. Moreover , our commitment to quality and excellence is unmatched.
          </p>
        </div>
        <CoverFlow images={GALLERY} />
      </section>

      <Testimonials intro="Customers drive our commitment to continuous improvement. On the whole , regular process reviews ensure compliance and consistently meet evolving needs with high-quality solutions." />

      <section className="section">
        <div className="container center reveal">
          <h2 className={styles.cta}>Your satisfaction is extremely important to us!</h2>
          <p className={styles.ctaSub}>
            Our <Link href="/contact-geo-pallet/">Contact Support</Link> is available 24/7
          </p>
          <Link href="/contact-geo-pallet/" className="btn">Talk to us</Link>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          serviceLd({ name: "Pallet delivery", description: "Pallet delivery across the Lower Mainland and U.S. border areas, plus freight options for large orders.", path: "/pallet-supplier-british-columbia/#delivery" }),
          serviceLd({ name: "Pallet repair", description: "Inspection, removal of broken parts, replacement with strong materials and a final safety check.", path: "/pallet-supplier-british-columbia/#repair" }),
          serviceLd({ name: "ISPM-15 heat treated pallets", description: "Export-ready pallets built from pre-heat-treated lumber from certified mills and HT-stamped after assembly.", path: "/pallet-supplier-british-columbia/#heat" }),
        ]}
      />
    </>
  );
}
