import Link from "next/link";
import { Eyebrow, Members, QuoteSection, Testimonials } from "@/components/Blocks";
import HeroVideo from "@/components/HeroVideo";
import { ReasonCards, ServiceCards, TrustStrip } from "@/components/HomeCards";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ProductTiles from "@/components/ProductTiles";
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
      <section className={styles.trustBand} aria-label="Geo Pallet in numbers">
        <div className="container">
          <TrustStrip />
        </div>
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
          <Link href="/about/" className="btn btn-ghost">Our Story</Link>
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
          <ServiceCards />
        </div>
      </section>

      {/* 6. Why choose us: centered heading, three reasons in one row */}
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
          <ReasonCards />
        </div>
      </section>

      {/* 7. Reviews: text + gold Google rating left, Google reviews sliding upward right */}
      <Testimonials
        title="What Our Customers Say"
        intro="Customers drive our commitment to continuous improvement. On the whole , regular process reviews ensure compliance and consistently meet evolving needs with high-quality solutions."
      />

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
