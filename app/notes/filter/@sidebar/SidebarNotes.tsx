"use client";

import Link from "next/link";
import css from "./SidebarNotes.module.css";
import { TAGS_UI } from "@/types";

type UITag = (typeof TAGS_UI)[number];

export default function SidebarNotes() {
  return (
    <aside className={css.sidebar}>
      <ul className={css.list}>
        {TAGS_UI.map((t: UITag) => {
          const value = typeof t === "string" ? t : t.value;
          const label = typeof t === "string" ? t : t.label;
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
