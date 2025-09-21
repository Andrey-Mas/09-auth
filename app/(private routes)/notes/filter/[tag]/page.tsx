import NoteList from "@/components/NoteList/NoteList";
import type { Tag } from "@/types";

export default function NotesByTagPage({
  params,
}: {
  params: { tag: string };
}) {
  const tag = decodeURIComponent(params.tag) as Tag;
  return <NoteList tag={tag} />;
}
