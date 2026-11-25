import Image from "next/image";
import Link from "next/link";
import { TESTIMONIALS } from "@/content/data/testimonials";
import quoteSchema from "@/content/forms/quote.json";
import Icon from "./Icon";
import SchemaForm, { type FormSchema } from "./SchemaForm";
import styles from "./Blocks.module.css";

/* Reusable page sections shared by several pages. All render as plain HTML (no JavaScript). */

export function Eyebrow({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "span" }) {
  return (
    <Tag className="eyebrow">
      <Icon name="pallet" /> {children}
    </Tag>
  );
}

export function ServiceCard({
  title,
  text,
  href,
  icon,
  image,
  imageAlt,
  headingLevel = 3,
}: {
  title: string;
  text: string;
  href: string;
  icon: string;
  image?: string;
  imageAlt?: string;
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <article className={`${styles.service} reveal`}>
      {image ? <Image src={image} alt={imageAlt || ""} fill sizes="(max-width: 1024px) 100vw, 410px" className={styles.serviceBg} /> : null}
      <div className={styles.serviceBody}>
        <span className={styles.serviceIcon}><Icon name={icon} /></span>
        <H className={styles.serviceTitle}>{title}</H>
        <p>{text}</p>
        <Link href={href} className="link-more">Service Details »</Link>
      </div>
    </article>
  );
}

export function FeatureBox({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className={`${styles.feature} reveal`}>
      <Image src={icon} alt="" width={50} height={50} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/** Auto-scrolling customer reviews (CSS only; pauses on hover and for people who prefer less motion). */
export function Testimonials({ intro }: { intro: string }) {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className={`section ${styles.testimonials}`} aria-labelledby="reviews-title">
      <div className={`container ${styles.testiGrid}`}>
        <div className="reveal">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 id="reviews-title" className="h-xl">Our success, echoed by our clients</h2>
          <p className="lead">{intro}</p>
        </div>
        <div className={styles.viewport} aria-label="Customer testimonials">
          <div className={styles.track}>
            {items.map((t, i) => (
              <figure key={i} className={styles.review} aria-hidden={i >= TESTIMONIALS.length ? true : undefined}>
                <div className={styles.stars} aria-label="5 out of 5 stars">★★★★★</div>
                <blockquote>{t.text}</blockquote>
                <figcaption>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Members() {
  const orgs = [
    { name: "Canadian Wood Pallet & Container Association", logo: "/wp-content/uploads/2024/05/cwcpa-logo-2.png", w: 115, h: 121, url: "https://www.canadianpallets.com" },
    { name: "National Wooden Pallet & Container Association", logo: "/wp-content/uploads/2025/12/NWPCA-Logo-600x132-1.webp", w: 600, h: 132, url: "https://www.palletcentral.com/page/AboutPalletDesign" },
  ];
  return (
    <section className={`section ${styles.members}`} aria-labelledby="members-title">
      <div className={`container ${styles.membersGrid}`}>
        <h2 id="members-title" className={`h-xl ${styles.membersTitle}`}>
          <Icon name="pallet" className="gold" /> Members of
        </h2>
        <div className={styles.memberCards}>
          {orgs.map((o) => (
            <div key={o.name} className={styles.member}>
              <Image src={o.logo} alt={`${o.name} logo`} width={o.w} height={o.h} className={styles.memberLogo} />
              <a href={o.url} target="_blank" rel="noopener" className="link-more">
                Visit Website »<span className="sr-only"> ({o.name})</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "Let's Get Moving" + "Get My Quote" form (Home page, anchor #form). */
export function QuoteSection() {
  return (
    <section className={`section ${styles.quote}`} id="form" aria-labelledby="quote-title">
      <div className="container narrow center reveal">
        <Eyebrow>Quote Now</Eyebrow>
        <h2 id="quote-title" className="h-md">Let’s Get Moving</h2>
        <p className="lead">We’ve got the inventory, the logistics, and the reliability you’ve been missing.</p>
      </div>
      <div className={`container narrow ${styles.quoteCard}`}>
        <p className={styles.quoteHead}>Get My Quote</p>
        <span className={styles.divider} aria-hidden="true" />
        <SchemaForm schema={quoteSchema as FormSchema} idPrefix="quote" />
      </div>
    </section>
  );
}

/** Page banner used on inner pages (big title + short intro). */
export function PageHero({
  title,
  intro,
  eyebrow,
  as: Tag = "h1",
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  eyebrow?: string;
  /** Use "p" when the page's main heading (H1) is further down. */
  as?: "h1" | "p";
}) {
  return (
    <section className={styles.hero}>
      <div className="container">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Tag className={styles.heroTitle}>{title}</Tag>
        {intro ? <div className={styles.heroIntro}>{intro}</div> : null}
      </div>
    </section>
  );
}

/** Visible breadcrumb trail (matches the BreadcrumbList structured data). */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.crumbs}>
      <ol>
        {items.map((it, i) => (
          <li key={it.path}>
            {i < items.length - 1 ? <Link href={it.path}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
