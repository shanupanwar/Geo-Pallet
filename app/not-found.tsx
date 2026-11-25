import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow center" style={{ paddingBlock: "80px" }}>
        <p className="eyebrow">Error 404</p>
        <h1 className="h-lg">This page doesn&apos;t seem to exist.</h1>
        <p className="lead">It looks like the link pointing here was faulty. Try one of these pages instead.</p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: 24 }}>
          <Link href="/" className="btn">Home</Link>
          <Link href="/custom-pallets-british-columbia/" className="btn btn-ghost">Products</Link>
          <Link href="/contact-geo-pallet/" className="btn btn-ghost">Contact</Link>
        </div>
      </div>
    </section>
  );
}
