# Website forms → your email: setup (Google Apps Script)

Every website form (quote, pallet inquiry forms with drawings, contact, newsletter) is sent to a small
script in **your own Google account**. The script checks the request, emails it to you, saves any
uploaded files to a private Google Drive folder, adds a row to a Google Sheet, and sends the customer
a "we received your request" email.

**Nothing secret goes into the website or GitHub.** The website only knows the script's address.
Your Gmail password is never needed. The receiving email address and (later) the Turnstile secret key
are stored only inside the script's private settings.

Time needed: about 10 minutes.

---

## 1. Create the Google Sheet

1. Sign in to the Gmail account that should run the forms (for testing, any Gmail).
2. Go to https://sheets.google.com → **Blank spreadsheet**.
3. Rename it (top-left) to **Geo Pallet – Website requests**.

## 2. Add the script

1. In the sheet: menu **Extensions → Apps Script**. A new tab opens.
2. Rename the project (top-left "Untitled project") to **Geo Pallet forms**.
3. In the file `Code.gs`, delete everything that's there.
4. Open the file [`google-apps-script/Code.gs`](../google-apps-script/Code.gs) from this repo, copy **all** of it,
   and paste it into the editor.
5. Click the **Save** icon (💾).

## 3. Add your private setting

1. In the Apps Script tab, click the **⚙ Project Settings** (gear icon on the left).
2. Scroll to **Script properties** → **Add script property**.
3. Property: `NOTIFY_EMAIL` · Value: the email that should receive the requests
   (for testing, your test Gmail; later office@geopalletltd.com).
4. Optional: `NOTIFY_CC` = more addresses to copy, separated by commas.
5. Click **Save script properties**.

## 4. Run "setup" once (gives the script permission)

1. Click **< > Editor** on the left.
2. In the toolbar, choose the function **setup** in the drop-down, then click **▶ Run**.
3. Google asks for permission → **Review permissions** → choose your account.
4. You'll see **"Google hasn't verified this app"**. That's normal for your own script:
   click **Advanced** → **Go to Geo Pallet forms (unsafe)** → **Allow**.
   (It's "unverified" only because you wrote it yourself instead of publishing it on Google's store.)
5. The log at the bottom says "Setup done". Check the inbox: you should get
   **"Geo Pallet website forms are set up ✔"**.

Optional: choose **sendTestRequest** → **▶ Run** to receive a sample quote request and see a row
appear in the sheet.

## 5. Publish the script as a web app

1. Top right: **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Description: `Website forms`.
4. **Execute as: Me** · **Who has access: Anyone**.
   ("Anyone" lets the website send to it. Nobody can read your sheet, mail or files.)
5. **Deploy** → copy the **Web app URL** (it ends in `/exec`).
6. Paste that address into the chat with Claude (it's not secret). Claude connects the website.

To check it works, open the address in your browser: it should say
`"Geo Pallet forms endpoint is running."`

---

## After changing the script later

Paste the new code → Save → **Deploy → Manage deployments** → ✏️ edit → Version: **New version** →
**Deploy**. The address stays the same, so the website needs no change.

## Before go-live: add the human check (Cloudflare Turnstile, free)

1. Create a free account at https://dash.cloudflare.com → **Turnstile** → **Add widget**.
2. Hostnames: `geopalletltd.com`, `www.geopalletltd.com`, `shanupanwar.github.io`, `localhost`.
   Mode: **Managed**.
3. You get two keys:
   - **Site key** (public): give it to Claude / add as GitHub variable `TURNSTILE_SITE_KEY`.
   - **Secret key**: add it **only** as Script property `TURNSTILE_SECRET` (step 3 above).
     **Never paste the secret key into a chat, email or GitHub.**

## Limits and what to watch

- A free Gmail sends about **100 emails a day**; each request uses 2 (you + customer confirmation),
  so about 50 requests a day. Google Workspace allows about 1,500.
- Requests marked **[Check]** looked unusual (for example a far-away phone area code). No
  confirmation is sent to those customers; check before replying.
- Same email address: max 3 requests per hour. Whole website: max 40 requests per 10 minutes.
- Uploads: up to 5 files, 20 MB each, 30 MB together. Files under 10 MB in total are also attached to
  the email; all files are saved in the private Drive folder **Geo Pallet – Website uploads**.
- To pause the customer confirmation email: Script property `AUTO_REPLY` = `off`.
