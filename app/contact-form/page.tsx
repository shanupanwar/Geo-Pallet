import { Eyebrow, Testimonials } from "@/components/Blocks";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import SchemaForm, { type FormSchema } from "@/components/SchemaForm";
import ProductTiles from "@/components/ProductTiles";
import contactFormSchema from "@/content/forms/contact-form.json";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import styles from "./contact-form.module.css";

export const metadata = pageMetadata({
  title: "Contact Geo Pallet | Pallet Supply & Service Inquiries",
  description:
    "Contact Geo Pallet about pallet supply, custom pallet requirements, delivery, or questions about our services across British Columbia.",
  path: "/contact-form/",
});

export default function ContactFormPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact form", path: "/contact-form/" }];
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <h1 className={styles.h1}>
              Providing 1000+ Businesses with Sustainable <span className={styles.circled}>Pallet Solutions</span>
            </h1>
            <p className={styles.across}>Across British Columbia</p>
            <p className={styles.heroText}>
              High-strength new and custom wooden pallets delivered directly from our manufacturing facilities. Serving Surrey, Langley, and
              the Lower Mainland with reliable Shipping solutions since 2007.
            </p>
          </div>
          <div className={styles.formCard} id="form">
            <h2 className={styles.formTitle}>Get My Quote</h2>
            <SchemaForm schema={contactFormSchema as FormSchema} idPrefix="cf" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="explore-title">
        <div className="container">
          <h2 id="explore-title" className="h-sm center">Explore Our Pallet Products</h2>
          <ProductTiles />
        </div>
      </section>

      <section className="section" aria-labelledby="gap-title">
        <div className="container split">
          <div className="reveal">
            <h2 id="gap-title" className="h-md">The Gap we Solve as Pallet Supplier Company</h2>
            <ul className={styles.list}>
              {["Inconsistent pallet quality", "Unreliable timelines and late deliveries", "Limited custom pallet solutions", "Weak customer support & slow responsiveness"].map((t) => (
                <li key={t}><Icon name="close" className={styles.x} /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <Eyebrow>What we offer:</Eyebrow>
            <ul className={styles.list}>
              {["Engineered Product Development", "Innovation Through Automation", "Improved Waste Control", "Smart Manufacturing Solutions"].map((t) => (
                <li key={t}><Icon name="circleCheck" className="gold" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Testimonials intro="Customers drive our commitment to continuous improvement. On the whole , regular process reviews ensure compliance and consistently meet evolving needs with high-quality solutions." />

      <section className="section">
        <div className="container center reveal">
          <h2 className="h-md">Let’s Get Moving</h2>
          <p className="lead">We’ve got the inventory, the logistics, and the reliability you’ve been missing.</p>
          <a href="#form" className="btn">Quote Now</a>
        </div>
      </section>

      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
