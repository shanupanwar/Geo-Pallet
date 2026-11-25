import Image from "next/image";
import Link from "next/link";
import { BUSINESS, NAV } from "@/lib/site";
import Icon from "./Icon";
import MobileMenu from "./MobileMenu";
import styles from "./Header.module.css";

/** Site header: logo, main menu with the Products dropdown, and the two call-to-action buttons. */
export default function Header() {
  return (
    <header className={styles.header} id="top">
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={`${BUSINESS.name} home`}>
          <Image src={BUSINESS.logo} alt={BUSINESS.name} width={144} height={55} priority />
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.menu}>
            {NAV.map((item) => (
              <li key={item.href} className={item.children ? styles.hasSub : undefined}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                  {item.children ? <Icon name="chevronDown" className={styles.caret} /> : null}
                </Link>
                {item.children ? (
                  <ul className={styles.sub}>
                    {item.children.map((group) => (
                      <li key={group.label} className={styles.group}>
                        <span className={styles.groupLabel}>
                          {group.label}
                          <Icon name="chevronDown" className={styles.caretSide} />
                        </span>
                        <ul className={styles.subsub}>
                          {group.items.map((it) => (
                            <li key={it.href}>
                              <Link href={it.href}>{it.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={`tel:${BUSINESS.phones[0].tel}`} className="btn btn-gradient">
            Let&apos;s Talk <span className="btn-dot"><Icon name="arrowRight" /></span>
          </a>
          <Link href="/#form" className="btn btn-outline">
            Get a Quote <span className="btn-dot"><Icon name="arrowRight" /></span>
          </Link>
        </div>

        <MobileMenu nav={NAV} phone={BUSINESS.phones[0]} />
      </div>
    </header>
  );
}
