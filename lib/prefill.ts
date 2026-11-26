/**
 * Carries a visitor's details from the short quote form to the detailed pallet form,
 * so they don't type their name, email and phone twice. Kept only for this browser tab.
 */
import type { FieldDef } from "@/components/SchemaForm";

const KEY = "geo-quote-prefill";

export type Prefill = { name?: string; email?: string; phone?: string; company?: string; heat?: string };

/** Short-form pallet choice -> detailed form (only these types have one). */
const DETAILED: Record<string, string> = {
  "2 way pallet": "2 Way Pallet",
  "4 way pallet": "4 Way Pallet",
  "skid pallet": "Skid Pallet",
  "block pallet": "Block Pallet",
  "wing pallet": "Wing Pallet",
  "wood cribbing": "Cribbing",
};

/** Address of the detailed form for the pallet type chosen in the short form. */
export function detailedFormHref(pallet: string | undefined): string {
  const label = DETAILED[(pallet || "").trim().toLowerCase()];
  return label ? `/pallet-inquiry-forms/?selected=${label.replace(/ /g, "+")}` : "/pallet-inquiry-forms/";
}

export function savePrefill(p: Prefill) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private browsing: just skip pre-filling */
  }
}

export function readPrefill(): Prefill | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Prefill) : null;
  } catch {
    return null;
  }
}

/** Turn saved details into starting values for a detailed form (matched by field type and label). */
export function prefillValues(fields: FieldDef[], p: Prefill | null): Record<string, string> {
  if (!p) return {};
  const v: Record<string, string> = {};
  for (const f of fields) {
    const label = (f.label || "").toLowerCase();
    if (f.type === "name" && p.name && f.parts?.length) {
      const [first, ...rest] = p.name.trim().split(/\s+/);
      v[`${f.id}.${f.parts[0].key}`] = first;
      if (f.parts[1]) v[`${f.id}.${f.parts[1].key}`] = rest.join(" ");
    } else if (f.type === "email" && p.email) v[f.id] = p.email;
    else if (f.type === "phone" && p.phone) v[f.id] = p.phone;
    else if (f.type === "select" && label.startsWith("company/individual") && p.company) v[f.id] = "Company";
    else if (f.type === "text" && label.startsWith("company name") && p.company) v[f.id] = p.company;
    else if (f.type === "select" && label.startsWith("heat treated") && p.heat && f.choices?.includes(p.heat)) v[f.id] = p.heat;
  }
  return v;
}
