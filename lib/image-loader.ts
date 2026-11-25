import manifest from "./image-manifest.json";

const SIZES = manifest as Record<string, number[]>;

/**
 * Picture loader for next/image (set in next.config.ts). Points each picture at the right-sized
 * WebP copy made by scripts/optimize-images.mjs, and adds the GitHub Pages base path.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (/^https?:/.test(src)) return src;
  const widths = SIZES[src];
  if (!widths) return `${base}${src}`; // SVGs and anything not optimized
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `${base}/_img${src.replace(/\.\w+$/, `-${w}.webp`)}`;
}
