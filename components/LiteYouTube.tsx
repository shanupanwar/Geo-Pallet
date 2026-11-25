"use client";

import { useState } from "react";
import { withBase } from "@/lib/site";

/** YouTube video that loads only when clicked (a picture until then, so the page stays fast). */
export default function LiteYouTube({ id, title, className }: { id: string; title: string; className?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`lite-yt ${className || ""}`}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`Play video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" width={480} height={360} />
          <span className="lite-yt-play" aria-hidden="true" />
        </button>
      )}
      <noscript>
        <a href={withBase(`https://www.youtube.com/watch?v=${id}`)}>{title}</a>
      </noscript>
    </div>
  );
}
