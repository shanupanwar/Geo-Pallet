"use client";

import { useEffect } from "react";

/** Marks the header as "scrolled" once the page moves, so it shrinks and turns glassy. */
export default function HeaderScroll() {
  useEffect(() => {
    const header = document.getElementById("top");
    if (!header) return;
    const update = () => header.toggleAttribute("data-scrolled", window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return null;
}
