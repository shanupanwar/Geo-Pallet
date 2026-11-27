/**
 * Form sending. The forms are complete (fields, checks, thank-you messages), but sending
 * needs an API, which will be built later (decided 2026-11-25).
 *
 * When NEXT_PUBLIC_FORM_ENDPOINT is set, every form POSTs JSON there:
 *   { form: "Quote request", fields: [{ label, value }], page: "/", flags: ["..."], suspicious: false }
 * flags explain why a submission looks suspicious (see lib/spam.ts); the API should then ask for an
 * email confirmation code and put "[Check]" in the subject.
 * Until then, submitting shows a clear "not connected yet" notice instead of pretending to send.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

export type FormField = { label: string; value: string };
export type SubmitResult = { ok: true } | { ok: false; error: string; notConnected?: boolean };

export async function submitForm(form: string, fields: FormField[], files: File[] = [], flags: string[] = []): Promise<SubmitResult> {
  if (!FORM_ENDPOINT) {
    return { ok: false, notConnected: true, error: "This form isn't connected yet. Please call 604 584 4368 or email sales@geopalletltd.com." };
  }
  try {
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    let res: Response;
    if (files.length) {
      const data = new FormData();
      data.append("payload", JSON.stringify({ form, fields, page, flags, suspicious: flags.length > 0 }));
      files.forEach((f) => data.append("files", f, f.name));
      res = await fetch(FORM_ENDPOINT, { method: "POST", body: data });
    } else {
      res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, fields, page, flags, suspicious: flags.length > 0 }),
      });
    }
    if (!res.ok) throw new Error(String(res.status));
    return { ok: true };
  } catch {
    return { ok: false, error: "Sorry, the form couldn't be sent. Please try again, or call 604 584 4368." };
  }
}
