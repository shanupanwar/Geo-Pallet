#!/usr/bin/env node
/**
 * Makes small, fast WebP copies of every picture the site uses (runs automatically before
 * "npm run dev" and "npm run build"). GitHub Pages can't resize pictures on the fly, so we do it here.
 *
 *   public/wp-content/uploads/2025/12/2-Way-Pallet.png
 *     -> public/_img/wp-content/uploads/2025/12/2-Way-Pallet-640.webp (and other widths)
 *
 * lib/image-manifest.json records which widths exist; lib/image-loader.ts picks the right one.
 * Already-made copies are skipped, so re-runs are quick.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "_img");
const WIDTHS = [384, 640, 960, 1280, 1920];
const SCAN = ["app", "components", "content", "lib"];

/** Every picture path mentioned in the site's code and content. */
function usedImages() {
  const found = new Set();
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|json|md|css)$/.test(name) && name !== "image-manifest.json") {
        const text = fs.readFileSync(p, "utf8");
        for (const m of text.matchAll(/(\/(?:wp-content\/uploads\/[^"'`\s)]+|[\w-]+)\.(?:png|jpe?g|webp))/gi)) found.add(m[1]);
      }
    }
  };
  SCAN.forEach((d) => fs.existsSync(path.join(ROOT, d)) && walk(path.join(ROOT, d)));
  return [...found].filter((src) => fs.existsSync(path.join(PUBLIC, src)));
}

const manifest = {};
let made = 0;
for (const src of usedImages().sort()) {
  const file = path.join(PUBLIC, src);
  const meta = await sharp(file).metadata();
  const widths = WIDTHS.filter((w) => w < meta.width);
  widths.push(Math.min(meta.width, 2560)); // the full size (capped) as the largest option
  const unique = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of unique) {
    const out = path.join(OUT, src.replace(/\.\w+$/, `-${w}.webp`));
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(file).mtimeMs) continue;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    made += 1;
  }
  manifest[src] = unique;
}

fs.writeFileSync(path.join(ROOT, "lib", "image-manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`Pictures: ${Object.keys(manifest).length} used, ${made} new WebP copies made.`);
