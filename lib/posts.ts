import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked, type Tokens } from "marked";
import { BASE_PATH } from "./site";

/**
 * Blog articles live in content/posts/<slug>.md. The file name is the web address:
 * content/posts/2-way-pallets.md -> /2-way-pallets/
 * To publish a new article, add a file with the same front matter as the others and merge to main.
 */
const DIR = path.join(process.cwd(), "content", "posts");
export const DEFAULT_POST_IMAGE = "/blog-default.svg";

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  updated: string;
  category: string;
  categorySlug: string;
  categories: string[];
  image: string;
  imageAlt: string;
  hasImage: boolean;
  html: string;
  readingMinutes: number;
  excerpt: string;
};

const YT = /^https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})\S*$/;

function renderer() {
  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      paragraph(token: Tokens.Paragraph) {
        const raw = token.raw.trim();
        const yt = raw.match(YT);
        if (yt) {
          // Light video: a picture until clicked (keeps pages fast). Hydrated by components/VideoFacade.
          return `<div class="yt" data-yt="${yt[1]}"><img src="https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg" alt="Video" loading="lazy" width="480" height="360"><button type="button" class="yt-play" aria-label="Play video"></button></div>\n`;
        }
        return `<p>${this.parser.parseInline(token.tokens)}</p>\n`;
      },
      link(token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = token.href.startsWith("/") ? `${BASE_PATH}${token.href}` : token.href;
        const external = /^https?:/.test(href);
        return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
      },
      image(token: Tokens.Image) {
        const src = token.href.startsWith("/") ? `${BASE_PATH}${token.href}` : token.href;
        return `<img src="${src}" alt="${token.text.replace(/"/g, "&quot;")}" loading="lazy" decoding="async">`;
      },
      table(token: Tokens.Table) {
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const body = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`).join("");
        return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
      },
    },
  });
  return md;
}

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache; // in development, always re-read so edits show at once
  const md = renderer();
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      const words = content.split(/\s+/).filter(Boolean).length;
      const plain = content.replace(/^#.*$/gm, "").replace(/[*_>#`[\]()|-]/g, " ").replace(/https?:\S+/g, "").replace(/\s+/g, " ").trim();
      const image = data.image ? String(data.image) : DEFAULT_POST_IMAGE;
      return {
        slug,
        title: String(data.title),
        seoTitle: String(data.seoTitle || data.title),
        description: String(data.description || plain.slice(0, 155)),
        date: String(data.date),
        updated: String(data.updated || data.date),
        category: String(data.category || "Uncategorized"),
        categorySlug: String(data.categorySlug || "uncategorized"),
        categories: (data.categories as string[]) || [String(data.categorySlug || "uncategorized")],
        image,
        imageAlt: String(data.imageAlt || data.title),
        hasImage: Boolean(data.image),
        html: md.parse(content) as string,
        readingMinutes: Math.max(1, Math.round(words / 220)),
        excerpt: plain.split(" ").slice(0, 10).join(" ") + " ...",
      } satisfies Post;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Articles shown on the Blogs page: everything except "Uncategorized"-only posts (same rule as the WordPress site). */
export function getBlogPosts(): Post[] {
  return getAllPosts().filter((p) => p.categories.some((c) => c !== "uncategorized"));
}

export function getCategories(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of getBlogPosts()) {
    const cur = map.get(p.categorySlug) || { slug: p.categorySlug, name: p.category, count: 0 };
    cur.count += 1;
    map.set(p.categorySlug, cur);
  }
  return [...map.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}
