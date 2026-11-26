# Google reviews on the website: setup steps (for you)

> **Not used.** Chosen instead (2026-11-27): free option, real Google reviews copied into content/data/testimonials.ts.

Original plan: the homepage shows your **Google star rating, total review count and your
5 latest Google reviews**, fetched live in the visitor's browser (Google's "Places API (New)"), with
"Reviews from Google", "See all reviews on Google" and "Write a review". If Google can't be reached,
the 9 reviews already on the site are shown instead.

Only you can do steps 1–4 (they need your Google sign-in and a card). **Never paste the API key into a
chat.** It goes into GitHub (step 5) only.

## 1. Create a Google Cloud account and project
1. Go to https://console.cloud.google.com and sign in with the Google account that manages your business.
2. Top bar → project picker → **New project** → name it `geo-pallet-website` → **Create**.
3. Left menu → **Billing** → link a billing account (Google asks for a card). At our usage (a few
   thousand homepage visits a month) it stays inside Google's free monthly allowance. You can also set a
   **budget alert** (Billing → Budgets & alerts → e.g. CAD 5) so you're emailed if anything is ever charged.

## 2. Turn on the Places API (New)
1. Left menu → **APIs & Services** → **Library**.
2. Search **"Places API (New)"** → open it → **Enable**.

## 3. Create the API key and lock it down
1. **APIs & Services** → **Credentials** → **Create credentials** → **API key**.
2. Click the new key → **Edit**:
   - **Application restrictions:** *Websites*. Add:
     - `https://shanupanwar.github.io/*`
     - `http://localhost:3000/*` (lets the preview on your computer work)
     - later, at go-live: `https://geopalletltd.com/*` and `https://www.geopalletltd.com/*`
   - **API restrictions:** *Restrict key* → tick only **Places API (New)**.
3. **Save**. With these locks the key only works on your website and only for reviews, so it's safe
   for it to be visible in the page.

## 4. Tell me your exact Google listing name
Tell me your business name **exactly as it appears on Google Maps** (and the city). I'll look up its
**Place ID** (a fixed code Google uses for your listing) and put it in the site settings.

## 5. Add the key to GitHub yourself
1. GitHub → your repo **Geo-Pallet** → **Settings** → **Secrets and variables** → **Actions** →
   **Variables** tab → **New repository variable**.
2. Name: `GOOGLE_MAPS_KEY`, Value: paste the key → **Add variable**.
3. Tell me it's done. I'll connect it, and the reviews appear on the next publish.

## What it costs and what to watch
- One request per homepage visit. Google's free monthly allowance covers a small business site; the
  budget alert from step 1 protects you.
- Google only shares **up to 5 reviews** (most relevant or newest), and they must be shown as written,
  with the reviewer's name and photo and a link to Google.
- If you ever want to stop it: delete the GitHub variable (the site falls back to the 9 built-in reviews)
  and disable the key in Google Cloud.
