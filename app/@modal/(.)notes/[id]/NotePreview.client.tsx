// app/@modal/(.)notes/[id]/NotePreview.client.tsx
"use client";

import type { Note } from "@/types/note";

type Props = {
  note: Note;
};

export default function NotePreviewClient({ note }: Props) {
  if (!note) return null;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
}
