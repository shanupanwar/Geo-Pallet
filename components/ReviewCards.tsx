"use client";

import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "@/content/data/testimonials";
import Icon from "./Icon";
import styles from "./ReviewCards.module.css";

/**
 * Customer reviews as calm cards in a row. Swipe on phones, use the arrows (or trackpad / keyboard)
 * on computers. Nothing moves by itself.
 */
export default function ReviewCards() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth || 320) + 20), behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <p className={styles.score} aria-label={`Rated 5 out of 5 by ${TESTIMONIALS.length} customers`}>
          <span className={styles.stars} aria-hidden="true">★★★★★</span> 5.0 · {TESTIMONIALS.length} customer reviews
        </p>
        <div className={styles.arrows}>
          <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous reviews">
            <Icon name="chevronLeft" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label="More reviews">
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
      <ul ref={track} className={styles.track} tabIndex={0} aria-label="Customer reviews (scroll sideways)">
        {TESTIMONIALS.map((t) => (
          <li key={t.name}>
            <figure className={styles.card}>
              <span className={styles.cardStars} aria-hidden="true">★★★★★</span>
              <blockquote>“{t.text}”</blockquote>
              <figcaption>
                <span className={styles.avatar} aria-hidden="true">{t.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("")}</span>
                {t.name}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
