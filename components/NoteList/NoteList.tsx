import NoteCard from "../NoteCard/NoteCard";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

type Props = {
  notes: Note[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export default function NoteList({ notes, onDelete, isDeleting }: Props) {
  return (
    <div className={css.grid}>
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}
