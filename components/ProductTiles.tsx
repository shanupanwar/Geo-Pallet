import Image from "next/image";
import Link from "next/link";
import { PRODUCT_TILES } from "@/content/data/products";
import Icon from "./Icon";
import styles from "./ProductTiles.module.css";

/**
 * "Explore Pallet Products" grid. No box around the pallets: on hover (or keyboard focus) the pallet
 * lifts with a soft gold spotlight underneath, the name turns gold and "View details" slides in.
 */
export default function ProductTiles({ headingLevel = 3 }: { headingLevel?: 3 | 4 }) {
  const H = `h${headingLevel}` as "h3" | "h4";
  return (
    <ul className={styles.tiles}>
      {PRODUCT_TILES.map((p) => (
        <li key={p.href} className="reveal">
          <Link href={p.href} className={styles.tile}>
            <span className={styles.stage}>
              <Image src={p.image} alt={p.alt} width={534} height={284} sizes="(max-width: 600px) 45vw, (max-width: 1024px) 45vw, 300px" />
            </span>
            <H className={styles.name}>{p.title.replace(/-/g, " ")}</H>
            <span className={styles.more} aria-hidden="true">
              View details <Icon name="arrowRight" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
