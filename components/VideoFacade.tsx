"use client";

import { useEffect } from "react";

/** Turns article video pictures (.yt) into the real YouTube player when clicked. */
export default function VideoFacade() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const box = (e.target as HTMLElement).closest<HTMLElement>(".yt");
      if (!box || box.querySelector("iframe")) return;
      const id = box.dataset.yt;
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      f.title = "YouTube video";
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      box.appendChild(f);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
