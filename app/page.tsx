import Link from "next/link";
import { Eyebrow, FeatureBox, Members, QuoteSection, ServiceCard } from "@/components/Blocks";
import HeroVideo from "@/components/HeroVideo";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ProductTiles from "@/components/ProductTiles";
import ReviewCards from "@/components/ReviewCards";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { BUSINESS, SITE_URL, absoluteUrl } from "@/lib/site";
import styles from "./home.module.css";

// Google title and description approved 2026-11-26.
export const metadata = pageMetadata({
  title: "Wooden Pallets in BC | Custom & Heat-Treated | Geo Pallet",
  description:
    "Wooden pallet manufacturer in Surrey & Langley, BC. New, custom, ISPM-15 heat-treated and recycled pallets, skids and crates, delivered across BC.",
  path: "/",
  image: "/video/geo-pallet-hero-poster.jpg",
  imageAlt: "3D wooden pallet by Geo Pallet Ltd.",
});

const TRUST = [
  { value: "150k+", label: "Completed projects" },
  { value: "1,000+", label: "Clients" },
  { value: "20+", label: "Years of experience" },
  { value: "99%", label: "Positive reviews" },
];

export default function HomePage() {
  return (
    <div className={styles.home}>
      {/* 1. Video + headline */}
      <section className={styles.hero} aria-labelledby="home-title">
        <HeroVideo className={styles.heroMedia} />
        <div className={`container ${styles.heroText}`}>
          <p className={styles.pre}>Trusted Source for a Wooden Pallet in British Columbia.</p>
          <h1 id="home-title" className={styles.h1}>High-Performance Wooden Pallets in British Columbia</h1>
          <p className={styles.tagline}>Durability at a competitive price</p>
          <p className={styles.heroLead}>
            Operating out of Surrey and Langley, we build new and custom solutions tailored to your needs. As a local wooden pallet
            company, we obsess over the details so that your freight stays safe across British Columbia.
          </p>
          <div className={styles.ctas}>
            <a href="#form" className="btn btn-gradient">
              Get a Quote <span className="btn-dot"><Icon name="arrowRight" /></span>
            </a>
            <a href="#products" className={styles.ghost}>
              View Products <Icon name="chevronDown" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Trust strip */}
      <section className="container" aria-label="Geo Pallet in numbers">
        <ul className={styles.trust}>
          {TRUST.map((t) => (
            <li key={t.label}>
              <strong>{t.value}</strong>
              <span>{t.label}</span>
            </li>
          ))}
        </ul>
      </section>

{/* 3. About */}
<section className={styles.block} aria-labelledby="about-title">
  <div className={`container ${styles.section}`}>
    <header className={`${styles.header} reveal`}>
      <Eyebrow>About Us</Eyebrow>
      <h2 id="about-title" className={styles.h2}>Your Local Wooden Pallet Company in Surrey, BC</h2>
      <p className={styles.sub}>
        We deliver high-quality <strong>new pallets</strong> and <strong>custom wooden pallets</strong> designed to handle your
        specific load requirements. Based in <strong>Surrey</strong>, our <strong>wooden pallet company</strong> focuses on the
        small details to ensure your freight moves safely across BC.
      </p>
    </header>
    <Link href="/about/" className="btn btn-ghost">Know More</Link>
  </div>
</section>

{/* 4. Products */}
<section className={styles.block} id="products" aria-labelledby="products-title">
  <div className={`container ${styles.section}`}>
    <header className={`${styles.header} reveal`}>
      <Eyebrow>Our Products</Eyebrow>
      <h2 id="products-title" className={styles.h2}>Explore Our Wooden Pallet Products</h2>
    </header>
    <ProductTiles />
    <Link href="/custom-pallets-british-columbia/" className="btn btn-ghost">View All Products</Link>
  </div>
</section>

{/* 5. Services */}
<section className={styles.block} aria-labelledby="services-title">
  <div className={`container ${styles.section}`}>
    <header className={`${styles.header} reveal`}>
      <Eyebrow>Our Services</Eyebrow>
      <h2 id="services-title" className={styles.h2}>Pallet Services Across British Columbia</h2>
      <p className={styles.sub}>
        We customize our work to best serve you, offering reliable wooden pallets British Columbia tailored to your supply chain.
      </p>
    </header>
    <div className={`grid grid-3 ${styles.full}`}>
      <ServiceCard
        icon="truck"
        title="Delivery Solutions"
        text="We provide reliable pallet delivery and pallet pickup to ensure your wooden pallets reach you on time across BC."
        href="/pallet-supplier-british-columbia/#delivery"
        image="/wp-content/uploads/2024/05/BC-and-WA-geo-pallet-map.svg"
        imageAlt="Map of pallet delivery across British Columbia and Washington"
      />
      <ServiceCard
        icon="hammer"
        title="Pallet Repair"
        text="Our pallet repair and pallet recycling services deliver prompt, dependable solutions that meet industry standards and help you save on costs."
        href="/pallet-supplier-british-columbia/#repair"
        image="/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-5.42.32-AM-2-819x1024.jpeg"
        imageAlt="Pallet repair services"
      />
      <ServiceCard
        icon="fire"
        title="Heat Treated Pallets"
        text="Our heat treated pallets are ISPM 15 pallets compliant, offering reliable protection for your export needs."
        href="/pallet-supplier-british-columbia/#heat"
      />
    </div>
    <Link href="/pallet-supplier-british-columbia/" className="btn btn-ghost">View All Services</Link>
  </div>
</section>

{/* 6. Why choose us */}
<section className={styles.block} aria-labelledby="why-title">
  <div className={`container ${styles.section}`}>
    <header className={`${styles.header} reveal`}>
      <Eyebrow>Quality That Performs</Eyebrow>
      <h2 id="why-title" className={styles.h2}>Why Businesses Choose Geo Pallet</h2>
      <p className={styles.sub}>
        We build custom wooden pallets that give your business a competitive edge. Our clients rely on our pallet manufacturer
        expertise for consistent quality, durable skids, and dependable support across Vancouver and Langley.
      </p>
    </header>
    <div className={`grid grid-3 ${styles.full}`}>
      <FeatureBox
        icon="/wp-content/uploads/2026/03/icons8-pricing-48.png"
        title="Competitive Pricing"
        text="We provide affordable, high-quality wooden pallets to ensure exceptional value for your business in Richmond."
      />
      <FeatureBox
        icon="/wp-content/uploads/2026/03/icons8-example-50-1.png"
        title="Tailored Custom Builds"
        text="Our expert team uses a hands-on approach to build new pallets that fit your specific warehouse and shipping dimensions."
      />
      <FeatureBox
        icon="/wp-content/uploads/2026/03/icons8-goal-oriented-focus-50-1.png"
        title="Customer-First Focus"
        text="Your needs come first, which is why we offer durable, custom-designed wooden pallets British Columbia built to last."
      />
    </div>
  </div>
</section>

{/* 7. Reviews */}
<section className={styles.block} aria-labelledby="reviews-title">
  <div className={`container ${styles.section}`}>
    <header className={`${styles.header} reveal`}>
      <Eyebrow>Testimonials</Eyebrow>
      <h2 id="reviews-title" className={styles.h2}>What Our Customers Say</h2>
      <p className={styles.sub}>
        Customers drive our commitment to continuous improvement. On the whole , regular process reviews ensure compliance and
        consistently meet evolving needs with high-quality solutions.
      </p>
    </header>
  </div>
  <ReviewCards />
</section>

      {/* 8. Short quote form (the detailed form is offered after sending) */}
      <QuoteSection title="Get a Free Pallet Quote" />

      {/* 9. Memberships */}
      <Members title="Industry Association Memberships" centered />

      {/* Phones: always-visible Call / Get a Quote bar */}
      <nav className={styles.actionBar} aria-label="Quick contact">
        <a href={`tel:${BUSINESS.phones[0].tel}`}>
          <Icon name="phone" /> Call
        </a>
        <a href="#form" className={styles.actionPrimary}>
          Get a Quote <Icon name="arrowRight" />
        </a>
      </nav>

      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", path: "/" }]),
          {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Geo Pallet wooden pallet",
            description: "3D animation of a Geo Pallet wooden pallet being assembled, board by board.",
            thumbnailUrl: absoluteUrl("/video/geo-pallet-hero-poster.jpg"),
            contentUrl: absoluteUrl("/video/geo-pallet-hero.mp4"),
            uploadDate: "2026-11-26",
            duration: "PT1M18S",
            publisher: { "@id": `${SITE_URL}/#business` },
          },
        ]}
      />
    </div>
  );
}
