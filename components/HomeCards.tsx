import { ArrowRight, BadgeDollarSign, CalendarCheck, Flame, Hammer, HeartHandshake, PackageCheck, Ruler, Star, Truck, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HomeCards.module.css";

/** Thin gold line icon in a soft circle: the one icon style used across the homepage. */
export function LineIcon({ icon: I, size = "md" }: { icon: LucideIcon; size?: "sm" | "md" }) {
  return (
    <span className={`${styles.icon} ${size === "sm" ? styles.iconSm : ""}`} aria-hidden="true">
      <I strokeWidth={1.5} />
    </span>
  );
}

const SERVICES = [
  {
    icon: Truck,
    title: "Delivery Solutions",
    text: "We provide reliable pallet delivery and pallet pickup to ensure your wooden pallets reach you on time across BC.",
    href: "/pallet-supplier-british-columbia/#delivery",
    image: "/wp-content/uploads/2026/03/geo-pallet-delivery-truck.jpeg",
    alt: "Geo Pallet truck delivering wooden pallets",
    warm: true, // bright blue sky photo: warmed and calmed to match the other two
  },
  {
    icon: Hammer,
    title: "Pallet Repair",
    text: "Our pallet repair and pallet recycling services deliver prompt, dependable solutions that meet industry standards and help you save on costs.",
    href: "/pallet-supplier-british-columbia/#repair",
    image: "/wp-content/uploads/2026/03/pallet-repair-worker-nail-gun-819x1024.jpeg",
    alt: "Worker repairing a wooden pallet",
  },
  {
    icon: Flame,
    title: "Heat Treated Pallets",
    text: "Our heat treated pallets are ISPM 15 pallets compliant, offering reliable protection for your export needs.",
    href: "/pallet-supplier-british-columbia/#heat",
    image: "/images/heat-treated-pallets-ispm-15-ht-stamp.webp",
    alt: "ISPM-15 HT stamp being printed on heat-treated wooden pallets",
  },
];

/** Services: one large photo card + two stacked ones; text sits on the photo. Whole card is the link. */
export function ServiceCards() {
  return (
    <ul className={styles.bento}>
      {SERVICES.map((s, i) => (
        <li key={s.title} className={`${i === 0 ? styles.bentoBig : ""} reveal`}>
          <Link href={s.href} className={`${styles.tile} ${"warm" in s && s.warm ? styles.warm : ""}`}>
            <Image src={s.image} alt={s.alt} fill sizes={i === 0 ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 1024px) 100vw, 520px"} />
            <span className={styles.tileBody}>
              <LineIcon icon={s.icon} size="sm" />
              <h3 className={styles.tileTitle}>{s.title}</h3>
              <span className={styles.tileText}>{s.text}</span>
              <span className={styles.more} aria-hidden="true">
                Learn more <ArrowRight strokeWidth={1.75} />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const REASONS = [
  { icon: BadgeDollarSign, title: "Competitive Pricing", text: "We provide affordable, high-quality wooden pallets to ensure exceptional value for your business in Richmond." },
  { icon: Ruler, title: "Tailored Custom Builds", text: "Our expert team uses a hands-on approach to build new pallets that fit your specific warehouse and shipping dimensions." },
  { icon: HeartHandshake, title: "Customer-First Focus", text: "Your needs come first, which is why we offer durable, custom-designed wooden pallets British Columbia built to last." },
];

/** "Why choose us": three columns in one row (icon + number, title, text), fine dividers, no boxes. */
export function ReasonCards() {
  return (
    <ol className={styles.reasons}>
      {REASONS.map((r, i) => (
        <li key={r.title} className={`${styles.reason} reveal`}>
          <span className={styles.reasonNo} aria-hidden="true">0{i + 1}</span>
          <LineIcon icon={r.icon} size="sm" />
          <div>
            <h3 className={styles.title}>{r.title}</h3>
            <p className={styles.text}>{r.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const TRUST = [
  { icon: PackageCheck, value: "150k+", label: "Completed projects" },
  { icon: Users, value: "1,000+", label: "Clients" },
  { icon: CalendarCheck, value: "20+", label: "Years of experience" },
  { icon: Star, value: "99%", label: "Positive reviews" },
];

/** Trust numbers under the video. */
export function TrustStrip() {
  return (
    <ul className={styles.trust}>
      {TRUST.map((t) => (
        <li key={t.label}>
          <LineIcon icon={t.icon} size="sm" />
          <span className={styles.trustText}>
            <strong>{t.value}</strong>
            <span>{t.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
