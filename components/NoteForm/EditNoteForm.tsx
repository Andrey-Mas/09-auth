"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/lib/api/clientApi";
import type { Note, Tag } from "@/types/note";
import { ALLOWED_TAGS } from "@/types/note";
import css from "./NoteForm.module.css";

type Props = {
  note: Note;
};

export default function EditNoteForm({ note }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tag, setTag] = useState<Tag>(note.tag);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      updateNote(note.id, {
        title: title.trim(),
        content: content.trim(),
        tag,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
    onError: (err: any) => {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update note. Please try again.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    setError("");
    mutation.mutate();
  };

  const handleCancel = () => {
    router.push("/notes");
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.row}>
        <input
          className={css.input}
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as Tag)}
        >
          {ALLOWED_TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className={css.textarea}
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {error && <p className={css.error}>{error}</p>}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
