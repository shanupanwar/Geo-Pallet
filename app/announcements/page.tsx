import Link from "next/link";
import { Eyebrow } from "@/components/Blocks";
import { pageMetadata } from "@/lib/seo";

/**
 * Announcements & Updates (planned 2026-11-28). Placeholder until the first announcement is added:
 * hidden from Google (noindex) and left out of the sitemap so an empty page never shows in search.
 * When real updates are added, remove `noindex` and the "geo-sitemap: exclude" tag, and add the page
 * to lib/pages.ts.
 */
export const metadata = {
  ...pageMetadata({
    title: "Announcements & Updates | Geo Pallet Ltd.",
    description: "News, product updates and announcements from Geo Pallet Ltd., wooden pallet manufacturer in Surrey and Langley, BC.",
    path: "/announcements/",
    noindex: true,
  }),
  other: { "geo-sitemap": "exclude" },
};

export default function AnnouncementsPage() {
  return (
    <section className="section">
      <div className="container narrow center" style={{ paddingBlock: "80px" }}>
        <Eyebrow>Updates</Eyebrow>
        <h1 className="h-lg">Announcements &amp; Updates</h1>
        <p className="lead">News and updates from Geo Pallet will appear here soon.</p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: 24 }}>
          <Link href="/" className="btn">Back to Home</Link>
          <Link href="/blogs-geopallet/" className="btn btn-ghost">Read our Blog</Link>
        </div>
      </div>
    </section>
  );
}
