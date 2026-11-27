import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/site";
import Icon from "./Icon";
import NewsletterForm from "./NewsletterForm";
import styles from "./Footer.module.css";

/** Footer: brand + social, updates link, contact details, newsletter; slim bottom bar. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.cols}`}>
        <div className={styles.brand}>
          <Link href="/" aria-label={`${BUSINESS.name} home`}>
            <Image src={BUSINESS.logo} alt={BUSINESS.name} width={174} height={66} />
          </Link>
          <p className={styles.tagline}>{BUSINESS.tagline}</p>
          <ul className={styles.social}>
            {BUSINESS.social.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${BUSINESS.shortName} on ${s.name}`}>
                  <Icon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className={styles.title}>Updates</h2>
          <ul className={styles.links}>
            <li>
              <Link href="/announcements/">Announcements &amp; Updates</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={styles.title}>Contact Info</h2>
          <address className={styles.list}>
            {BUSINESS.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`}><Icon name="phone" /> {p.label}</a>
            ))}
            <a href={`mailto:${BUSINESS.email}`}><Icon name="envelope" /> {BUSINESS.email}</a>
            {BUSINESS.locations.map((l) => (
              <span key={l.id}><Icon name="location" /> {l.display}</span>
            ))}
            <span><Icon name="clockRegular" /> {BUSINESS.hoursText}</span>
          </address>
        </div>

        <div>
          <h2 className={styles.title}>Newsletter</h2>
          <p className={styles.small}>Sign up for my newsletter to get latest updates. Do not worry, we will never spam you.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomRow}`}>
          <p>© {new Date().getFullYear()} {BUSINESS.name} All rights reserved.</p>
          <Link href="/contact-us_geopallet-site-map/">Site Map</Link>
        </div>
      </div>
    </footer>
  );
}
