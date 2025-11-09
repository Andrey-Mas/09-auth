// app/(private routes)/notes/filter/[...slug]/Notes.client.tsx
"use client";

import type { Note } from "@/types/note";

type Props = {
  notes: Note[];
};

export default function FilterNotesClient({ notes }: Props) {
  if (!notes?.length) {
    return <p>No notes found.</p>;
  }

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}
