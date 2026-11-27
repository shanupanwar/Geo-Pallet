# Geo Pallet Ltd. website (Next.js)

The geopalletltd.com website, rebuilt in Next.js with SEO as the main priority. It is exported as
plain static pages and published to **GitHub Pages** automatically.

- **Test address:** https://shanupanwar.github.io/Geo-Pallet/ (hidden from Google until go-live)
- **Real address (later):** https://geopalletltd.com

---

## How the branches work

| Branch | What it is for |
|---|---|
| `dummy-geo-pallet` | Your everyday work branch. Make changes here. |
| `main` | The live site. **Anything merged into `main` is published automatically.** |

1. Work on `dummy-geo-pallet` and push it.
2. On GitHub, open a **pull request** from `dummy-geo-pallet` into `main`.
3. GitHub runs the **Check** pipeline (code checks, build, SEO check). Wait for the green tick.
4. Click **Merge**. The **Deploy to GitHub Pages** pipeline publishes the site in about 2–3 minutes.

The pipelines live in `.github/workflows/`:
- `ci.yml` (**Check**): runs on every pull request into `main` and on pushes to `dummy-geo-pallet`.
- `deploy.yml` (**Deploy to GitHub Pages**): runs on every push/merge to `main` (or by hand from the Actions tab).

## One-time GitHub settings (do these once)

1. **Make the repository public:** Settings → General → Danger Zone → *Change visibility* → Public.
   (GitHub Pages is free only for public repositories.)
2. **Turn on Pages:** Settings → Pages → *Build and deployment* → Source: **GitHub Actions**.
3. **Require the check before merging:** Settings → Branches → *Add branch ruleset* (or *Add rule*) for `main`:
   tick *Require a pull request before merging* and *Require status checks to pass*, and choose
   **Lint, types, build and SEO check**.

## Running it on your computer

Needs Node.js 22.

```bash
npm install        # first time only
npm run dev        # opens the site at http://localhost:3000
npm run check      # the same checks GitHub runs: lint, types, build, SEO
```

## Everyday changes

| To change… | Edit… |
|---|---|
| Phone numbers, email, addresses, hours, social links | `lib/site.ts` (`BUSINESS`) |
| Top menu | `lib/site.ts` (`NAV`) |
| A page's text | `app/<page>/page.tsx` (e.g. `app/about/page.tsx`) |
| Google title / description of a page | the `pageMetadata({ title, description })` at the top of that page file |
| Customer reviews | `content/data/testimonials.ts` |
| Contact-page FAQ | `content/data/faq.ts` |
| Form fields, show/hide rules | `content/forms/*.json` |
| Colours, fonts, spacing | `app/globals.css` (variables at the top) |

### Adding a blog article

1. Copy any file in `content/posts/`, e.g. `content/posts/2-way-pallets.md`.
2. Rename it. **The file name becomes the web address**: `pallet-sizes.md` → `/pallet-sizes/`.
3. Edit the top part (between the `---` lines):

   ```yaml
   title: 'Your article title'
   seoTitle: 'Title shown on Google (about 60 characters)'
   description: 'One or two sentences for Google, 120–160 characters.'
   date: '2026-12-01T09:00:00'
   updated: '2026-12-01T09:00:00'
   category: WOODEN PALLETS & SOLUTIONS
   categorySlug: wooden-pallets-solutions
   categories:
     - wooden-pallets-solutions
   image: /wp-content/uploads/2026/12/my-picture.jpg   # put the picture in public/ at this path
   imageAlt: 'What the picture shows'
   ```

4. Write the article below in Markdown (`## Heading`, `**bold**`, `- list item`, `[link](/about/)`).
   A YouTube link on a line of its own becomes a video.
5. Push, open a pull request, merge. It appears on the Blogs page, in the sitemap, and in Google's data.

## SEO built in

- Every page has its own Google title, description and canonical address.
- Share previews (Open Graph / X) with a picture on every page.
- Structured data for Google: LocalBusiness (both locations, hours, phone), WebSite, BreadcrumbList,
  BlogPosting for articles, FAQPage on Contact, Service on Services, an OfferCatalog of products.
- `sitemap.xml` and `robots.txt` are generated on every build.
- One H1 per page; alt text on every picture; clean addresses identical to the WordPress site.
- Fast pages: static HTML, self-hosted fonts, WebP pictures in several sizes (`npm run images`),
  videos load only when played, almost no JavaScript.
- Old WordPress addresses (`/aboutgeo/`, `/services/`, `/contact/` …) forward to the right page (`lib/redirects.ts`).
- The SEO check (`scripts/seo-check.mjs`) fails the build on missing titles/descriptions, duplicate titles,
  missing alt text, broken links, invalid structured data, or pages missing from the sitemap.

## Going live on geopalletltd.com (later)

1. Settings → Pages → *Custom domain*: `geopalletltd.com`, and tick *Enforce HTTPS*.
2. At your domain provider, point the domain at GitHub Pages (GitHub shows the exact DNS records).
3. Settings → Secrets and variables → Actions → **Variables** → add `INDEXABLE` = `true`.
4. Re-run **Deploy to GitHub Pages** from the Actions tab. Google can now list the site.
5. Connect Google Search Console and submit `https://geopalletltd.com/sitemap.xml`.

## Forms

All forms (quote, contact, newsletter, the 6 pallet inquiry forms) are complete: fields, checks,
show/hide rules and thank-you messages. **Sending is not connected yet**: the forms API will be built
later. Until then, submitting shows a message with the phone number and email.

When the API exists, set the repository variable `FORM_ENDPOINT` to its address. Every form then POSTs
`{ form, fields: [{ label, value }], page, flags, suspicious }` (as JSON, or multipart with `payload` + `files` when a file is attached).

### Spam protection (agreed 2026-11-27)

Already in the browser (`lib/spam.ts`):
- **Blocked:** impossible phone numbers (wrong length, area codes that don't exist, 555-01xx, 111 111 1111),
  throwaway email services, broken emails, web links in text fields, over-long text, names with digits,
  a hidden robot trap, forms sent within 3 seconds, more than 3 sends per hour from one browser.
- **Flagged, not blocked:** phone numbers outside BC / Washington State, placeholder-looking emails
  (`test@`, `abcd@`, `asdf@`…). Flags travel with the submission in `flags`.
- Email typos get a "Did you mean …?" hint (e.g. gmial.com → gmail.com).

The forms API must (a robot can skip the browser):
1. Repeat every check above on the server.
2. Verify a Cloudflare Turnstile token (free, invisible bot check), limit sends per IP address.
3. Check that the email's domain can receive mail (MX record).
4. If anything is flagged: email the visitor a 6-digit confirmation code; deliver to
   office@geopalletltd.com only after it's entered. Otherwise deliver with **"[Check] "** at the start of
   the subject, so nothing genuine is lost.
5. Clean submissions go to office@geopalletltd.com as normal.

> GitHub Pages only serves static files, so the forms API has to run somewhere else
> (for example a serverless function or a small server).
