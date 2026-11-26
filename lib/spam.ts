/**
 * Form protection (agreed 2026-11-27). Runs in the browser before anything is sent.
 *
 *  - BLOCK (the visitor sees a message and must fix it): impossible phone numbers, throwaway email
 *    services, broken email addresses, web links typed into text fields, text that is far too long.
 *  - FLAG (sent, but marked so the forms API can ask for an email confirmation code and put
 *    "[Check]" in the subject): numbers outside BC / Washington State, junk-looking email names,
 *    mismatched details. Real customers are never turned away just for being flagged.
 *
 * The forms API (to be built) must repeat these checks on the server, because a robot can skip
 * the browser entirely. See README → Forms.
 */

/* ---------------- Phone numbers (Canada + USA share +1) ---------------- */

/** British Columbia area codes. */
const BC = ["236", "250", "257", "604", "672", "778"];
/** Washington State area codes. */
const WA = ["206", "253", "360", "425", "509", "564"];

export type PhoneCheck = { ok: false; error: string } | { ok: true; digits: string; area: string; local: boolean };

export function checkPhone(raw: string): PhoneCheck {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  if (d.length !== 10) return { ok: false, error: "Please enter a 10-digit phone number, e.g. 604 584 4368." };
  const area = d.slice(0, 3);
  const exchange = d.slice(3, 6);
  const line = d.slice(6);
  // North American numbering rules: area code and exchange can't start with 0 or 1, and can't be N11 (211, 911…).
  if (/^[01]/.test(area) || /^[01]/.test(exchange) || /^\d11$/.test(area) || /^\d11$/.test(exchange)) {
    return { ok: false, error: "This doesn't look like a real Canadian or US phone number." };
  }
  // Reserved / non-geographic codes that a customer wouldn't use on a quote request.
  if (/^(37\d|96\d|555|950|976|900)$/.test(area)) return { ok: false, error: "This doesn't look like a real Canadian or US phone number." };
  // Fictional 555-01xx numbers, and numbers made of one repeated digit or a simple run.
  if ((exchange === "555" && /^01/.test(line)) || /^(\d)\1{9}$/.test(d) || d === "1234567890" || d === "0123456789") {
    return { ok: false, error: "Please enter your real phone number so we can reach you." };
  }
  if (/^(\d)\1{6}$/.test(exchange + line)) return { ok: false, error: "Please enter your real phone number so we can reach you." };
  return { ok: true, digits: d, area, local: BC.includes(area) || WA.includes(area) };
}

/** "6045844368" -> "604 584 4368" */
export function formatPhone(d: string) {
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

/* ---------------- Email addresses ---------------- */

/** Throwaway / temporary email services (blocked). */
const THROWAWAY = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com", "10minutemail.net",
  "tempmail.com", "temp-mail.org", "tempmail.net", "tempmailo.com", "tempr.email", "throwawaymail.com", "yopmail.com",
  "yopmail.net", "getnada.com", "nada.email", "trashmail.com", "trashmail.de", "dispostable.com", "maildrop.cc",
  "mailnesia.com", "mintemail.com", "mohmal.com", "emailondeck.com", "fakeinbox.com", "fakemail.net", "spamgourmet.com",
  "mytemp.email", "moakt.com", "burnermail.io", "33mail.com", "inboxkitten.com", "mail.tm", "mail.gw", "tmpmail.org",
  "tmail.ws", "luxusmail.org", "1secmail.com", "1secmail.org", "1secmail.net", "emailfake.com", "discard.email",
  "spambox.us", "mailcatch.com", "anonbox.net", "harakirimail.com", "mailpoof.com", "dropmail.me", "linshiyouxiang.net",
  "example.com", "example.org", "example.net", "test.com", "domain.com", "email.com",
]);

/** Common typos in popular email domains -> the likely intended domain. */
const TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com", "gamil.com": "gmail.com", "gmai.com": "gmail.com", "gmal.com": "gmail.com", "gnail.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cmo": "gmail.com", "gmail.ca": "gmail.com", "gmaill.com": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com", "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.con": "yahoo.com", "yaho.ca": "yahoo.ca",
  "outlok.com": "outlook.com", "outllok.com": "outlook.com", "outlook.con": "outlook.com", "iclod.com": "icloud.com",
  "icloud.con": "icloud.com", "shaw.c": "shaw.ca", "telus.nte": "telus.net", "telus.ner": "telus.net",
};

/** Names in front of the @ that are almost never a real person or business. */
const JUNK_NAME = /^(test\d*|testing|abc|abcd|abcde|abcdef|asdf\w*|qwerty\w*|zxcv\w*|xyz|aaa+|xxx+|zzz+|sample|demo|fake|spam|noreply|no-reply|nobody|none|null|admin\d*|user\d*|[a-z])$/i;

export type EmailCheck = { ok: false; error: string } | { ok: true; suggestion?: string; junk: boolean };

export function checkEmail(raw: string): EmailCheck {
  const v = raw.trim().toLowerCase();
  if (v.length > 120 || !/^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,24}$/.test(v) || v.includes("..")) {
    return { ok: false, error: "Please enter a valid email address, e.g. name@company.com." };
  }
  const [name, domain] = v.split("@");
  if (THROWAWAY.has(domain)) {
    return { ok: false, error: "Temporary email addresses can't be used. Please use your regular email address." };
  }
  const suggestion = TYPOS[domain] ? `${name}@${TYPOS[domain]}` : undefined;
  const junk = JUNK_NAME.test(name) || /^\d+$/.test(name) || /^(.)\1{3,}$/.test(name);
  return { ok: true, suggestion, junk };
}

/* ---------------- Names and free text ---------------- */

const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|ru|cn|xyz|top|info|biz|io|co|online|site|click|link|shop)\b\/?)/i;

/** Person names: letters (any language), spaces, hyphens, apostrophes, dots. */
export function checkName(raw: string, { full = false } = {}): string {
  const v = raw.trim();
  if (v.length > 60) return "Please enter a shorter name.";
  if (!/^[\p{L}][\p{L}\p{M}' .-]*$/u.test(v)) return "Please use letters only for your name.";
  if (full && !/^\S{2,}(\s+\S+)+$/.test(v)) return "Please enter your first and last name.";
  return "";
}

/** Free-text fields: no web links (the most common spam), sensible length, no gibberish runs. */
export function checkText(raw: string, max = 2000): string {
  const v = raw.trim();
  if (v.length > max) return `Please keep this under ${max} characters.`;
  if (LINK.test(v)) return "Please remove web links. If you need to share a file, use the upload box or email us.";
  if (/(.)\1{9,}/.test(v)) return "Please check this text.";
  return "";
}

/* ---------------- Repeat submissions from one browser ---------------- */

const RATE_KEY = "geo-form-sends";
const MAX_PER_HOUR = 3;

/** true when this browser has already sent 3 forms in the last hour. */
export function tooManyRecent(): boolean {
  try {
    const now = Date.now();
    const list = (JSON.parse(localStorage.getItem(RATE_KEY) || "[]") as number[]).filter((t) => now - t < 3600_000);
    return list.length >= MAX_PER_HOUR;
  } catch {
    return false;
  }
}

export function recordSend() {
  try {
    const now = Date.now();
    const list = (JSON.parse(localStorage.getItem(RATE_KEY) || "[]") as number[]).filter((t) => now - t < 3600_000);
    list.push(now);
    localStorage.setItem(RATE_KEY, JSON.stringify(list));
  } catch {
    /* private browsing: skip */
  }
}
