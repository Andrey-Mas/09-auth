"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { TAGS_UI, type Tag } from "@/types";
import { useRouter } from "next/navigation";

export default function NoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("Work");

  const router = useRouter();
  const qc = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () => createNote({ title, content, tag }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      // якщо відкрито як модалка (є історія з /notes) — просто закриваємо
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        // запасний варіант на випадок прямого входу
        setTimeout(() => router.replace("/notes"), 0);
      } else {
        router.replace("/notes");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutateAsync();
      }}
      style={{ display: "grid", gap: 12, maxWidth: 560, margin: "24px auto" }}
    >
      <h1>Create note</h1>

      <label>
        <div>Title</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        <div>Content</div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          style={{ width: "100%", padding: 8 }}
        />
      </label>

      <label>
        <div>Tag</div>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value as Tag)}
          style={{ width: "100%", padding: 8 }}
        >
          {TAGS_UI.filter((t) => t.value !== "All").map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p style={{ color: "crimson" }}>
          {(error as any)?.message ?? "Failed to create"}
        </p>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
