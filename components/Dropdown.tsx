"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./SchemaForm.module.css";

type Option = { value: string; label: string };

/**
 * Our own dropdown, replacing the browser's plain list. The closed field looks like the other fields;
 * the open list is a styled panel with a check mark on the chosen option.
 * Keyboard: Enter/Space/↓ opens, ↑/↓/Home/End move, Enter picks, Esc closes, typing a letter jumps to it.
 */
export default function Dropdown({
  id,
  value,
  options,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  invalid,
  describedBy,
  ariaLabel,
  className,
  compact,
}: {
  id?: string;
  value: string;
  options: Option[];
  placeholder?: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
  ariaLabel?: string;
  className?: string;
  compact?: boolean;
}) {
  const listId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [active, setActive] = useState(0);

  const selected = options.findIndex((o) => o.value === value);
  const current = selected >= 0 ? options[selected] : null;

  const show = () => {
    const r = button.current?.getBoundingClientRect();
    if (r) setUp(window.innerHeight - r.bottom < Math.min(options.length * 46 + 16, 320) && r.top > window.innerHeight - r.bottom);
    setActive(selected >= 0 ? selected : 0);
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    close();
  };

  // close when clicking anywhere else on the page
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // keep the highlighted option in view
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key.length === 1) {
      const k = e.key.toLowerCase();
      const i = options.findIndex((o, j) => j > active && o.label.toLowerCase().startsWith(k));
      const first = options.findIndex((o) => o.label.toLowerCase().startsWith(k));
      if (i >= 0 || first >= 0) setActive(i >= 0 ? i : first);
    }
  };

  return (
    <div ref={wrap} className={`${styles.dd} ${compact ? styles.ddCompact : ""} ${className || ""}`}>
      <button
        ref={button}
        id={id}
        type="button"
        className={`${styles.ddButton} ${current ? "" : styles.ddEmpty}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKey}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <span className={styles.ddValue}>{current ? current.label : placeholder || "Select"}</span>
        <svg className={styles.ddArrow} viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul ref={list} id={listId} role="listbox" className={`${styles.ddList} ${up ? styles.ddUp : ""}`} hidden={!open} tabIndex={-1}>
        {options.map((o, i) => (
          <li
            key={o.value}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === selected}
            className={`${styles.ddOption} ${i === active ? styles.ddActive : ""}`}
            onPointerEnter={() => setActive(i)}
            onPointerDown={(e) => e.preventDefault()} // keep focus on the button
            onClick={() => pick(i)}
          >
            <span>{o.label}</span>
            {i === selected ? (
              <svg className={styles.ddCheck} viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8.5l3.2 3.2L13 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
