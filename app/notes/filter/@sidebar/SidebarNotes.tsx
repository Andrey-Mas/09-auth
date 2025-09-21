"use client";

import Link from "next/link";
import css from "./SidebarNotes.module.css";
// Якщо TAGS_UI експортується з "@/types" або "@/types/note" — залиш той шлях, який у тебе є
import { TAGS_UI } from "@/types"; // або: "@/types/note"

// Підтримуємо обидві форми елемента: "Work" або { value:"Work", label:"Work" }
type UITag = string | { value: string; label: string };

const getValue = (t: UITag) => (typeof t === "string" ? t : t.value);
const getLabel = (t: UITag) => (typeof t === "string" ? t : t.label);

export default function SidebarNotes() {
  return (
    <aside className={css.sidebar}>
      <ul className={css.list}>
        {TAGS_UI.map((t: UITag) => {
          const value = getValue(t);
          const label = getLabel(t);
          const href =
            value === "All"
              ? "/notes"
              : `/notes/filter/${encodeURIComponent(value)}`;

          return (
            <li key={value} className={css.item}>
              <Link href={href} prefetch={false} className={css.link}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
