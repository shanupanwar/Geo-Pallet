"use client";

import { useEffect, useState } from "react";

/**
 * Home page background video. The still picture shows at once (fast first paint, good for Google);
 * the YouTube video is added only on computers, after the page has finished loading.
 */
export default function HeroVideo({ id }: { id: string }) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const ok = window.matchMedia("(min-width: 1025px) and (prefers-reduced-motion: no-preference)").matches;
    if (!ok) return;
    const start = () => setTimeout(() => setPlay(true), 800);
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }, []);
  if (!play) return null;
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1`;
  return <iframe className="hero-video" src={src} title="Geo Pallet video" allow="autoplay; encrypted-media" tabIndex={-1} aria-hidden="true" />;
}
