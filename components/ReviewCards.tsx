import { GOOGLE_PROFILES, TESTIMONIALS, googleLinks, type Location } from "@/content/data/testimonials";
import Icon from "./Icon";
import styles from "./ReviewCards.module.css";

/**
 * Google reviews from both locations (Surrey + Langley), sliding continuously from right to left.
 * Hovering (or tapping / focusing) a review pauses it. People who ask for less motion get a still row.
 * Pure HTML + CSS: no JavaScript, nothing paid, no Google account needed.
 */
export default function ReviewCards() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS]; // second copy makes the loop seamless
  const locations = Object.keys(GOOGLE_PROFILES) as Location[];
  const total = locations.reduce((n, l) => n + GOOGLE_PROFILES[l].count, 0);
  return (
    <div className={styles.wrap}>
      {/* One quiet summary line; each location name opens its reviews on Google. */}
      <p className={styles.summary}>
        <Icon name="google" className={styles.g} />
        <span className={styles.stars} aria-hidden="true">★★★★★</span>
        <span>
          {total} Google reviews ·{" "}
          {locations.map((loc, i) => (
            <span key={loc}>
              {i > 0 ? " · " : ""}
              <a href={googleLinks(loc).reviews} target="_blank" rel="noopener" className={styles.loc}>
                {loc} {GOOGLE_PROFILES[loc].rating.toFixed(1)}
              </a>
            </span>
          ))}
        </span>
      </p>

      <div className={styles.viewport} tabIndex={0} aria-label="Customer reviews from Google (hover to pause)">
        <ul className={styles.track}>
          {loop.map((t, i) => (
            <li key={i} aria-hidden={i >= TESTIMONIALS.length ? true : undefined}>
              <figure className={styles.card}>
                <span className={styles.cardTop}>
                  <span className={styles.cardStars} aria-label="5 out of 5 stars">★★★★★</span>
                  <span className={styles.tag}>
                    <Icon name="google" /> {t.location}
                  </span>
                </span>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>
                  <span className={styles.avatar} aria-hidden="true">
                    {t.name.replace(/&/g, "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  {t.name}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
