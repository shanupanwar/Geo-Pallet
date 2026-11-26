import Link from "next/link";
import { Eyebrow, FeatureBox, Members, QuoteSection, ServiceCard, Stat, Testimonials } from "@/components/Blocks";
import HeroVideo from "@/components/HeroVideo";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ProductTiles from "@/components/ProductTiles";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import styles from "./home.module.css";

export const metadata = pageMetadata({
  title: "High Quality Wooden Pallets in British Columbia | Geo Pallet Ltd",
  description:
    "Looking for wooden pallets in British Columbia? Geo Pallet provides custom pallets, heat treated pallets, and reliable pallet solutions with fast delivery.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <HeroVideo className={styles.heroMedia} />
        <div className={`container ${styles.heroText}`}>
          <h1 className={styles.h1}>
            <span className={styles.pre}>Trusted Source for a Wooden Pallet in British Columbia.</span>
            <span className={styles.main}>High-Performance Durability at a Competitive Price</span>
          </h1>
          <p className={styles.heroLead}>
            Operating out of Surrey and Langley, we build new and custom solutions tailored to your needs. As a local wooden
            pallet company, we obsess over the details so that your freight stays safe across British Columbia.
          </p>
          <Link href="/pallet-inquiry-forms/" className="btn btn-gradient">
            Get Started <span className="btn-dot"><Icon name="arrowRight" /></span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className={`container split ${styles.about}`}>
          <div className="reveal">
            <Eyebrow>About Us</Eyebrow>
            <h2 className="h-lg">
              <Link href="/about/">Reliable Wooden Pallets at a Fair Price</Link>
            </h2>
            <Link href="/about/" className="btn">Know More</Link>
          </div>
          <div className="reveal">
            <p className="lead">
              We deliver high-quality <strong>new pallets</strong> and <strong>custom wooden pallets</strong> designed to handle
              your specific load requirements. Based in <strong>Surrey</strong>, our <strong>wooden pallet company</strong> focuses
              on the small details to ensure your freight moves safely across BC.
            </p>
            <div className="grid grid-2">
              <Stat value="150k+" label="Completed Projects" />
              <Stat value="1,000+" label="Clients" />
            </div>
          </div>
        </div>
      </section>

      <section className={`section ${styles.products}`} aria-labelledby="products-title">
        <div className="container">
          <h2 id="products-title" className="h-md center">Explore Pallet Products</h2>
          <ProductTiles />
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="container">
          <div className={`split ${styles.servicesHead}`}>
            <div className="reveal">
              <Eyebrow>Our Services</Eyebrow>
              <h2 id="services-title" className="h-sm">Geo Pallet: Reliable Team &amp; Customized Solutions</h2>
            </div>
            <p className="lead reveal">
              <Link href="/pallet-supplier-british-columbia/">
                We customize our work to best serve you, offering reliable wooden pallets British Columbia tailored to your supply chain.
              </Link>
            </p>
          </div>
          <div className="grid grid-3">
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
        </div>
      </section>

      <section className={`section ${styles.quality}`}>
        <div className="container narrow center reveal">
          <Eyebrow>Quality That Performs</Eyebrow>
          <h2 className="h-md">Turning Your Shipping Needs into Reality.</h2>
          <p className="lead">
            We build custom wooden pallets that give your business a competitive edge. Our clients rely on our pallet manufacturer
            expertise for consistent quality, durable skids, and dependable support across Vancouver and Langley.
          </p>
        </div>
        <div className={`container grid grid-3 ${styles.features}`}>
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
      </section>

      <QuoteSection />

      <Testimonials intro="Customers drive our commitment to continuous improvement. On the whole , regular process reviews ensure compliance and consistently meet evolving needs with high-quality solutions." />

      <Members />

      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }])} />
    </>
  );
}
