"use client";

import { useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/site";
import Icon from "./Icon";

/**
 * Home page video (public/video/geo-pallet-hero.mp4, 1280×542, black background).
 * The whole video is always visible (never cropped): it scales to the screen width, and the
 * matching black page background fills any space around it. Plays silently on a loop, with a
 * pause button; people who ask their device for less motion get the still picture.
 */
export default function HeroVideo({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const src = withBase("/video/geo-pallet-hero.mp4");
  const poster = withBase("/video/geo-pallet-hero-poster.jpg");

  useEffect(() => {
    const v = box.current?.querySelector("video");
    if (!v) return;
    const sync = () => setPaused(v.paused);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    return () => {
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
    };
  }, []);

  const toggle = () => {
    const v = box.current?.querySelector("video");
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <div ref={box} className={className}>
      {/* Written as plain HTML so "muted" is in the page itself, which phones require for autoplay. */}
      <div
        className="hero-video-box"
        dangerouslySetInnerHTML={{
          __html: `<video class="hero-video" autoplay muted loop playsinline preload="auto" poster="${poster}" aria-label="3D animation of a Geo Pallet wooden pallet being assembled"><source src="${src}" type="video/mp4"></video>`,
        }}
      />
      <button type="button" className="hero-video-toggle" onClick={toggle} aria-label={paused ? "Play video" : "Pause video"}>
        <Icon name={paused ? "play" : "pause"} />
      </button>
    </div>
  );
}
