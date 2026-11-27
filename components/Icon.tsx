import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
import {
  faPallet, faTruckMoving, faHammer, faFire, faArrowRight, faChevronDown, faPhone, faEnvelope,
  faLocationDot, faBars, faXmark, faAnglesRight, faCheck, faCircleCheck, faClock, faStar, faPlay,
  faArrowUp, faBoxOpen, faIndustry, faAward, faLeaf, faCircleInfo, faPaperclip, faClipboardCheck, faPeopleCarryBox,
  faWarehouse, faPeopleArrows, faArrowUpWideShort, faChevronLeft, faChevronRight, faRecycle, faTruckFast, faRulerCombined, faPause, faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faClock as farClock } from "@fortawesome/free-regular-svg-icons";
import { faFacebookF, faGoogle, faLinkedinIn, faInstagram, faTiktok, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";

/** Icons used on the site, drawn as inline SVG (no icon font, no JavaScript). */
const ICONS: Record<string, IconDefinition> = {
  pallet: faPallet, truck: faTruckMoving, hammer: faHammer, fire: faFire, arrowRight: faArrowRight,
  chevronDown: faChevronDown, phone: faPhone, envelope: faEnvelope, location: faLocationDot, bars: faBars,
  close: faXmark, anglesRight: faAnglesRight, check: faCheck, circleCheck: faCircleCheck, clock: faClock,
  clockRegular: farClock, star: faStar, play: faPlay, arrowUp: faArrowUp, box: faBoxOpen, industry: faIndustry,
  award: faAward, leaf: faLeaf, info: faCircleInfo, paperclip: faPaperclip, clipboardCheck: faClipboardCheck,
  peopleCarry: faPeopleCarryBox, warehouse: faWarehouse, peopleArrows: faPeopleArrows, sortUp: faArrowUpWideShort,
  chevronLeft: faChevronLeft, chevronRight: faChevronRight, recycle: faRecycle, truckFast: faTruckFast, ruler: faRulerCombined, pause: faPause, external: faArrowUpRightFromSquare,
  google: faGoogle, facebook: faFacebookF, linkedin: faLinkedinIn, instagram: faInstagram, tiktok: faTiktok, twitter: faXTwitter, youtube: faYoutube,
};

export type IconName = keyof typeof ICONS;

export default function Icon({ name, className, title }: { name: IconName | string; className?: string; title?: string }) {
  const def = ICONS[name];
  if (!def) return null;
  const [w, h, , , path] = def.icon;
  return (
    <svg
      className={`icon${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      fill="currentColor"
    >
      {title ? <title>{title}</title> : null}
      {Array.isArray(path) ? path.map((d, i) => <path key={i} d={d} />) : <path d={path} />}
    </svg>
  );
}
