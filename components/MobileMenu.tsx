"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/site";
import Icon from "./Icon";
import styles from "./Header.module.css";

/** Phone/tablet menu (up to 1024px): full-width panel, PRODUCTS expands below itself. */
export default function MobileMenu({ nav, phone }: { nav: NavItem[]; phone: { label: string; tel: string } }) {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so it closes by itself after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenOn(typeof v === "function" ? (v(open) ? pathname : null) : v ? pathname : null);
  const [sub, setSub] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "bars"} />
      </button>
      <div id="mobile-menu" className={`${styles.panel} ${open ? styles.panelOpen : ""}`} hidden={!open}>
        <ul>
          {nav.map((item) => (
            <li key={item.href}>
              {item.children ? (
                <>
                  <button type="button" className={styles.panelLink} aria-expanded={sub} onClick={() => setSub((v) => !v)}>
                    {item.label} <Icon name="chevronDown" className={sub ? styles.flip : undefined} />
                  </button>
                  {sub ? (
                    <ul className={styles.panelSub}>
                      <li>
                        <Link href={item.href}>All products</Link>
                      </li>
                      {item.children.flatMap((g) => g.items).map((it) => (
                        <li key={it.href}>
                          <Link href={it.href} onClick={() => setOpen(false)}>{it.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <Link href={item.href} className={styles.panelLink}>{item.label}</Link>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.panelActions}>
          <a href={`tel:${phone.tel}`} className="btn btn-gradient">
            Let&apos;s Talk <span className="btn-dot"><Icon name="arrowRight" /></span>
          </a>
          <Link href="/#form" className="btn btn-outline" onClick={() => setOpen(false)}>
            Get a Quote <span className="btn-dot"><Icon name="arrowRight" /></span>
          </Link>
        </div>
      </div>
    </>
  );
}
