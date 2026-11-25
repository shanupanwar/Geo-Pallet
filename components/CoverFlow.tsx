"use client";

import Image from "next/image";
import { useState } from "react";
import Icon from "./Icon";
import styles from "./CoverFlow.module.css";

/** "Pallets Gallery" photo carousel: the middle photo is large, neighbours fan out behind it. */
export default function CoverFlow({ images }: { images: { src: string; alt: string }[] }) {
  const [i, setI] = useState(0);
  const n = images.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  const pos = (k: number) => {
    let d = k - i;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };
  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Pallets gallery">
      <div className={styles.track}>
        {images.map((img, k) => {
          const d = pos(k);
          return (
            <figure
              key={img.src}
              className={styles.card}
              data-pos={Math.abs(d) > 2 ? "hidden" : d}
              aria-hidden={d !== 0}
              onClick={() => d !== 0 && setI(k)}
            >
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 1024px) 80vw, 560px" />
            </figure>
          );
        })}
      </div>
      <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Previous photo">
        <Icon name="chevronLeft" />
      </button>
      <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Next photo">
        <Icon name="chevronRight" />
      </button>
      <div className={styles.dots}>
        {images.map((img, k) => (
          <button key={img.src} type="button" aria-label={`Photo ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} />
        ))}
      </div>
    </div>
  );
}
