#!/usr/bin/env node
/**
 * SEO check for the built site (the `out/` folder). Runs on every pull request; a failure blocks the merge.
 *
 *   npm run build && npm run seo-check
 *
 * Errors (fail):   missing/duplicate title or description, missing canonical, not exactly one H1,
 *                  image without alt text, broken internal link, invalid structured data,
 *                  missing sitemap.xml / robots.txt, page missing from the sitemap.
 * Warnings (pass): title or description longer/shorter than Google usually shows.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] || "out");
const BASE = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

if (!fs.existsSync(OUT)) {
  console.error(`No build found at ${OUT}. Run "npm run build" first.`);
  process.exit(1);
}

/** All HTML pages in the build. */
function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (name.endsWith(".html")) list.push(p);
  }
  return list;
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decode(m[1]) : null;
};
const metaContent = (html, key, val) => {
  const tag = [...html.matchAll(/<meta\s[^>]*>/gi)].map((m) => m[0]).find((t) => attr(t, key) === val);
  return tag ? attr(tag, "content") : null;
};
const urlPath = (file) => {
  const rel = path.relative(OUT, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return "/" + rel.replace(/index\.html$/, "").replace(/\.html$/, "/");
};

/** Does an internal link point at something that exists in the build? */
function exists(href) {
  let p = href.split("#")[0].split("?")[0];
  if (!p) return true;
  if (BASE && p.startsWith("/") && !p.startsWith(`${BASE}/`) && p !== BASE) return false; // would break on github.io
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  p = decodeURIComponent(p);
  const f = path.join(OUT, p);
  return (
    (fs.existsSync(f) && fs.statSync(f).isFile()) ||
    fs.existsSync(path.join(f, "index.html")) ||
    fs.existsSync(`${f.replace(/\/$/, "")}.html`)
  );
}

const pages = walk(OUT).filter((f) => !/\/(_next|404|_not-found)\b/.test(f) && !f.endsWith("404.html"));
const titles = new Map();
const descs = new Map();
const indexable = [];

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const page = urlPath(file);
  const isRedirect = /http-equiv="refresh"/i.test(html);

  if (!/<html[^>]*\slang="/i.test(html)) err(page, "missing <html lang>");

  const title = decode((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "").trim();
  if (!title) err(page, "missing <title>");

  // Internal links and images are checked on every page, including forwarding pages.
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const href = decode(m[1]);
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    if (!exists(href)) err(page, `broken link → ${href}`);
  }
  for (const m of html.matchAll(/<img\s[^>]*>/gi)) {
    const tag = m[0];
    if (attr(tag, "alt") === null) err(page, `image without alt text: ${attr(tag, "src")}`);
    const src = attr(tag, "src");
    if (src && src.startsWith("/") && !src.startsWith(`${BASE}/_next/image`) && !exists(src)) err(page, `missing image file → ${src}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(m[1]);
    } catch {
      err(page, "structured data (JSON-LD) is not valid JSON");
    }
  }

  if (isRedirect) continue; // forwarding pages only need a working target

  const desc = metaContent(html, "name", "description");
  if (!desc) err(page, "missing meta description");
  const canonical = ([...html.matchAll(/<link\s[^>]*>/gi)].map((m) => m[0]).find((t) => attr(t, "rel") === "canonical") || "").match(/href="([^"]+)"/);
  if (!canonical) err(page, "missing canonical link");
  else if (!/^https:\/\//.test(canonical[1])) err(page, `canonical must be a full https URL (${canonical[1]})`);
  if (!metaContent(html, "property", "og:title")) err(page, "missing share preview (og:title)");
  if (!metaContent(html, "property", "og:image")) err(page, "missing share picture (og:image)");

  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1 !== 1) err(page, `should have exactly one H1 (found ${h1})`);

  if (title.length > 65) warn(page, `title is ${title.length} characters (Google shows about 60)`);
  if (desc && (desc.length < 70 || desc.length > 165)) warn(page, `description is ${desc.length} characters (aim for 120–160)`);

  if (title) titles.set(title, [...(titles.get(title) || []), page]);
  if (desc) descs.set(desc, [...(descs.get(desc) || []), page]);
  indexable.push(page); // every real page must be in the sitemap
}

for (const [t, list] of titles) if (list.length > 1) err(list.join(", "), `same title on several pages: "${t}"`);
for (const [d, list] of descs) if (list.length > 1) err(list.join(", "), `same description on several pages: "${d.slice(0, 60)}…"`);

const sitemapFile = path.join(OUT, "sitemap.xml");
if (!fs.existsSync(sitemapFile)) err("/sitemap.xml", "missing");
else {
  const listed = new Set([...fs.readFileSync(sitemapFile, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
  for (const p of indexable) if (!listed.has(p)) err(p, "not listed in sitemap.xml");
}
if (!fs.existsSync(path.join(OUT, "robots.txt"))) err("/robots.txt", "missing");

console.log(`SEO check: ${pages.length} pages checked.`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  - ${warnings.join("\n  - ")}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log("\nNo SEO errors.");
