"use client";

import { useState } from "react";
import { submitForm, validators } from "@/lib/forms";
import styles from "./Footer.module.css";

/** Footer "Subscribe to our newsletter" form. */
export default function NewsletterForm() {
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "done" | "error"; msg?: string }>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // filled only by spam robots
    const email = String(fd.get("email") || "");
    const err = validators.email(email);
    if (err) return setStatus({ kind: "error", msg: err });
    setStatus({ kind: "sending" });
    const r = await submitForm("Newsletter sign-up", [{ label: "Email", value: email }]);
    setStatus(r.ok ? { kind: "done", msg: "The form was sent successfully." } : { kind: "error", msg: r.error });
  }

  if (status.kind === "done") return <p className={styles.formMsg} role="status">{status.msg}</p>;

  return (
    <form className={styles.newsletter} onSubmit={onSubmit} noValidate>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <input id="nl-email" name="email" type="email" placeholder="Email Address" autoComplete="email" required />
      <input name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />
      <button type="submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "…" : "Submit"}</button>
      {status.kind === "error" ? <p className={styles.formErr} role="alert">{status.msg}</p> : null}
    </form>
  );
}
