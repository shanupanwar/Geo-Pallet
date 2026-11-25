import Image from "next/image";
import styles from "./AnchorTiles.module.css";

/** Row of photo tiles that jump to sections further down the page (Services and Products banners). */
export default function AnchorTiles({ tiles, label }: { tiles: { href: string; src: string; alt: string; title?: string }[]; label: string }) {
  return (
    <nav aria-label={label} className={styles.wrap}>
      <ul className={styles.row}>
        {tiles.map((t) => (
          <li key={t.href}>
            <a href={t.href} className={styles.tile}>
              <Image src={t.src} alt={t.alt} fill sizes="(max-width: 1024px) 60vw, 260px" />
              {t.title ? <span>{t.title}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
