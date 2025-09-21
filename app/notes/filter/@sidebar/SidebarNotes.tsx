"use client";

import Link from "next/link";
import css from "./SidebarNotes.module.css";
import { TAGS_UI } from "@/types/note";

// Кожен елемент TAGS_UI має форму: { value: "Work" | "...", label: "Work" | "..." }
type UITag = (typeof TAGS_UI)[number];

export default function SidebarNotes() {
  return (
    <aside className={css.sidebar}>
      <h3 className={css.title}>Tags</h3>

      <ul className={css.list}>
        {TAGS_UI.map((tag: UITag) => {
          const value = tag.value;
          const href =
            value === "All"
              ? "/notes/filter/All"
              : `/notes/filter/${encodeURIComponent(value)}`;

          return (
            <li className={css.item} key={value}>
              <Link href={href} prefetch={false} className={css.link}>
                {tag.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
