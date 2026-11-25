"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import styles from "@/app/about/about.module.css";

export type StoryItem = { icon: string; title: string; lead: string; body: React.ReactNode; image: string };

/**
 * About page "Our Story": on computers the photo stays in place and changes as each story part
 * scrolls past; on phones each part shows its own photo. All text is in the page for Google.
 */
export default function StoryScroller({ items }: { items: StoryItem[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className={styles.story}>
      <div className={styles.storyMedia}>
        <p className="eyebrow">Our Story</p>
        <div className={styles.storyPhotos}>
          {items.map((it, i) => (
            <Image
              key={it.image}
              src={it.image}
              alt={i === active ? it.title : ""}
              fill
              sizes="(max-width: 1024px) 100vw, 530px"
              className={`${styles.storyPhoto} ${i === active ? styles.on : ""}`}
            />
          ))}
        </div>
      </div>
      <div className={styles.storyText}>
        {items.map((it, i) => (
          <section key={it.title} data-i={i} ref={(el) => { refs.current[i] = el; }} className={styles.storyPart}>
            <Image src={it.image} alt={it.title} width={768} height={576} sizes="100vw" className={styles.storyPhotoMobile} />
            <span className={styles.storyIcon}><Icon name={it.icon} /></span>
            <h2 className={styles.storyTitle}>{it.title}</h2>
            <p className={styles.storyLead}>{it.lead}</p>
            {it.body}
          </section>
        ))}
      </div>
    </div>
  );
}
