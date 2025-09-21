"use client";

import Link from "next/link";
import css from "./SidebarNotes.module.css";
// якщо у тебе інший шлях до TAGS_UI, поміняй на свій (наприклад "@/types/note")
import { TAGS_UI } from "@/types";

type UITag = (typeof TAGS_UI)[number];

const getValue = (t: UITag) => (typeof t === "string" ? t : t.value);
const getLabel = (t: UITag) => (typeof t === "string" ? t : t.label);

export default function SidebarNotes() {
  return (
    <aside className={css.sidebar}>
      <ul className={css.list}>
        {TAGS_UI.map((t) => {
          const value = getValue(t);
          const label = getLabel(t);
          const href =
            value === "All"
              ? "/notes/filter/All"
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
