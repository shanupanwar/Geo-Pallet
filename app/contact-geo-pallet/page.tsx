import Image from "next/image";
import { Eyebrow } from "@/components/Blocks";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import SchemaForm, { type FormSchema } from "@/components/SchemaForm";
import { FAQ } from "@/content/data/faq";
import contactSchema from "@/content/forms/contact.json";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { BUSINESS } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact Geo Pallet Ltd. | 24/7 Support and Office Locations",
  description:
    "Contact Geo Pallet for all your pallet needs. Visit our Surrey office or contact our Langley team for custom pallets, repairs, and more.",
  path: "/contact-geo-pallet/",
});

const mapSrc = (q: string) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`;

export default function ContactPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact-geo-pallet/" }];
  const [surrey, langley] = BUSINESS.locations;
  return (
    <>
      <section className={styles.top}>
        <div className={`container ${styles.topGrid}`}>
          <div>
            <Eyebrow>Contact Us</Eyebrow>
            <h1 className="h-xl">Get in Touch</h1>
            <p className="lead">
              Looking to contact Geo Pallet Ltd.? Whether you need support, have questions, or want a quote, our team is here to help reach us
              via the form or visit our Surrey or Langley offices.
            </p>
            <h2 className={styles.h2}>
              Call us anytime!
              <br /> Our contact support is available 24 / 7
            </h2>
            <p>
              At Geo Pallet Ltd., keeping our customers happy is always our priority. Our support team is available 24/7 to help with quotes,
              delivery scheduling, and any pallet questions. Feel free to reach out anytime!
            </p>
            <ul className={styles.boxes}>
              <li>
                <a href={`tel:${BUSINESS.phones[0].tel}`}>
                  <Image src="/wp-content/uploads/2024/05/phone-call.png" alt="" width={64} height={64} />
                  <strong>+1 (604) 584-4368</strong>
                  <span>Talk to an expert</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`}>
                  <Image src="/wp-content/uploads/2024/05/email.png" alt="" width={64} height={64} />
                  <strong>{BUSINESS.email}</strong>
                  <span>Send an email</span>
                </a>
              </li>
              <li>
                <div>
                  <Image src="/wp-content/uploads/2024/05/event.png" alt="" width={64} height={64} />
                  <strong>{BUSINESS.hoursText}</strong>
                  <span>Business Hour</span>
                </div>
              </li>
              <li>
                <address>
                  <Icon name="location" className={styles.pin} />
                  <span>Surrey Office: {surrey.street} {surrey.city}, BC Canada {surrey.postalCode}</span>
                  <span>Langley Office: {langley.street}, {langley.city}, BC {langley.postalCode}</span>
                </address>
              </li>
            </ul>
          </div>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Get Free Quote</h2>
            <SchemaForm schema={contactSchema as FormSchema} idPrefix="contact" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="locations-title">
        <div className="container narrow center reveal">
          <Eyebrow>Visit Us Nearby</Eyebrow>
          <h2 id="locations-title" className="h-md">Our Locations</h2>
          <p>
            Visit our <strong>Surrey Office </strong> for quick assistance with pallet solutions our experienced team is ready to help. Our{" "}
            <strong>Langley Office</strong> serves customers across the region, offering custom pallets, repairs, and more contact us for fast
            and reliable service.
          </p>
        </div>
        <div className={`container grid grid-2 ${styles.maps}`}>
          {[
            { title: "LANGLEY Office", loc: langley, q: `Geo Pallet Ltd, ${langley.street}, ${langley.city}, BC ${langley.postalCode}` },
            { title: "SURREY Office", loc: surrey, q: `Geo Pallet Ltd, ${surrey.street}, Surrey, BC ${surrey.postalCode}` },
          ].map((m) => (
            <div key={m.title} className={styles.map}>
              <iframe src={mapSrc(m.q)} title={`Map: Geo Pallet Ltd. ${m.title}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <h3>{m.title}</h3>
              <p>{m.loc.display.replace(/^\w+: /, "")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <div className="reveal">
            <h2 id="faq-title" className="h-md">Frequently Asked Questions</h2>
            <p>Find quick answers to common questions about our pallet products, services, and support.</p>
            <a href={`tel:${BUSINESS.phones[0].tel}`} className="btn">Contact sales</a>
          </div>
          <div className={styles.faq}>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>
                  <h3>{f.q}</h3>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />
    </>
  );
}
