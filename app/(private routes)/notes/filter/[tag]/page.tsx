import NoteList from "@/components/NoteList/NoteList";
import type { Tag } from "@/types";

type Params = { tag: string };

export default async function NotesByTagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag) as Tag | "All";

  // Якщо NoteList сам читає тег зі стейту/URL — можна не передавати проп
  return (
    <main style={{ padding: 24 }}>
      <h1>Notes</h1>
      <NoteList tag={decoded === "All" ? undefined : (decoded as Tag)} />
    </main>
  );
}
