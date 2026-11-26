import { TESTIMONIALS } from "@/content/data/testimonials";
import styles from "./ReviewCards.module.css";

/**
 * Customer reviews sliding continuously from right to left. Hovering (or tapping / focusing) a
 * review pauses the slide so it can be read. People who ask their device for less motion get a
 * still row they can scroll sideways. Pure CSS: no JavaScript.
 */
export default function ReviewCards() {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS]; // second copy makes the loop seamless
  return (
    <div className={styles.wrap}>
      <p className={styles.score} aria-label={`Rated 5 out of 5 by ${TESTIMONIALS.length} customers`}>
        <span className={styles.stars} aria-hidden="true">★★★★★</span> 5.0 · {TESTIMONIALS.length} customer reviews
      </p>
      <div className={styles.viewport} tabIndex={0} aria-label="Customer reviews (hover to pause)">
        <ul className={styles.track}>
          {loop.map((t, i) => (
            <li key={i} aria-hidden={i >= TESTIMONIALS.length ? true : undefined}>
              <figure className={styles.card}>
                <span className={styles.cardStars} aria-hidden="true">★★★★★</span>
                <blockquote>“{t.text}”</blockquote>
                <figcaption>
                  <span className={styles.avatar} aria-hidden="true">
                    {t.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("")}
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
