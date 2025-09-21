// app/(private routes)/notes/filter/[tag]/page.tsx
import type { Tag } from "@/types";
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client"; // ← імпортуємо саме клієнтський компонент

type Params = { tag: string };

export default async function NotesByTagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag) as Tag | "All";

  return <NotesClient tag={decoded} />;
}
