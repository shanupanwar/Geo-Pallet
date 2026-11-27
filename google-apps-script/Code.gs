/**
 * Geo Pallet – website forms receiver (Google Apps Script)
 * =======================================================
 * Receives every form from the website (quote, pallet inquiry forms with drawings, contact,
 * newsletter), then:
 *   1. checks it again on the server (bots can skip the website's own checks),
 *   2. emails it to you (Reply goes straight to the customer),
 *   3. saves uploaded files to a private Google Drive folder,
 *   4. adds a row to this Google Sheet (one tab per form),
 *   5. sends the customer a short "we received your request" email.
 *
 * NO SECRETS IN THIS FILE. Private settings live in Project Settings → Script properties:
 *   NOTIFY_EMAIL      (required) who receives the requests, e.g. office@geopalletltd.com
 *   NOTIFY_CC         (optional) extra people to copy, comma-separated
 *   TURNSTILE_SECRET  (optional for testing, required before go-live) Cloudflare Turnstile secret key
 *   AUTO_REPLY        (optional) "off" to stop the customer confirmation email (default: on)
 *
 * One-time setup: see docs/FORMS-SETUP.md. In short: paste this file, add NOTIFY_EMAIL,
 * run "setup" once (approve the permissions), then Deploy → Web app → Execute as: Me,
 * Who has access: Anyone. Paste the Web app address (…/exec) into the website settings.
 *
 * After changing this file: Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy.
 * (The address stays the same.)
 */

// ---------- Settings that are safe to keep here ----------
const BUSINESS_NAME = "Geo Pallet Ltd.";
const BUSINESS_PHONE = "604 584 4368";
const SENDER_NAME = "Geo Pallet Website";
const UPLOAD_FOLDER_NAME = "Geo Pallet – Website uploads";
const MAX_FIELDS = 80; // a real form never has more
const MAX_VALUE_LENGTH = 3000; // characters per answer
const MAX_FILES = 5;
const MAX_FILE_MB = 20; // per file (same as the website)
const MAX_TOTAL_FILE_MB = 30; // all files together
const ATTACH_IF_UNDER_MB = 10; // smaller uploads are also attached to the email
const MAX_PER_EMAIL_PER_HOUR = 3; // same customer email
const MAX_TOTAL_PER_10_MIN = 40; // whole website, protects your daily Gmail limit
const ALLOWED_FORMS = [
  "Quote request",
  "Contact page",
  "Contact form page",
  "Newsletter sign-up",
  "2 Way Pallet",
  "4 Way Pallet",
  "Block Pallet",
  "Skid Pallet",
  "Wing Pallet",
  "Cribbing",
];

// ---------- Web endpoints ----------

/** Opening the address in a browser shows this; handy to confirm the deployment works. */
function doGet() {
  return json_({ ok: true, message: "Geo Pallet forms endpoint is running." });
}

/** The website sends every form here as JSON (sent as text/plain so browsers allow it). */
function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || "";
    if (!raw || raw.length > (MAX_TOTAL_FILE_MB * 1.4 + 1) * 1024 * 1024) return fail_("Request too large or empty.");

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      return fail_("Invalid request.");
    }

    // 1. Shape and size checks
    const form = String(data.form || "");
    if (ALLOWED_FORMS.indexOf(form) === -1) return fail_("Unknown form.");
    if (data.website) return json_({ ok: true }); // hidden bot trap was filled: pretend success, do nothing
    const fields = Array.isArray(data.fields) ? data.fields : [];
    if (!fields.length || fields.length > MAX_FIELDS) return fail_("Invalid form.");
    const clean = [];
    for (const f of fields) {
      const label = String((f && f.label) || "").slice(0, 200).trim();
      const value = String((f && f.value) || "").trim();
      if (!label || !value) continue;
      if (value.length > MAX_VALUE_LENGTH) return fail_("An answer is too long.");
      clean.push({ label: label, value: value });
    }
    if (!clean.length) return fail_("The form is empty.");

    // 2. Human check (Cloudflare Turnstile), required once TURNSTILE_SECRET is set
    const props = PropertiesService.getScriptProperties();
    const secret = props.getProperty("TURNSTILE_SECRET");
    if (secret && !turnstileOk_(secret, String(data.turnstileToken || ""))) {
      return fail_("Please complete the human check and try again.");
    }

    // 3. Server-side re-checks (same rules as the website)
    const flags = (Array.isArray(data.flags) ? data.flags : []).map(String).slice(0, 10);
    const email = findValue_(clean, /e-?mail/i);
    if (!email || !isEmail_(email)) return fail_("Please enter a valid email address.");
    const phone = findValue_(clean, /phone/i);
    if (phone && !phoneOk_(phone)) return fail_("Please enter a valid phone number.");
    for (const f of clean) {
      if (/https?:\/\/|www\.|<a\s|\[url/i.test(f.value) && !/e-?mail/i.test(f.label)) return fail_("Links are not allowed in the form.");
    }
    if (/^(test|asdf|qwerty|abc)@|@(example|test)\./i.test(email)) flags.push("Email looks like a placeholder");

    // 4. Rate limits
    const cache = CacheService.getScriptCache();
    const emailKey = "e:" + email.toLowerCase();
    const perEmail = Number(cache.get(emailKey) || 0);
    if (perEmail >= MAX_PER_EMAIL_PER_HOUR) return fail_("You've sent several requests in the last hour. Please call " + BUSINESS_PHONE + ".");
    const globalKey = "g:" + Math.floor(Date.now() / 600000);
    const total = Number(cache.get(globalKey) || 0);
    if (total >= MAX_TOTAL_PER_10_MIN) return fail_("We're receiving many requests right now. Please call " + BUSINESS_PHONE + ".");
    cache.put(emailKey, String(perEmail + 1), 3600);
    cache.put(globalKey, String(total + 1), 700);

    // 5. Files → private Drive folder
    const files = saveFiles_(Array.isArray(data.files) ? data.files : [], form, email);
    if (files.error) return fail_(files.error);

    // 6. Email to you, row in the sheet, confirmation to the customer
    const suspicious = flags.length > 0;
    const page = String(data.page || "").slice(0, 300);
    notifyOwner_(props, form, clean, files.saved, flags, page, email);
    logRow_(form, clean, files.saved, flags, page);
    if (!suspicious && props.getProperty("AUTO_REPLY") !== "off") confirmCustomer_(form, clean, email);

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return fail_("Sorry, something went wrong. Please call " + BUSINESS_PHONE + ".");
  }
}

// ---------- One-time setup (run from the editor) ----------

/**
 * Run once from the editor (select "setup" → Run). Google asks you to approve the permissions
 * (send email, save files to Drive, edit this sheet). It then creates the uploads folder and sends
 * a test email to NOTIFY_EMAIL.
 */
function setup() {
  const props = PropertiesService.getScriptProperties();
  const to = props.getProperty("NOTIFY_EMAIL");
  if (!to) throw new Error("Add NOTIFY_EMAIL in Project Settings → Script properties first.");
  props.setProperty("SHEET_ID", SpreadsheetApp.getActiveSpreadsheet().getId());
  uploadFolder_();
  MailApp.sendEmail({
    to: to,
    subject: "Geo Pallet website forms are set up ✔",
    htmlBody:
      "<p>This Google account will now email website form requests to <b>" + esc_(to) + "</b>.</p>" +
      "<p>Next step: Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).</p>" +
      "<p>Emails you can still send today: " + MailApp.getRemainingDailyQuota() + "</p>",
    name: SENDER_NAME,
  });
  console.log("Setup done. Test email sent to " + to + ".");
}

/** Optional: run from the editor to send yourself a sample request without the website. */
function sendTestRequest() {
  const fake = {
    postData: {
      contents: JSON.stringify({
        form: "Quote request",
        page: "/ (test from the editor)",
        fields: [
          { label: "Full name", value: "Test Customer" },
          { label: "Email address", value: PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL") },
          { label: "Phone number", value: "CA +1 (604) 812-3456" },
          { label: "Company name", value: "Test Company" },
          { label: "What type of pallets do you need?", value: "4-way pallet" },
          { label: "Heat-treated pallets", value: "Yes" },
          { label: "Estimated quantity", value: "100-500" },
          { label: "Delivery location", value: "Across B.C" },
        ],
        flags: [],
      }),
    },
  };
  console.log(doPost(fake).getContent());
}

// ---------- Helpers ----------

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function fail_(error) {
  return json_({ ok: false, error: error });
}

function esc_(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function findValue_(fields, re) {
  const f = fields.find(function (x) {
    return re.test(x.label);
  });
  return f ? f.value : "";
}

function customerName_(fields) {
  const f = fields.find(function (x) {
    return /name/i.test(x.label) && !/company|business/i.test(x.label);
  });
  return f ? f.value : "";
}

function isEmail_(s) {
  return /^[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}$/i.test(s) && s.length <= 254;
}

/** North American number: 10 digits after the optional +1, real area code, no 555-01xx. */
function phoneOk_(s) {
  let d = String(s).replace(/\D/g, "");
  if (d.length === 11 && d[0] === "1") d = d.slice(1);
  if (d.length !== 10) return false;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(d)) return false;
  if (/^\d{3}555/.test(d)) return false;
  if (/^(\d)\1{9}$/.test(d)) return false;
  return true;
}

function turnstileOk_(secret, token) {
  if (!token) return false;
  try {
    const res = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "post",
      payload: { secret: secret, response: token },
      muteHttpExceptions: true,
    });
    return JSON.parse(res.getContentText()).success === true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function uploadFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty("UPLOAD_FOLDER_ID");
  if (id) {
    try {
      return DriveApp.getFolderById(id);
    } catch (err) {
      // folder was deleted: make a new one below
    }
  }
  const folder = DriveApp.createFolder(UPLOAD_FOLDER_NAME); // private: only you can open it
  props.setProperty("UPLOAD_FOLDER_ID", folder.getId());
  return folder;
}

/** files: [{ name, type, data (base64) }] → saved privately in Drive. */
function saveFiles_(list, form, email) {
  if (!list.length) return { saved: [] };
  if (list.length > MAX_FILES) return { error: "Too many files." };
  const allowed = /\.(pdf|jpe?g|png|gif|webp|heic|docx?|xlsx?|csv|dwg|dxf)$/i;
  let total = 0;
  const blobs = [];
  for (const f of list) {
    const name = String((f && f.name) || "file").replace(/[\\/:*?"<>|]/g, "_").slice(0, 120);
    if (!allowed.test(name)) return { error: "This file type isn't allowed: " + name };
    const bytes = Utilities.base64Decode(String((f && f.data) || ""));
    const mb = bytes.length / 1024 / 1024;
    if (mb > MAX_FILE_MB) return { error: "The file is too big: " + name };
    total += mb;
    blobs.push(Utilities.newBlob(bytes, String(f.type || "application/octet-stream"), name));
  }
  if (total > MAX_TOTAL_FILE_MB) return { error: "The files are too big together." };
  const folder = uploadFolder_();
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HHmm");
  const saved = blobs.map(function (b) {
    const file = folder.createFile(b).setName(stamp + " – " + form + " – " + email + " – " + b.getName());
    return { name: b.getName(), url: file.getUrl(), blob: b, mb: b.getBytes().length / 1024 / 1024 };
  });
  return { saved: saved };
}

function notifyOwner_(props, form, fields, files, flags, page, email) {
  const name = customerName_(fields) || email;
  const pallet = findValue_(fields, /type of pallets/i);
  const qty = findValue_(fields, /quantity/i);
  const detail = [pallet, qty ? "(" + qty + ")" : ""].filter(String).join(" ");
  const what = /request|sign-up/i.test(form) ? form.toLowerCase() : /contact/i.test(form) ? "contact message" : form + " inquiry";
  const subject = (flags.length ? "[Check] " : "") + "New " + what + " – " + name + (detail ? " – " + detail : "");

  let rows = fields
    .map(function (f) {
      return (
        '<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;vertical-align:top;width:40%">' + esc_(f.label) +
        '</td><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;white-space:pre-wrap"><b>' + esc_(f.value) + "</b></td></tr>"
      );
    })
    .join("");
  if (files.length) {
    rows +=
      '<tr><td style="padding:8px 12px;color:#666;vertical-align:top">Uploaded files</td><td style="padding:8px 12px">' +
      files.map(function (f) { return '<a href="' + esc_(f.url) + '">' + esc_(f.name) + "</a>"; }).join("<br>") +
      "</td></tr>";
  }
  const warn = flags.length
    ? '<div style="background:#fff4e5;border:1px solid #f0b46c;border-radius:8px;padding:12px 14px;margin:0 0 16px">' +
      "<b>Please check before replying.</b> This request looked unusual:<br>• " + flags.map(esc_).join("<br>• ") +
      "<br><small>No confirmation email was sent to the customer.</small></div>"
    : "";
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:14px;max-width:640px">' +
    warn +
    '<h2 style="margin:0 0 4px;font-size:18px">New ' + esc_(form) + "</h2>" +
    '<p style="margin:0 0 16px;color:#666">From the website page ' + esc_(page || "/") + " · Press Reply to answer the customer.</p>" +
    '<table style="border-collapse:collapse;width:100%">' + rows + "</table></div>";
  const text =
    (flags.length ? "PLEASE CHECK: " + flags.join("; ") + "\n\n" : "") +
    fields.map(function (f) { return f.label + ": " + f.value; }).join("\n") +
    (files.length ? "\n\nFiles:\n" + files.map(function (f) { return f.name + " " + f.url; }).join("\n") : "");

  const totalMb = files.reduce(function (s, f) { return s + f.mb; }, 0);
  const msg = {
    to: props.getProperty("NOTIFY_EMAIL"),
    subject: subject.slice(0, 240),
    htmlBody: html,
    body: text,
    replyTo: email,
    name: SENDER_NAME,
  };
  const cc = props.getProperty("NOTIFY_CC");
  if (cc) msg.cc = cc;
  if (files.length && totalMb <= ATTACH_IF_UNDER_MB) msg.attachments = files.map(function (f) { return f.blob; });
  MailApp.sendEmail(msg);
}

function confirmCustomer_(form, fields, email) {
  if (MailApp.getRemainingDailyQuota() < 10) return; // keep the last emails for your own notifications
  const first = (customerName_(fields).split(/\s+/)[0] || "").replace(/[^\p{L}'-]/gu, "");
  const newsletter = form === "Newsletter sign-up";
  const subject = newsletter ? "You're subscribed to Geo Pallet updates" : "We received your request – " + BUSINESS_NAME;
  const intro = newsletter
    ? "Thanks for subscribing. We'll send you occasional news and updates from " + BUSINESS_NAME + "."
    : "Thanks for contacting " + BUSINESS_NAME + ". We've received your request and our team will contact you shortly with details.";
  const summary = newsletter
    ? ""
    : '<table style="border-collapse:collapse;margin-top:12px">' +
      fields
        .map(function (f) {
          return '<tr><td style="padding:4px 12px 4px 0;color:#666">' + esc_(f.label) + '</td><td style="padding:4px 0"><b>' + esc_(f.value) + "</b></td></tr>";
        })
        .join("") +
      "</table>";
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody:
      '<div style="font-family:Arial,sans-serif;font-size:14px;max-width:600px;color:#111">' +
      "<p>Hi" + (first ? " " + esc_(first) : "") + ",</p><p>" + esc_(intro) + "</p>" +
      (summary ? "<p style=\"margin-bottom:0\">Here's a copy of what you sent:</p>" + summary : "") +
      "<p>Need it sooner? Call us at <b>" + BUSINESS_PHONE + "</b>.</p>" +
      "<p>— The " + BUSINESS_NAME + " team</p></div>",
    name: BUSINESS_NAME,
  });
}

/** One tab per form; new questions get their own column automatically. */
function logRow_(form, fields, files, flags, page) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
    const book = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
    const tabName = form.slice(0, 90);
    const sheet = book.getSheetByName(tabName) || book.insertSheet(tabName);
    const base = ["Received", "Check?", "Page"];
    let header = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String) : [];
    if (!header.length) header = base.slice();
    const labels = fields.map(function (f) { return f.label; }).concat(files.length ? ["Uploaded files"] : []);
    labels.forEach(function (l) {
      if (header.indexOf(l) === -1) header.push(l);
    });
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
    sheet.setFrozenRows(1);
    const row = header.map(function (h) {
      if (h === "Received") return new Date();
      if (h === "Check?") return flags.join("; ");
      if (h === "Page") return page;
      if (h === "Uploaded files") return files.map(function (f) { return f.url; }).join("\n");
      const f = fields.find(function (x) { return x.label === h; });
      // a leading = + - @ would make Sheets treat the answer as a formula
      return f ? (/^[=+\-@]/.test(f.value) ? "'" + f.value : f.value) : "";
    });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}
