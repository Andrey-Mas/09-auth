import type { Metadata } from "next";
// якщо використовуєш список нотаток:
import NoteList from "@/components/NoteList/NoteList";
// якщо потрібні типи тегів:
import type { Tag } from "@/types";

export const metadata: Metadata = {
  title: "Notes — Filter",
};

type Params = { tag: string };

export default async function NotesByTagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag) as Tag | "All";

  return (
    <main className="container">
      <h1>Notes</h1>
      {/* якщо NoteList сам читає тег із URL — просто рендеримо його */}
      <NoteList /* defaultTag={decoded === "All" ? undefined : decoded} */ />
    </main>
  );
}
