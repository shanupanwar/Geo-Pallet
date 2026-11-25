"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SchemaForm, { type FormSchema } from "./SchemaForm";
import styles from "@/app/pallet-inquiry-forms/inquiry.module.css";

/** The six pallet quotation forms. Each loads only when chosen, so the page stays light. */
const FORMS: Record<string, { label: string; load: () => Promise<{ default: unknown }> }> = {
  "2-way-pallet": { label: "2 Way Pallet", load: () => import("@/content/forms/2-way-pallet.json") },
  "4-way-pallet": { label: "4 Way Pallet", load: () => import("@/content/forms/4-way-pallet.json") },
  "skid-pallet": { label: "Skid Pallet", load: () => import("@/content/forms/skid-pallet.json") },
  "wing-pallet": { label: "Wing Pallet", load: () => import("@/content/forms/wing-pallet.json") },
  "block-pallet": { label: "Block Pallet", load: () => import("@/content/forms/block-pallet.json") },
  cribbing: { label: "Cribbing", load: () => import("@/content/forms/cribbing.json") },
};

/** "?selected=2+Way+Pallet" -> "2-way-pallet" (same rule as the old site; anything unknown -> 2-way). */
function toSlug(raw: string | null) {
  const slug = (raw || "").trim().toLowerCase().replace(/[\s_+]+/g, "-");
  return slug in FORMS ? slug : "2-way-pallet";
}

export default function InquiryForms() {
  const params = useSearchParams();
  const router = useRouter();
  const slug = toSlug(params.get("selected"));
  const [loaded, setLoaded] = useState<{ slug: string; schema: FormSchema } | null>(null);

  useEffect(() => {
    let live = true;
    FORMS[slug].load().then((m) => live && setLoaded({ slug, schema: m.default as FormSchema }));
    return () => {
      live = false;
    };
  }, [slug]);
  const schema = loaded && loaded.slug === slug ? loaded.schema : null;

  return (
    <>
      <div className={styles.picker}>
        <label htmlFor="pallet-type">Pallet Type</label>
        <select
          id="pallet-type"
          value={slug}
          onChange={(e) => router.replace(`?selected=${encodeURIComponent(FORMS[e.target.value].label).replace(/%20/g, "+")}`, { scroll: false })}
        >
          {Object.entries(FORMS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>
      {schema ? (
        <SchemaForm key={slug} schema={schema} variant="light" idPrefix={`inq-${slug}`} cancelHref="/custom-pallets-british-columbia/" />
      ) : (
        <p className={styles.loading} role="status">Loading the {FORMS[slug].label} form…</p>
      )}
    </>
  );
}
