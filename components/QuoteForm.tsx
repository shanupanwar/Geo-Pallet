"use client";

import Link from "next/link";
import quoteSchema from "@/content/forms/quote.json";
import { detailedFormHref, savePrefill } from "@/lib/prefill";
import Icon from "./Icon";
import SchemaForm, { type FormSchema } from "./SchemaForm";

/**
 * The short quote form. After sending, it offers the detailed pallet form for the chosen
 * pallet type, with the visitor's name, email and phone already filled in.
 */
export default function QuoteForm({ idPrefix = "quote", compact = false }: { idPrefix?: string; compact?: boolean }) {
  const schema = quoteSchema as FormSchema;
  const s = compact ? { ...schema, fields: schema.fields.map((f) => ({ ...f, width: "full" as const })) } : schema;
  return (
    <SchemaForm
      schema={s}
      idPrefix={idPrefix}
      next={(v) => {
        const href = detailedFormHref(v.pallet);
        return (
          <div className="quote-next">
            <p>
              <strong>Want an exact price?</strong> Add your pallet specifications (sizes, boards, stringers). Your contact details are
              already filled in.
            </p>
            <Link
              href={href}
              className="btn btn-gradient"
              onClick={() =>
                savePrefill({ name: v.name, email: v.email, phone: v.phone, company: v.company, heat: v.heat })
              }
            >
              Add exact specifications <span className="btn-dot"><Icon name="arrowRight" /></span>
            </Link>
          </div>
        );
      }}
    />
  );
}
