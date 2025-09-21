"use client";
import Link from "next/link";

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

export default function SidebarNotes() {
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "grid",
        gap: 8,
      }}
    >
      {TAGS.map((t) => {
        const href =
          t === "All"
            ? "/notes/filter/All"
            : `/notes/filter/${encodeURIComponent(t)}`;
        return (
          <li key={t}>
            <Link href={href} prefetch={false}>
              {t}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
