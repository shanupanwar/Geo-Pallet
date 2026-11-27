import Image from "next/image";
import Link from "next/link";
import { BUSINESS, NAV } from "@/lib/site";
import Icon from "./Icon";
import HeaderScroll from "./HeaderScroll";
import MobileMenu from "./MobileMenu";
import NavLink from "./NavLink";
import styles from "./Header.module.css";

/** Site header: logo, text menu (gold underline on the current page), phone number and one Get a Quote button. */
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
                <NavLink href={item.href} className={styles.link}>
                  {item.label}
                  {item.children ? <Icon name="chevronDown" className={styles.caret} /> : null}
                </NavLink>
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
          <a href={`tel:${BUSINESS.phones[0].tel}`} className={styles.phone} aria-label={`Call ${BUSINESS.phones[0].label}`}>
            <Icon name="phone" className={styles.phoneIcon} />
            {BUSINESS.phones[0].label}
          </a>
          <Link href="/#form" className={styles.quote}>
            Get a Quote
          </Link>
        </div>

        <MobileMenu nav={NAV} phone={BUSINESS.phones[0]} />
      </div>
      <HeaderScroll />
    </header>
  );
}
