import Image from "next/image";
import Link from "next/link";
import { GOOGLE_PROFILES, TESTIMONIALS, googleLinks, type Location } from "@/content/data/testimonials";
import { BadgeDollarSign, ClipboardList, Truck } from "lucide-react";
import Icon from "./Icon";
import QuoteForm from "./QuoteForm";
import styles from "./Blocks.module.css";

/* Reusable page sections shared by several pages. All render as plain HTML (no JavaScript). */

export { default as Eyebrow } from "./Eyebrow";
import Eyebrow from "./Eyebrow";

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

/**
 * Customer reviews: text + gold Google rating on the left, real Google reviews sliding slowly
 * upward on the right (pauses on hover). CSS only; people who prefer less motion get a still list.
 */
export function Testimonials({ intro, title = "Our success, echoed by our clients" }: { intro: string; title?: string }) {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  const locations = Object.keys(GOOGLE_PROFILES) as Location[];
  const total = locations.reduce((n, l) => n + GOOGLE_PROFILES[l].count, 0);
  return (
    <section className={`section ${styles.testimonials}`} aria-labelledby="reviews-title">
      <div className={`container ${styles.testiGrid}`}>
        <div className={`${styles.testiIntro} reveal`}>
          <Eyebrow>Testimonials</Eyebrow>
          <h2 id="reviews-title" className={styles.testiTitle}>{title}</h2>
          <p className={styles.testiLead}>{intro}</p>
          <div className={styles.rating}>
            <span className={styles.ratingTop}>
              <Icon name="google" className={styles.ratingG} />
              <span className={styles.ratingStars} aria-hidden="true">★★★★★</span>
              <strong>{total} Google reviews</strong>
            </span>
            <span className={styles.ratingLocs}>
              {locations.map((loc) => (
                <a key={loc} href={googleLinks(loc).reviews} target="_blank" rel="noopener" className={styles.ratingLoc}>
                  {loc} <b>{GOOGLE_PROFILES[loc].rating.toFixed(1)}</b>
                  <span className="sr-only"> stars, read reviews on Google</span>
                </a>
              ))}
            </span>
          </div>
        </div>
        <div className={styles.viewport} tabIndex={0} aria-label="Customer reviews from Google (hover to pause)">
          <div className={styles.track}>
            {items.map((t, i) => (
              <figure key={i} className={styles.review} aria-hidden={i >= TESTIMONIALS.length ? true : undefined}>
                <div className={styles.reviewTop}>
                  <span className={styles.stars} aria-label="5 out of 5 stars">★★★★★</span>
                  <span className={styles.reviewTag}>
                    <Icon name="google" /> {t.location}
                  </span>
                </div>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Members of": two compact association cards. The whole card is the link. */
export function Members({ title = "Members of", centered = false }: { title?: string; centered?: boolean }) {
  const orgs = [
    { short: "CWPCA", name: "Canadian Wood Pallet & Container Association", logo: "/wp-content/uploads/2024/05/cwcpa-logo-2.png", w: 115, h: 121, url: "https://www.canadianpallets.com" },
    { short: "NWPCA", name: "National Wooden Pallet & Container Association", logo: "/wp-content/uploads/2025/12/NWPCA-Logo-600x132-1.webp", w: 600, h: 132, url: "https://www.palletcentral.com/page/AboutPalletDesign" },
  ];
  return (
    <section className={`${styles.members} ${centered ? styles.membersCentered : ""}`} aria-labelledby="members-title">
      <div className={`container ${styles.membersGrid}`}>
        <div>
          <Eyebrow>Industry associations</Eyebrow>
          <h2 id="members-title" className={styles.membersTitle}>{title}</h2>
        </div>
        <ul className={styles.memberCards}>
          {orgs.map((o) => (
            <li key={o.name}>
              <a href={o.url} target="_blank" rel="noopener" className={styles.member}>
                <span className={styles.memberLogo}>
                  <Image src={o.logo} alt={`${o.name} logo`} width={o.w} height={o.h} />
                </span>
                <span className={styles.memberText}>
                  <strong>{o.short}</strong>
                  <span>{o.name}</span>
                  <span className={styles.memberLink}>
                    Visit website <Icon name="external" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Quote section (homepage, anchor #form): what happens in 3 simple steps, then the short form.
 * Focused on getting a price, not on contact details.
 */
export function QuoteSection({ title = "Let’s Get Moving" }: { title?: string }) {
  const steps = [
    { icon: ClipboardList, title: "Tell us what you need", text: "Pallet type, quantity and delivery area. It only takes a minute." },
    { icon: BadgeDollarSign, title: "Get your price", text: "Our team will contact you shortly with details." },
    { icon: Truck, title: "We deliver", text: "Pallet delivery across the Lower Mainland and U.S. border areas." },
  ];
  return (
    <section className={`section ${styles.quote}`} id="form" aria-labelledby="quote-title">
      <div className={`container ${styles.quoteWrap}`}>
        <div className={`${styles.quoteHeader} reveal`}>
          <Eyebrow>Quote Now</Eyebrow>
          <h2 id="quote-title" className={styles.quoteTitle}>{title}</h2>
          <p className={styles.quoteLead}>We’ve got the inventory, the logistics, and the reliability you’ve been missing.</p>
        </div>
        <ol className={styles.steps}>
          {steps.map((st, i) => (
            <li key={st.title} className="reveal">
              <span className={styles.stepIcon} aria-hidden="true">
                <st.icon strokeWidth={1.5} />
                <b>{i + 1}</b>
              </span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.quoteForm}>
          <QuoteForm />
        </div>
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
