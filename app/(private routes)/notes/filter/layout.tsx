import type { ReactNode } from "react";

export default function NotesFilterLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 16,
        padding: 16,
      }}
    >
      <aside>{sidebar}</aside>
      <section>{children}</section>
    </div>
  );
}
