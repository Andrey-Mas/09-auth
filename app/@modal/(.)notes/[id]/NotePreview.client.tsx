"use client";

import { useRouter } from "next/navigation";
import type { Note } from "@/types/note";
import css from "./NotePreview.module.css";

type Props = {
  note: Note;
};

export default function NotePreviewClient({ note }: Props) {
  const router = useRouter();

  if (!note) return null;

  const handleClose = () => {
    router.back();
  };

  const stop = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={css.backdrop} onClick={handleClose}>
      <div className={css.modal} onClick={stop}>
        <button type="button" className={css.closeButton} onClick={handleClose}>
          ×
        </button>

        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <p className={css.tag}>{note.tag}</p>
      </div>
    </div>
  );
}
