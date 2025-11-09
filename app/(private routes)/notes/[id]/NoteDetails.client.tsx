// app/(private routes)/notes/[id]/NoteDetails.client.tsx
"use client";

import type { Note } from "@/types/note";

type Props = {
  note: Note;
};

export default function NoteDetailsClient({ note }: Props) {
  if (!note) return null;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{note.tag}</p>
    </div>
  );
}
