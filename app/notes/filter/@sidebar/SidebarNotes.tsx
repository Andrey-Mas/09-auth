"use client";

import Link from "next/link";
import css from "./SidebarNotes.module.css";
// Зміни шлях імпорту на свій, якщо TAGS_UI експортується з іншого файлу
import { TAGS_UI } from "@/types/note";

type UITag = { readonly value: string; readonly label: string };

export default function SidebarNotes() {
  return (
    <aside className={css.sidebar}>
      <ul className={css.list}>
        {TAGS_UI.map((t: UITag) => {
          const value = t.value;
          const href =
            value === "All"
              ? "/notes/filter/All"
              : `/notes/filter/${encodeURIComponent(value)}`;

          return (
            <li key={value} className={css.item}>
              <Link href={href} prefetch={false} className={css.link}>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
