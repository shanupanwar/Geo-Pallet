"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { submitForm, type FormField } from "@/lib/forms";
import { checkEmail, checkName, checkPhone, checkText, formatPhone, recordSend, tooManyRecent } from "@/lib/spam";
import { withBase } from "@/lib/site";
import styles from "./SchemaForm.module.css";
import Dropdown from "./Dropdown";

/**
 * One form engine for every form on the site. Each form is a data file in content/forms/*.json
 * (fields, show/hide rules, fold-out sections, helper pictures), so forms can be edited without code.
 */

type Rule = { fieldId: string; operator: "is" | "isnot" | ">" | "<" | "contains"; value: string };
type Logic = { actionType: "show" | "hide"; logicType: "all" | "any"; rules: Rule[] };

export type FieldDef = {
  id: string;
  type: "text" | "email" | "phone" | "number" | "select" | "radio" | "checkbox" | "textarea" | "name" | "section" | "hint" | "fileupload" | "html";
  label?: string;
  width?: "full" | "half" | "third";
  required?: boolean;
  placeholder?: string;
  choices?: string[];
  choiceLabels?: string[];
  min?: number;
  max?: number;
  instruction?: string;
  description?: string;
  title?: string;
  collapsible?: "start" | "end";
  image?: string;
  alt?: string;
  showFor?: string[];
  html?: string;
  parts?: { key: string; placeholder: string; autocomplete?: string }[];
  autocomplete?: string;
  countryCodes?: string[];
  validate?: "fullName";
  maxMb?: number;
  cssClass?: string;
  logic?: Logic;
};

export type FormSchema = { slug: string; label: string; submit: string; success?: string; fields: FieldDef[] };

const DEFAULT_SUCCESS = "Thanks for contacting. Your request has been received. Our team will contact you shortly with details.";

function ruleMatches(rule: Rule, values: Record<string, string>) {
  const v = (values[rule.fieldId] ?? "").trim();
  switch (rule.operator) {
    case "is":
      return v === rule.value;
    case "isnot":
      return v !== rule.value;
    case ">":
      return parseFloat(v) > parseFloat(rule.value);
    case "<":
      return parseFloat(v) < parseFloat(rule.value);
    case "contains":
      return v.includes(rule.value);
    default:
      return true;
  }
}

/** Which fields are visible right now (rules + hidden sections + closed fold-outs). */
function visibility(fields: FieldDef[], values: Record<string, string>, open: Record<string, boolean>) {
  const byRule = (f: FieldDef) => {
    if (!f.logic) return true;
    const hits = f.logic.rules.map((r) => ruleMatches(r, values));
    const match = f.logic.logicType === "any" ? hits.some(Boolean) : hits.every(Boolean);
    return f.logic.actionType === "show" ? match : !match;
  };
  const shown: Record<string, boolean> = {};
  const inFold: Record<string, string | undefined> = {};
  let sectionHidden = false;
  let fold: string | null = null;
  for (const f of fields) {
    if (f.type === "section") {
      if (f.collapsible === "end") {
        fold = null;
        shown[f.id] = false;
        continue;
      }
      sectionHidden = !byRule(f);
      shown[f.id] = !sectionHidden;
      fold = f.collapsible === "start" ? f.id : null;
      continue;
    }
    inFold[f.id] = fold ?? undefined;
    shown[f.id] = !sectionHidden && byRule(f);
  }
  // A field is "active" (validated and sent) when its rules allow it; a closed fold-out only hides it visually.
  const active = { ...shown };
  const visible: Record<string, boolean> = {};
  for (const f of fields) visible[f.id] = shown[f.id] && (!inFold[f.id] || !!open[inFold[f.id] as string]);
  return { active, visible, inFold };
}

export default function SchemaForm({
  schema,
  variant = "dark",
  before,
  cancelHref,
  idPrefix = schema.slug,
  initialValues,
  next,
}: {
  schema: FormSchema;
  variant?: "dark" | "light";
  before?: React.ReactNode;
  cancelHref?: string;
  idPrefix?: string;
  /** Values to start with, e.g. details carried over from the short quote form. */
  initialValues?: Record<string, string>;
  /** Extra content shown after sending (e.g. a button to the detailed form). Gets the values sent. */
  next?: (values: Record<string, string>) => React.ReactNode;
}) {
  const initial = useMemo(() => {
    const v: Record<string, string> = {};
    for (const f of schema.fields) {
      if (f.type === "select" && !f.placeholder && f.choices && f.id.match(/^\d+$/)) v[f.id] = f.choices[0]; // Gravity Forms pre-selects the first choice
      if (f.type === "phone" && f.countryCodes) v[`${f.id}.code`] = f.countryCodes[0];
    }
    return { ...v, ...initialValues };
  }, [schema, initialValues]);

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [focus, setFocus] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "done" | "error"; msg?: string }>({ kind: "idle" });
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);

  const { active, visible, inFold } = visibility(schema.fields, values, open);
  const set = (id: string, v: string) => {
    setValues((s) => ({ ...s, [id]: v }));
    if (errors[id]) setErrors((e) => ({ ...e, [id]: "" }));
  };
  const fid = (id: string) => `${idPrefix}-${id.replace(/\W/g, "_")}`;

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    for (const f of schema.fields) {
      if (!active[f.id] || ["section", "hint", "html"].includes(f.type)) continue;
      const v = (values[f.id] ?? "").trim();
      if (f.type === "name") {
        const parts = (f.parts || []).map((p) => (values[`${f.id}.${p.key}`] ?? "").trim());
        if (f.required && parts.some((p) => !p)) errs[f.id] = "This field is required.";
        else {
          const bad = parts.map((p) => (p ? checkName(p) : "")).find(Boolean);
          if (bad) errs[f.id] = bad;
        }
        continue;
      }
      if (f.type === "fileupload") {
        const file = files[f.id];
        if (file && file.size > (f.maxMb || 20) * 1024 * 1024) errs[f.id] = `The file is too big. Max. file size: ${f.maxMb || 20} MB.`;
        continue;
      }
      if (f.required && !v) {
        errs[f.id] = "This field is required.";
        continue;
      }
      if (!v) continue;
      if (f.type === "email") {
        const c = checkEmail(v);
        if (!c.ok) errs[f.id] = c.error;
      }
      if (f.type === "phone") {
        const c = checkPhone(v);
        if (!c.ok) errs[f.id] = c.error;
      }
      if (f.validate === "fullName") errs[f.id] = checkName(v, { full: true });
      else if (f.type === "text" && /name/i.test(f.label || "") && !/company/i.test(f.label || "")) errs[f.id] = checkName(v);
      else if (f.type === "text") errs[f.id] = checkText(v, 200);
      if (f.type === "textarea") errs[f.id] = checkText(v, 2000);
      if (f.type === "number") {
        const n = Number(v);
        if (Number.isNaN(n)) errs[f.id] = "Please enter a valid number.";
        else if (f.min !== undefined && n < f.min) errs[f.id] = f.instruction || `Please enter a number greater than or equal to ${f.min}.`;
        else if (f.max !== undefined && n > f.max) errs[f.id] = f.instruction || `Please enter a number less than or equal to ${f.max}.`;
      }
      if (!errs[f.id]) delete errs[f.id];
    }
    return errs;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // filled only by spam robots
    const errs = validate();
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      // open a closed fold-out that contains the problem, then focus it
      const fold = inFold[first];
      if (fold) setOpen((o) => ({ ...o, [fold]: true }));
      setTimeout(() => document.getElementById(fid(first))?.focus(), 50);
      return;
    }
    if (Date.now() - started.current < 3000) return; // a complete form sent within 3 seconds is a robot
    if (tooManyRecent()) {
      setStatus({ kind: "error", msg: "You've sent several requests in the last hour. Please call 604 584 4368 or email sales@geopalletltd.com." });
      return;
    }
    // Reasons a submission looks suspicious (sent along; never shown to the visitor).
    const flags: string[] = [];
    for (const f of schema.fields) {
      if (!active[f.id]) continue;
      const v = (values[f.id] ?? "").trim();
      if (f.type === "phone" && v) {
        const c = checkPhone(v);
        if (c.ok && !c.local) flags.push(`Phone area code ${c.area} is outside BC / Washington`);
      }
      if (f.type === "email" && v) {
        const c = checkEmail(v);
        if (c.ok && c.junk) flags.push(`Email "${v}" looks like a placeholder`);
      }
    }
    const out: FormField[] = [];
    let section = "";
    for (const f of schema.fields) {
      if (!active[f.id]) continue;
      if (f.type === "section" && f.title && f.collapsible !== "end") section = f.title;
      if (["section", "hint", "html", "fileupload"].includes(f.type)) continue;
      let v = values[f.id] ?? "";
      if (f.type === "name") v = (f.parts || []).map((p) => values[`${f.id}.${p.key}`] ?? "").join(" ").trim();
      if (f.type === "phone") {
        const c = checkPhone(v);
        if (c.ok) v = formatPhone(c.digits);
        if (f.countryCodes) v = `${values[`${f.id}.code`] ?? ""} ${v}`.trim();
      }
      if (f.type === "email") v = v.trim().toLowerCase();
      if (!v.trim()) continue;
      const label = f.label && /^Length|Board Size|Lead Board|Middle Board/.test(f.label) && section ? `${section}: ${f.label}` : f.label || f.id;
      out.push({ label, value: v.trim() });
    }
    setStatus({ kind: "sending" });
    const r = await submitForm(schema.label, out, Object.values(files).filter(Boolean) as File[], flags);
    if (r.ok) recordSend();
    if (r.ok) setStatus({ kind: "done", msg: schema.success || DEFAULT_SUCCESS });
    else if (r.notConnected && next) setStatus({ kind: "done", msg: r.error }); // until the forms API exists, still offer the next step
    else setStatus({ kind: "error", msg: r.error });
  }

  if (status.kind === "done") {
    return (
      <div className={`${styles.form} ${styles[variant]} ${styles.done}`} role="status">
        <p>{status.msg}</p>
        {next ? next(values) : null}
      </div>
    );
  }

  return (
    <form className={`${styles.form} ${styles[variant]}`} onSubmit={onSubmit} noValidate>
      {before}
      <div className={styles.grid}>
        {schema.fields.map((f) => {
          if (!visible[f.id]) return null;
          const id = fid(f.id);
          const err = errors[f.id];
          const w = styles[f.width || "full"];
          const labelEl = f.label ? (
            <label htmlFor={f.type === "name" ? `${id}-${f.parts?.[0]?.key}` : id} className={styles.label}>
              {f.label}
              {f.required ? <span className={styles.req} aria-hidden="true"> *</span> : null}
            </label>
          ) : null;
          const common = {
            id,
            name: f.id,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-err` : f.instruction ? `${id}-help` : undefined,
            onFocus: () => setFocus(f.id),
            onBlur: () => setFocus((x) => (x === f.id ? null : x)),
          };

          if (f.type === "section") {
            if (f.collapsible === "start") {
              const isOpen = !!open[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`${styles.fold} ${styles.full}`}
                  aria-expanded={isOpen}
                  onClick={() => setOpen((o) => ({ ...o, [f.id]: !o[f.id] }))}
                >
                  {f.title}
                  <span className={styles.foldIcon} aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
              );
            }
            return (
              <div key={f.id} className={`${styles.section} ${styles.full}`}>
                {f.title && f.title !== "Section Break" ? <h3>{f.title}</h3> : null}
                {f.description ? <p>{f.description}</p> : null}
              </div>
            );
          }

          if (f.type === "hint") {
            const show = !!focus && (f.showFor || []).includes(focus);
            return (
              <div key={f.id} className={`${styles.hint} ${styles.full} ${show ? styles.hintOn : ""}`} aria-hidden={!show}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBase(f.image || "")} alt={f.alt || ""} loading="lazy" />
              </div>
            );
          }

          if (f.type === "html") {
            return <div key={f.id} className={styles.full} dangerouslySetInnerHTML={{ __html: f.html || "" }} />;
          }

          let control: React.ReactNode;
          switch (f.type) {
            case "textarea":
              control = <textarea {...common} rows={5} placeholder={f.placeholder} value={values[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} />;
              break;
            case "select":
              control = (
                <Dropdown
                  id={id}
                  value={values[f.id] ?? ""}
                  placeholder={f.placeholder || "Select"}
                  options={(f.choices || []).map((c, i) => ({ value: c, label: f.choiceLabels?.[i] || c }))}
                  onChange={(v) => set(f.id, v)}
                  onFocus={common.onFocus}
                  onBlur={common.onBlur}
                  invalid={!!err}
                  describedBy={common["aria-describedby"]}
                />
              );
              break;
            case "radio":
              return (
                <fieldset key={f.id} className={`${styles.field} ${w}`} aria-describedby={err ? `${id}-err` : undefined}>
                  <legend className={styles.label}>
                    {f.label}
                    {f.required ? <span className={styles.req} aria-hidden="true"> *</span> : null}
                  </legend>
                  <div className={styles.choices}>
                    {(f.choices || []).map((c, i) => (
                      <label key={c} className={styles.choice}>
                        <input
                          type="radio"
                          id={i === 0 ? id : undefined}
                          name={id}
                          value={c}
                          checked={values[f.id] === c}
                          onChange={() => set(f.id, c)}
                          onFocus={() => setFocus(f.id)}
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                  {err ? <p id={`${id}-err`} className={styles.err}>{err}</p> : null}
                </fieldset>
              );
            case "name":
              return (
                <fieldset key={f.id} className={`${styles.field} ${w}`}>
                  <legend className={styles.label}>
                    {f.label}
                    {f.required ? <span className={styles.req} aria-hidden="true"> *</span> : null}
                  </legend>
                  <div className={styles.row}>
                    {(f.parts || []).map((p, i) => (
                      <input
                        key={p.key}
                        id={i === 0 ? id : `${id}-${p.key}`}
                        aria-label={p.placeholder}
                        placeholder={p.placeholder}
                        autoComplete={p.autocomplete}
                        value={values[`${f.id}.${p.key}`] ?? ""}
                        onChange={(e) => set(`${f.id}.${p.key}`, e.target.value)}
                      />
                    ))}
                  </div>
                  {err ? <p id={`${id}-err`} className={styles.err}>{err}</p> : null}
                </fieldset>
              );
            case "fileupload":
              control = (
                <input
                  {...common}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.dwg,.dxf"
                  onChange={(e) => setFiles((s) => ({ ...s, [f.id]: e.target.files?.[0] || null }))}
                />
              );
              break;
            case "phone":
              control = f.countryCodes ? (
                <div className={styles.phone}>
                  <Dropdown
                    compact
                    className={styles.code}
                    ariaLabel="Country code"
                    value={values[`${f.id}.code`] ?? ""}
                    options={f.countryCodes.map((c) => ({ value: c, label: c }))}
                    onChange={(v) => set(`${f.id}.code`, v)}
                  />
                  <input {...common} type="tel" autoComplete="tel-national" placeholder={f.placeholder} value={values[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} />
                </div>
              ) : (
                <input {...common} type="tel" autoComplete="tel" placeholder={f.placeholder} value={values[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} />
              );
              break;
            default:
              control = (
                <input
                  {...common}
                  type={f.type === "number" ? "number" : f.type === "email" ? "email" : "text"}
                  inputMode={f.type === "number" ? "decimal" : undefined}
                  min={f.min}
                  max={f.max}
                  step={f.type === "number" ? "any" : undefined}
                  placeholder={f.placeholder}
                  autoComplete={f.autocomplete}
                  value={values[f.id] ?? ""}
                  onChange={(e) => set(f.id, e.target.value)}
                />
              );
          }
          return (
            <div key={f.id} className={`${styles.field} ${w} ${f.cssClass?.includes("red-heading") ? styles.red : ""}`}>
              {labelEl}
              {control}
              {f.type === "email" && values[f.id] ? (() => {
                const c = checkEmail(values[f.id]);
                return c.ok && c.suggestion ? (
                  <p className={styles.help}>
                    Did you mean <strong>{c.suggestion}</strong>?{" "}
                    <button type="button" className={styles.linkBtn} onClick={() => set(f.id, c.suggestion as string)}>
                      Use it
                    </button>
                  </p>
                ) : null;
              })() : null}
              {f.description ? <p className={styles.help}>{f.description}</p> : null}
              {f.instruction && !err ? <p id={`${id}-help`} className={styles.help}>{f.instruction}</p> : null}
              {err ? <p id={`${id}-err`} className={styles.err}>{err}</p> : null}
            </div>
          );
        })}
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      {status.kind === "error" ? <p className={styles.formErr} role="alert">{status.msg}</p> : null}
      {Object.values(errors).some(Boolean) ? (
        <p className={styles.formErr} role="alert">There was a problem with your submission. Please review the fields above.</p>
      ) : null}
      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : schema.submit}
        </button>
        {cancelHref ? (
          <a href={withBase(cancelHref)} className={styles.cancel}>Cancel</a>
        ) : null}
      </div>
    </form>
  );
}
