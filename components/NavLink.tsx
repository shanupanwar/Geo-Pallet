"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Menu link that marks itself as the current page (gold underline). */
export default function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const path = href.split("#")[0];
  const current = path === "/" ? pathname === "/" : pathname.startsWith(path);
  return (
    <Link href={href} className={className} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
