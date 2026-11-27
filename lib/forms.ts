/**
 * Form sending. Every form POSTs to NEXT_PUBLIC_FORM_ENDPOINT, a Google Apps Script web app
 * (code: google-apps-script/Code.gs, setup: docs/FORMS-SETUP.md). The script re-checks the request,
 * emails it to the office (Reply goes to the customer), saves uploads to a private Drive folder,
 * logs a row in a Google Sheet and sends the customer a confirmation.
 *
 * Body (sent as text/plain so the browser needs no extra permission check; Apps Script can't read
 * multipart uploads, so files travel base64-encoded inside the JSON):
 *   { form, fields: [{ label, value }], page, flags, suspicious, files: [{ name, type, data }] }
 * Reply: { ok: true } or { ok: false, error }.
 * flags explain why a submission looks suspicious (see lib/spam.ts); the email then gets "[Check]".
 * Without an endpoint, submitting shows a clear "not connected yet" notice instead of pretending to send.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

const GENERIC_ERROR = "Sorry, the form couldn't be sent. Please try again, or call 604 584 4368.";

export type FormField = { label: string; value: string };
export type SubmitResult = { ok: true } | { ok: false; error: string; notConnected?: boolean };

export async function submitForm(form: string, fields: FormField[], files: File[] = [], flags: string[] = []): Promise<SubmitResult> {
  if (!FORM_ENDPOINT) {
    return { ok: false, notConnected: true, error: "This form isn't connected yet. Please call 604 584 4368 or email sales@geopalletltd.com." };
  }
  try {
    const page = typeof window !== "undefined" ? window.location.pathname : "";
    const encoded = await Promise.all(files.map(async (f) => ({ name: f.name, type: f.type || "application/octet-stream", data: await toBase64(f) })));
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ form, fields, page, flags, suspicious: flags.length > 0, files: encoded }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!reply?.ok) return { ok: false, error: reply?.error || GENERIC_ERROR };
    return { ok: true };
  } catch {
    return { ok: false, error: GENERIC_ERROR };
  }
}

/** File → base64 text (without the "data:…;base64," prefix). */
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
