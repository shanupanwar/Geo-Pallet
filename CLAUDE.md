@AGENTS.md

# Geo Pallet website: project context

Read this first in every new chat. It sums up the decisions, preferences and status from earlier
chats so work can continue without asking the same questions again. Keep it up to date when
something important changes (new decision, finished task, new preference).

_Last updated: 2026-11-27._

## What this is

- Rebuild of **geopalletltd.com** (was WordPress) in **Next.js**, with **SEO as the top priority**.
- Business: Geo Pallet Ltd., wooden pallets in British Columbia (Surrey + Langley locations),
  delivery across the Lower Mainland and U.S. border areas (Washington).
- Repo: https://github.com/shanupanwar/Geo-Pallet (public).
- Test site (hidden from Google until go-live): **https://shanupanwar.github.io/Geo-Pallet/**
- The old WordPress theme was deleted from `main`; it is still in git history and the `Old-wordpress` branch.

## How to work with the owner (important)

- The owner is **not technical**. Explain in simple, plain words; no jargon.
- **Ask before deciding or taking any significant step** ("whatever you decide, ask me first";
  "ask query first without assumption"). For design changes, offer 2–3 options (with a simple
  sketch/preview) and let them pick, unless the request is already specific.
- **Push / publish only when the owner says so.** After finishing work: run checks, commit locally,
  then ask "Publish these changes to the test site?".
- **Do not change the homepage video** (`components/HeroVideo.tsx`, `public/video/`). An earlier
  "video polish" was reverted at their request.
- They dislike: cluttered/chaotic layouts, capsule/pill-shaped buttons, duplicate buttons,
  grey boxes on the dark background, faded/colour-filtered photos, double lines between sections,
  sections that copy each other's look, plain browser dropdowns.
- They like: clean Apple/Google-style layouts, calm spacing, dark background with gold accents,
  thin gold dividers, photos in natural colours, one clear action per section.

## Branches and publishing

- `dummy-geo-pallet` = working branch (do all work here).
- `Dummy-Geo-Pallet` (capital letters) is an older branch the owner chose to keep; don't delete it.
- `main` = published. Merging a pull request into `main` deploys to GitHub Pages automatically.
- Publish steps used so far: push `dummy-geo-pallet` → open PR into `main` → wait for the CI check
  ("Lint, types, build and SEO check") to pass → merge → wait for the deploy workflow → check the live site.
- `gh` (GitHub CLI) is **not installed** on this Mac; previous chats used the GitHub REST API with `curl`.
- The owner's GitHub token is in the `gh_token` variable in `~/.zshrc`
  (load with `zsh -ic 'printf %s "$gh_token"'`). Use only via environment; **never print it or
  paste it anywhere.**
- GitHub repo variables used by the deploy: `SITE_URL`, `INDEXABLE` (set to `true` only at go-live),
  `FORM_ENDPOINT` (not set yet).
- Workflows: `.github/workflows/ci.yml` (PRs to main + pushes to dummy-geo-pallet),
  `.github/workflows/deploy.yml` (main → GitHub Pages, basePath `/Geo-Pallet`).

## Running and checking locally

- Node.js is **not installed system-wide** on this Mac. Earlier chats used a downloaded Node in a
  temporary scratch folder. If `node`/`npm` are missing, ask the owner before installing Node.
- `npm run dev` (port 3000; also builds images first), `npm run check` = lint + typecheck + build + SEO check.
- For the GitHub Pages path, build/check with `NEXT_PUBLIC_BASE_PATH=/Geo-Pallet`.
- Always run lint, typecheck, build and `scripts/seo-check.mjs` before committing.

## Tech notes

- Next.js 16 (App Router, Turbopack), static export (`output: "export"`, `trailingSlash`, `basePath`
  from `NEXT_PUBLIC_BASE_PATH`). Read `node_modules/next/dist/docs/` before using Next APIs.
- SEO: `pageMetadata()` helper (title, description, canonical, Open Graph/Twitter, robots); JSON-LD
  (LocalBusiness with Langley department, WebSite, BreadcrumbList, BlogPosting, FAQPage, Service,
  OfferCatalog, VideoObject); `app/sitemap.ts`, `app/robots.ts`; noindex unless `NEXT_PUBLIC_INDEXABLE=true`.
- `scripts/seo-check.mjs` fails the build on: missing title/description/canonical/OG, not exactly
  one H1, image without alt, broken internal links, invalid JSON-LD, duplicate titles/descriptions,
  pages missing from the sitemap (except pages with `<meta name="geo-sitemap" content="exclude">`).
- Images: `scripts/optimize-images.mjs` (sharp → WebP sizes into `public/_img`, gitignored) +
  `lib/image-manifest.json` + `lib/image-loader.ts` (custom next/image loader, adds basePath).
  Image files have descriptive SEO names (e.g. `2026/03/geo-pallet-delivery-truck.jpeg`).
- Blog posts are Markdown files in `content/posts/`.
- Fonts: Manrope (main, `--font-main`) + Poppins. Icons: lucide-react line icons (homepage cards,
  section labels via `components/Eyebrow.tsx`) and Font Awesome SVGs in `components/Icon.tsx`.
- Buttons (`app/globals.css`): gold rectangles (radius 8px, min-height 48px); outline variant; no capsules.

## Homepage (approved) — `app/page.tsx`

Title "Wooden Pallets in BC | Custom & Heat-Treated | Geo Pallet";
H1 "High-Performance Wooden Pallets in British Columbia". Section order:

1. Hero video (unchanged; pause button; muted autoplay)
2. Trust numbers strip (`TrustStrip`)
3. About ("Our Story" button)
4. Products (`ProductTiles`, shadow/spotlight only on hover)
5. Services — **three equal cards**, photo on top in natural colours, text below (`ServiceCards` in `components/HomeCards.tsx`)
6. Why choose us — three columns with thin dividers (`ReasonCards`)
7. Reviews "What Our Customers Say" — two columns: gold Google rating (Surrey 5.0, Langley 4.9, 50 reviews)
   + real Google reviews sliding upward, pause on hover (`Testimonials` in `components/Blocks.tsx`;
   data in `content/data/testimonials.ts`, copied by hand from Google — free option, no Google API)
8. Quote section "Get a Free Pallet Quote" — 3 steps + short quote form (`QuoteSection`)
9. "Industry Association Memberships" — CWPCA + NWPCA logos, no boxes, one thin gold divider between them (`Members`, centered)

Header: logo, centered text menu with gold underline on current page and thin separators, phone
number, one gold "Get a Quote →" link; see-through over the video, dark glass when scrolled.
Footer: three aligned columns (brand + social, contact info, newsletter); bottom bar with ©,
"Announcements & Updates" and "Site Map". `/announcements/` is a placeholder page, noindex and
excluded from the sitemap.

## Forms

- `components/SchemaForm.tsx` renders forms from JSON in `content/forms/*.json` (show/hide rules,
  fold-out sections, hints). Dark variant (homepage/contact) and light variant (pallet inquiry forms).
- `components/Dropdown.tsx`: custom accessible dropdown used for every select field and the CA/US
  phone code (styled list, check mark on chosen option, keyboard support).
- Short quote form (`content/forms/quote.json`): full name, email, phone (CA/US code), company,
  pallet type, heat-treated (Yes/No), quantity, delivery location. On success it offers the
  detailed inquiry form (`/pallet-inquiry-forms/`), pre-filled through sessionStorage (`lib/prefill.ts`).
- Spam protection (`lib/spam.ts`): honeypot, phone validation (fake/555 numbers rejected; area codes
  outside BC/Washington are flagged), throwaway emails rejected, email typo hint, junk names, no links,
  max 3 sends per hour per browser.
- Sending: `submitForm()` in `lib/forms.ts` POSTs JSON (as text/plain, files base64 inside) to
  `NEXT_PUBLIC_FORM_ENDPOINT` (GitHub variable `FORM_ENDPOINT`).
- **Chosen sending service: Google Apps Script** in the owner's Google account
  (`google-apps-script/Code.gs`, owner guide `docs/FORMS-SETUP.md`): re-checks the request, emails
  NOTIFY_EMAIL (Reply-To = customer, "[Check]" subject for flagged), saves uploads to a private Drive
  folder, logs a row per form tab in the Google Sheet, sends the customer a confirmation (not for
  flagged). Secrets (NOTIFY_EMAIL, TURNSTILE_SECRET) live only in Script properties, never in the repo.
  Owner is testing with a test Gmail first. Turnstile (human check) is optional until go-live.
- Until the endpoint is set, forms show "This form isn't connected yet. Please call…".
- Plan for the sending service is in `README.md` (server re-check, Turnstile, MX check, 6-digit
  confirmation code for flagged submissions, "[Check] " subject prefix, send to office@geopalletltd.com).
  The owner wants **free** options only ("I don't want to spend a penny").

## Next steps (status)

1. **Connect the forms**: script and guide are ready. Waiting for the owner to deploy the Apps Script
   and paste the Web app URL (…/exec). Then: set `FORM_ENDPOINT`, test every form end to end
   (quote, inquiry with upload, contact, newsletter), later add Cloudflare Turnstile.
2. **UI/UX for the other pages** (About, Products + pallet pages, Services, Blog, Contact, Inquiry
   forms, Site Map, 404) to match the homepage — show designs for approval first.
3. **Test everything** (links, phones, speed/SEO).
4. Go-live later: point geopalletltd.com to the site, set `SITE_URL` and `INDEXABLE=true`.

## Never commit

`geopalletltd.WordPress.2026-11-21.xml` (export), `content-fixes/` (contains personal emails),
`geo-pallet-theme.zip`, `source-assets/`, `.env*`, any token or password.
