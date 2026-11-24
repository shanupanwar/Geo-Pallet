# Geo Pallet theme: handover checklist

Theme folder: `geo-pallet-theme/` (zip: `geo-pallet-theme.zip`). It is a classic WordPress theme with no Elementor, Astra or UAEL required.

## How it was built
- Each page's markup is the **live HTML** from geopalletltd.com (captured 2026-11-21), cleaned of plugin scripts. The CSS is the live stylesheets, stored inside the theme under `assets/site/` (Astra, Elementor/Pro and UAEL CSS, the Elementor per-page CSS, fonts and icons).
- Interactive widgets are rewritten in `assets/js/geo.js`. They read the same Elementor settings as the live site.
- `tools/build.rb`, then `tools/dynamize.rb`, then `tools/fixups.rb` regenerate `partials/` from fresh captures in `source-assets/html/`, followed by `tools/responsive.rb` (see "Responsive layout" below). The fixups step re-applies the approved link fixes and image descriptions (REVIEW.md).

## Content fixes approved 2026-11-22 (REVIEW.md), verified on staging
- **26 dead links repointed** to real pages: the 20 links on Home, About, Products, Services and Site Map, plus the Cancel button on all 6 inquiry forms. These are built into the theme, and no dead links remain.
- **2 deleted articles restored** at their old addresses, so the About and Products "Read More" buttons work: `/geo-pallet-logo/` and `/custom-pallets-made-to-your-load/`. Both are filed under "Uncategorized", so, as on live, they don't appear on the Blogs grid.
- **Google titles and descriptions** set for the 4 newest articles, plus a title for the inquiry page.
- **Image descriptions** added to 21 theme images and the blog featured images. Decorative icons stay empty on purpose.

## Verified on a staging WordPress (WordPress 7.1.5, PHP 8.3, your XML imported)
- **Every page type renders on the theme with no PHP errors:** the 9 pages, a blog post, a category page and a 404.
- **Desktop (1440px)**, compared element by element against live (±2px): Home, About, Products, Services, Contact, Contact form and Site Map match. So do the BLOGS grid (card positions within 3px), a single post (same height, gallery and related posts) and the category page (identical).
- **Phone (390px):** About, Products, Services, Contact, Contact form and Site Map have the same section heights as live. On Home, only the auto-scrolling testimonials block differs, and its height varies between live page loads too.
- **Tablet (800px):** matched live before the responsive fix. Tablets now intentionally use the phone layout (see "Responsive layout").
- **Inquiry page, all 6 pallet forms:** the same fields are visible as on live, page heights match within 2px, and the mobile info icons and Cancel button are present. On the Block form, choosing a type and opening a section produces the same fields and the same page height as live.
- **Phone menu:** it opens full-width with the same items and buttons as live.
- **Page structure:** the element tree of each static page, the header and the footer matches the live DOM exactly (checked with a hash of each tree).

## Not verified
- Real email delivery from the live server. The test copy can't send email, so each test email was saved and read back instead. Complete step 5 below on the live site.
- Comments with real replies: none exist on live to compare against.

## Intentional differences from live (decided 2026-11-22: keep the cleaner behaviour)
- **Phone menu, PRODUCTS submenu:** on live, tapping PRODUCTS overlays "Pallet Types / Crate Types" on top of HOME/ABOUT. The theme expands it below PRODUCTS.
- **Comments are off** (decided 2026-11-22). Live received 127 comments, all spam, so the "Leave a Comment" form under posts is removed and comments are disabled site-wide.
- **Home quote form, phone field:** the site's custom script combines the country code and phone number into one field on the blog sidebar, but on live it never does this on the Home page. The theme combines them on both, as the script intends.

## Live-site problems found (not caused by the theme)
- The featured images of the 4 newest posts are missing on the live server, and their URLs redirect to the home page. These are "Do Canada to U.S. Wood Pallets Need ISPM-15 Stamps?", "Single vs. Dual Pallet Supply", "Why Your Plant Runs Out of Pallets" and "Why the Cheapest Pallet Quote Is the Most Costly". Re-upload the originals (`2026/10/WhatsApp-Image-2026-10-29-at-1.03.42`–`1.03.45-PM.jpeg`).

## Small improvements approved 2026-11-22 (design otherwise unchanged)
- **Forms email office@geopalletltd.com**, with a thank-you message and a copy to the customer. Spam protection: a hidden box only robots fill in, rejecting forms sent within 3 seconds of the page opening, and at most 10 sends per visitor per hour.
- **Homepage, computers:** a still picture from your video (`assets/img/home-hero-poster.jpg`) now fills the top area until the video starts, so it's never an empty black box.
- **Blog:** articles with no picture, or whose picture file is missing, show a branded Geo Pallet picture (`assets/img/blog-default.svg`).
- **Images shrunk:** the theme's images went from 48 MB to 39 MB with no visible change, and 15 broken files were removed (see below). The large see-through product pictures can be shrunk further by installing the free **EWWW Image Optimizer** plugin, which your live site already uses.
- **Footer:** business hours added under Contact Info, with the same wording as the Contact page.

## Responsive layout (approved 2026-11-22)
The live design only really works on phones and on wide computer screens. On tablets, small laptops and narrow windows, text overlapped and some things were cut off at the screen edge. The live site has the same problems. Fixes:
- **Up to 1024px wide, the site uses its existing phone layout.** That covers phones, tablets and narrow windows: sections stack one under another instead of being squeezed side by side. This is done by `tools/responsive.rb`, which moves the phone/computer switch point from 767px to 1024px in the captured styles. Screens 1025px and wider keep the original computer look.
- **Small laptops (1025–1240px):** the top-bar buttons size to their text and the menu items sit slightly closer, so "GET A QUOTE" is no longer cut off.
- **Enlarged product pictures** (Products and Services) are shrunk or nudged just enough to stay inside the screen. Pictures that already fit are unchanged.
- **Smaller fixes**, in `assets/css/geo-responsive.css`, each with a plain-English note:
  - Hero texts no longer use a fixed phone width on tablets, and the Home hero is centred.
  - The Site Map title no longer slides off the left edge below 1240px.
  - The Services slider arrows stay inside the screen on laptops.
  - The blog cards and the "Pallet Solutions" circle get a little side room on laptops.
  - Long animated headlines wrap instead of running off small phones.
  - Nothing can make the page scroll sideways.
- **Home hero on phones and tablets:** its background picture is missing on the live server too, so it now shows the still frame from the homepage video.
- **Checked automatically** on all 12 page types at 14 screen widths (320–1920px), for text overlapping text and anything cut off at the screen edge.

## More live-site problems found (decide later; nothing changed)
- **Location pin icon on the Contact page** (`icons8-location-50.png`) is missing on your live server, so it shows as a broken image there and in the theme.
- **Homepage background picture on phones** (`2026/09/Mobile-hero-image.png`) is missing on the live server.
- Also missing on live but not shown anywhere: `abstract-round-wires-background…jpg`, `IMG_7586-scaled.jpeg`, `new-wooden-stacked-pallets…jpg` and two old screenshots.

## Google Search improvements (approved 2026-11-23), verified on staging
Everything is in `inc/seo.php`. Visitors see nothing different.
- **Business card for Google:** the Home, Contact and Contact form pages carry hidden business details that Google reads (schema.org LocalBusiness): name, the Surrey address plus Langley as a second location, phone 604 584 4368, office@geopalletltd.com, hours, logo and the Facebook/Instagram/LinkedIn/YouTube pages. To change these, edit `geo_seo_business()`.
- **Page titles and descriptions:** each page now shows its Google title and description (the ones already saved in Yoast) even if Yoast isn't installed. When Yoast is active it takes over again, so nothing is doubled.
- **Share previews:** links shared on Facebook, WhatsApp, LinkedIn or X show a title, a summary and a picture. Blog posts use their own picture, and other pages use the homepage pallet photo. Yoast prints its own previews when it's active.

## You need to do
1. **Import content.** Use Tools → Import → WordPress with `geopalletltd.WordPress.2026-11-21.xml` and tick "Download and import file attachments". This brings in the 15 published posts, featured images and categories. Page slugs must stay as on live (`about`, `custom-pallets-british-columbia`, `pallet-supplier-british-columbia`, `blogs-geopallet`, `contact-geo-pallet`, `contact-form`, `pallet-inquiry-forms`, `contact-us_geopallet-site-map`).
2. **Settings → Reading:** set the front page to the static page "HOME".
3. **Settings → Permalinks:** set to "Post name" (`/%postname%/`), as on live.
4. **Apply the approved content fixes,** which live in the `content-fixes/` folder:
   - Import `restore-2-articles.xml` with the same WordPress importer. It restores the 2 deleted articles.
   - Run `apply-seo-and-alt.php` once, after both imports and with Yoast active, using `wp eval-file apply-seo-and-alt.php`. Without WP-CLI, copy it into the WordPress root, open it once in the browser, then delete it. It sets the Google titles and descriptions and the blog image descriptions, and is safe to run again.
   - In Yoast's settings, set the site address to the non-www version so Google sees one address.
5. **Form emails: they now work.** Every form (all 12, including the 6 pallet inquiry forms and the footer newsletter) emails **office@geopalletltd.com**. The customer also gets a short copy of what they sent (not for newsletter sign-ups). Files attached on the inquiry forms (up to 20 MB) come with the email. The thank-you messages are the same as on live. To make sure these emails don't go to spam on the live site:
   - Install the free plugin **WP Mail SMTP** and connect it to the email account for office@geopalletltd.com, using your email provider's settings (Google Workspace, Microsoft 365, or your host's mail).
   - In WP Mail SMTP, set "From Email" to office@geopalletltd.com and "From Name" to Geo Pallet Ltd. Website.
   - Use WP Mail SMTP's "Email Test" tool, then send one real test from the Contact page.
   - To change the receiving address later, edit one line in `inc/forms.php` (`geo_form_recipient`).
6. **Upload size.** The zip is about 40 MB. If WordPress rejects it, upload the folder over SFTP to `wp-content/themes/` or raise the upload limit.
7. **Plugins the live site uses that the theme deliberately leaves out.** Install them only if you still want them:
   - Yoast SEO: page titles and meta descriptions. These are stored in the XML, so they return once Yoast is active.
   - CookieYes (cookie-law-info): the consent banner and the round icon bottom-left.
   - Google Site Kit / Analytics tag GT-TWD63HNW and the Facebook Pixel: tracking scripts are not included.
   - Redirects: every link on the site now points to a real page, but other websites and old Google results may still use `/aboutgeo/`, `/contact/`, `/services/`, `/products/`, `/geoblogs/` or `/wooden-pallet-solutions/`. On live these 301 to the home page, so recreate those redirects with a redirect plugin or server rules.
8. **Google Search Console** (free; it shows how Google sees your site and lets you send it your page list). Do this after the new theme is live.
   1. Open https://search.google.com/search-console and sign in with the Google account you use for the business. Live used Google Site Kit, so geopalletltd.com may already be listed at the top left. If it is, skip to step 4.
   2. Click **Add property**, choose **URL prefix**, and type `https://geopalletltd.com/`.
   3. Prove the site is yours. Pick **HTML tag** and copy the long code inside `content="…"`. In WordPress, go to **Yoast SEO → Settings → Site connections**, paste it into the Google box, save, and click **Verify** in Search Console. Without Yoast, use the **DNS record** option instead and give the code to whoever manages your domain.
   4. In the left menu, open **Sitemaps** and submit `sitemap_index.xml` if Yoast is active, or `wp-sitemap.xml` without it. That's the list of all your pages.
   5. Paste the home page address into **URL inspection** at the top and click **Request indexing**. Do the same for Products, Services, About and Contact. Google then re-reads them sooner.
   6. Each week for the first month, open **Pages** (under Indexing) and look for "Not found (404)". Any old address listed there needs a redirect (see step 7).
   7. Also worth doing (outside the website): claim or update your free **Google Business Profile** at https://business.google.com with the same address, phone and hours. That's what shows you on Google Maps.

## Differences from live (approximations)
- **Animated headlines** (About and Products "clip"/"typing", Contact-form "highlight" circle) are rewritten to look the same, but timing may differ slightly.
- **Scroll effects** (About story opacity fade, background parallax) are close approximations of Elementor Pro Motion Effects.
- **Comments list:** live posts have no comments, so the markup for a list of comments follows Astra's structure but couldn't be checked against live. The comment form markup is the live one.
- **GSAP** (About "Our Story" scroll section) now loads from the theme (v3.11.0) instead of the third-party `nicolaipalmkvist.com` copy.
- **Missing asset:** `elementor/assets/mask-shapes/circle.svg` is referenced by Elementor CSS but returns 404 on live too, so nothing is visible either way.
- **Fonts:** the site's fonts (Be Vietnam Pro, Poppins, Lora) are served locally from the theme, as they were on live.
