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
    image: "/wp-content/uploads/2026/03/IMG_3008-1.jpeg",
    alt: "Geo Pallet truck delivering wooden pallets",
  },
  {
    icon: Hammer,
    title: "Pallet Repair",
    text: "Our pallet repair and pallet recycling services deliver prompt, dependable solutions that meet industry standards and help you save on costs.",
    href: "/pallet-supplier-british-columbia/#repair",
    image: "/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-12-at-5.42.32-AM-2-819x1024.jpeg",
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

/** Services: photo on top, then icon, title, text. The whole card is one link. */
export function ServiceCards() {
  return (
    <ul className={styles.services}>
      {SERVICES.map((s) => (
        <li key={s.title} className="reveal">
          <Link href={s.href} className={styles.service}>
            <span className={styles.photo}>
              <Image src={s.image} alt={s.alt} fill sizes="(max-width: 1024px) 100vw, 400px" />
            </span>
            <span className={styles.body}>
              <LineIcon icon={s.icon} />
              <h3 className={styles.title}>{s.title}</h3>
              <span className={styles.text}>{s.text}</span>
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

/** "Why choose us": three equal cards, gold line icon, soft border that glows on hover. */
export function ReasonCards() {
  return (
    <ul className={styles.reasons}>
      {REASONS.map((r) => (
        <li key={r.title} className={`${styles.reason} reveal`}>
          <LineIcon icon={r.icon} />
          <h3 className={styles.title}>{r.title}</h3>
          <p className={styles.text}>{r.text}</p>
        </li>
      ))}
    </ul>
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
