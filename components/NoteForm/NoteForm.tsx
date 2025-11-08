"use client";

import { useState } from "react";
import type { Tag } from "@/types/note";
import { ALLOWED_TAGS } from "@/types/note";
import css from "./NoteForm.module.css";

type Props = {
  onCreate: (payload: {
    title: string;
    content: string;
    tag: Tag;
  }) => void | Promise<void>;
  isSubmitting?: boolean;
};

export default function NoteForm({ onCreate, isSubmitting }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("Todo");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    setError("");

    await onCreate({
      title: title.trim(),
      content: content.trim(),
      tag,
    });

    setTitle("");
    setContent("");
    setTag("Todo");
  };

  return (
    <form id="note-form" className={css.form} onSubmit={handleSubmit}>
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

      <button
        type="submit"
        className={css.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Add note"}
      </button>
    </form>
  );
}
