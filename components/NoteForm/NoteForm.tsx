"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi"; // підлаштуй імпорт якщо інший
import css from "./NoteForm.module.css";

const TAGS = [
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
  "Todo",
] as const;

type Props = {
  initial?: { title?: string; content?: string; tag?: (typeof TAGS)[number] };
  submitLabel?: string;
  onSuccess?: (note: any) => void;
};

export default function NoteForm({
  initial,
  submitLabel = "Save",
  onSuccess,
}: Props) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [content, setContent] = React.useState(initial?.content ?? "");
  const [tag, setTag] = React.useState<(typeof TAGS)[number]>(
    initial?.tag ?? "Work",
  );
  const qc = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async () => {
      const payload = { title, content, tag };
      const note = await createNote(payload);
      return note;
    },
    onSuccess: async (note) => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      onSuccess?.(note);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
  };

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <div className={css.field}>
        <label htmlFor="title" className={css.label}>
          Title
        </label>
        <input
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={css.input}
        />
      </div>

      <div className={css.field}>
        <label htmlFor="content" className={css.label}>
          Content
        </label>
        <textarea
          id="content"
          required
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={css.textarea}
        />
      </div>

      <div className={css.field}>
        <label htmlFor="tag" className={css.label}>
          Tag
        </label>
        <select
          id="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value as (typeof TAGS)[number])}
          className={css.select}
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className={css.error}>
          {/* @ts-expect-error any */}
          {error?.response?.data?.message || "Failed to save"}
        </p>
      )}

      <div className={css.actions}>
        <button type="submit" disabled={isPending} className={css.primaryBtn}>
          {isPending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
