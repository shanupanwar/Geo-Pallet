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
  return (
    <div className={styles.wrap}>
      <ul className={styles.badges} aria-label="Google ratings for both locations">
        {locations.map((loc) => {
          const p = GOOGLE_PROFILES[loc];
          const l = googleLinks(loc);
          return (
            <li key={loc} className={styles.badge}>
              <Icon name="google" className={styles.g} />
              <span className={styles.badgeText}>
                <strong>{loc}</strong>
                <span>
                  <span className={styles.stars} aria-hidden="true">★★★★★</span> {p.rating.toFixed(1)} · {p.count} Google reviews
                </span>
              </span>
              <span className={styles.badgeLinks}>
                <a href={l.reviews} target="_blank" rel="noopener">
                  Read<span className="sr-only"> {loc} reviews on Google</span>
                </a>
                <a href={l.write} target="_blank" rel="noopener">
                  Write a review<span className="sr-only"> for {loc}</span>
                </a>
              </span>
            </li>
          );
        })}
      </ul>

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
                  <span>
                    {t.name}
                    <small>Google review · {t.location}</small>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
