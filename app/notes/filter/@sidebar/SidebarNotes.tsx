"use client";

import Link from "next/link";
import css from "./SidebarNotes.module.css";
// 👇 ПРИ ПОТРЕБІ зміни шлях: на "@/types/note" або там, де ти експортуєш TAGS_UI
import { TAGS_UI } from "@/types";

// Тип елемента з масиву TAGS_UI (підтримує як рядки, так і { value, label })
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
              ? "/notes/filter/All" // якщо у тебе All = /notes, можна змінити тут на "/notes"
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
