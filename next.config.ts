import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH is "/Geo-Pallet" on the github.io test address and "" on a custom domain.
 * The deploy workflow sets it automatically.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // same URLs as the WordPress site: /about/, /2-way-pallets/
  basePath,
  // GitHub Pages has no image server: pictures are pre-sized by scripts/optimize-images.mjs
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts", deviceSizes: [384, 640, 960, 1280, 1920], imageSizes: [64, 128, 256] },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
