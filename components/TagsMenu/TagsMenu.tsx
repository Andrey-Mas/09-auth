"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const TAGS = [
  "All",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
  "Todo",
] as const;
type UITag = (typeof TAGS)[number];

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // клік поза меню / Esc — закриваємо
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className={css.container} ref={ref}>
      {/* Кнопка меню */}
      <button
        type="button"
        data-tags-trigger
        className={css.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Notes ▾
      </button>

      {open && (
        <ul role="menu" className={css.menu}>
          {TAGS.map((tag: UITag) => {
            const href =
              tag === "All"
                ? "/notes"
                : `/notes/filter/${encodeURIComponent(tag)}`;
            return (
              <li key={tag} role="none">
                <Link
                  href={href}
                  role="menuitem"
                  className={css.item}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
