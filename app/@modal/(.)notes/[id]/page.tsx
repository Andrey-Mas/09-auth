import { fetchNoteById } from "@/lib/api/serverApi";
import NotePreviewClient from "./NotePreview.client";

type Params = Promise<{ id: string }>;

export default async function NotePreviewPage({ params }: { params: Params }) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  if (!note) {
    return null; // можна вивести щось типу "Note not found"
  }

  return <NotePreviewClient note={note} />;
}
