import {
  Award, BadgeCheck, BookOpen, Boxes, Building2, ClipboardList, Images, Leaf, Lightbulb, MapPin, MessageSquareQuote,
  Package, Sparkles, ThumbsUp, Wrench, type LucideIcon,
} from "lucide-react";

/** Each section label gets an icon that matches its topic (picked from the label text). */
const BY_TOPIC: [RegExp, LucideIcon][] = [
  [/about|company/i, Building2],
  [/product/i, Boxes],
  [/service|supplier|repair/i, Wrench],
  [/quality|perform/i, Award],
  [/testimonial|review/i, MessageSquareQuote],
  [/quote/i, ClipboardList],
  [/association|member/i, BadgeCheck],
  [/story/i, BookOpen],
  [/innovation/i, Lightbulb],
  [/logo|symbol|identity/i, Leaf],
  [/gallery/i, Images],
  [/why choose/i, ThumbsUp],
  [/visit|location|nearby/i, MapPin],
  [/heard/i, Sparkles],
];

export default function Eyebrow({ children, icon, as: Tag = "p" }: { children: React.ReactNode; icon?: LucideIcon; as?: "p" | "span" }) {
  const text = typeof children === "string" ? children : Array.isArray(children) ? children.join("") : "";
  const I = icon || BY_TOPIC.find(([re]) => re.test(text))?.[1] || Package;
  return (
    <Tag className="eyebrow">
      <I strokeWidth={1.75} aria-hidden="true" /> {children}
    </Tag>
  );
}
