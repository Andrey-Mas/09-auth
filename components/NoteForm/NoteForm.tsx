"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";
import type { DraftTag } from "@/lib/store/noteStore";
import { useState } from "react";

export default function NoteForm({ backTo }: { backTo?: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  async function formAction(formData: FormData) {
    setErrorMsg(null);

    const title = String(formData.get("title") || "");
    const content = String(formData.get("content") || "");
    const tag = String(formData.get("tag") || "Todo") as DraftTag;

    try {
      await mutateAsync({ title, content, tag });
      clearDraft(); // очищаємо тільки після успіху

      if (backTo) router.push(backTo);
      else router.back();
    } catch (err: any) {
      // 429, 5xx тощо — показуємо повідомлення, draft НЕ чіпаємо
      const status = err?.response?.status ?? err?.status;
      if (status === 429) {
        setErrorMsg("Server rate limit: too many requests. Please try again.");
      } else {
        setErrorMsg(err?.message || "Failed to create note.");
      }
    }
  }

  return (
    <form className={css.form} action={formAction}>
      <div className={css.field}>
        <label className={css.label} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          className={css.input}
          placeholder="Enter title…"
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          required
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          className={css.textarea}
          rows={6}
          placeholder="Write your note…"
        />
      </div>

      <div className={css.field}>
        <label className={css.label} htmlFor="tag">
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as DraftTag })}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {errorMsg && (
        <div
          style={{
            marginTop: 8,
            padding: 10,
            borderRadius: 8,
            background: "#ffe6e9",
            color: "#dc3545",
            fontSize: 14,
          }}
        >
          {errorMsg}
        </div>
      )}

      <div className={css.actions}>
        {backTo ? (
          <Link href={backTo} scroll={false} className={css.cancelButton}>
            Cancel
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            className={css.cancelButton}
          >
            Cancel
          </button>
        )}
        <button type="submit" disabled={isPending} className={css.submitButton}>
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
