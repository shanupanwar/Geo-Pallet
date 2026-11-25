import Image from "next/image";
import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";
import styles from "./PostCard.module.css";

/** Article card used on the Blogs page, category pages and "More Interesting Posts". */
export default function PostCard({ post, compact = false, headingLevel = 2 }: { post: Post; compact?: boolean; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const d = new Date(post.date);
  return (
    <article className={`${styles.card} ${compact ? styles.compact : ""} reveal`}>
      <Link href={`/${post.slug}/`} className={styles.media} tabIndex={-1} aria-hidden="true">
        <Image
          src={post.image}
          alt=""
          width={768}
          height={432}
          sizes={compact ? "(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 300px" : "(max-width: 1024px) 90vw, 600px"}
          className={post.hasImage ? undefined : styles.noImage}
        />
      </Link>
      <div className={styles.body}>
        {!compact ? (
          <time className={styles.badge} dateTime={post.date}>
            <span>{d.toLocaleString("en-CA", { month: "short" }).toUpperCase().replace(".", "")}</span>
            <span>{d.getDate()}</span>
          </time>
        ) : null}
        <H className={styles.title}>
          <Link href={`/${post.slug}/`}>{post.title}</Link>
        </H>
        {compact ? (
          <p className={styles.meta}>
            {post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
        ) : (
          <p className={styles.excerpt}>{post.excerpt}</p>
        )}
      </div>
    </article>
  );
}
