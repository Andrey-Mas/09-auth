"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNoteById, updateNote } from "@/lib/api/clientApi";
import { TAGS_UI, type Tag } from "@/types";
import { useRouter } from "next/navigation";

export default function EditNoteForm({ id }: { id: string }) {
  const router = useRouter();
  const qc = useQueryClient();

  // завантажуємо поточну нотатку
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("Work");

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setContent(data.content);
      setTag(data.tag as Tag);
    }
  }, [data]);

  const closeToNotes = () => {
    // якщо відкрито як модалка з /notes — закриваємо назад
    const fromNotesRef =
      typeof document !== "undefined" &&
      document.referrer &&
      new URL(document.referrer).pathname.startsWith("/notes");

    if (
      fromNotesRef ||
      (typeof window !== "undefined" && window.history.length > 1)
    ) {
      router.back();
      // запасний варіант, якщо історії немає або back нічого не зробив
      setTimeout(() => router.replace("/notes", { scroll: false }), 0);
    } else {
      // прямий перехід на /notes/[id]/edit
      router.replace("/notes", { scroll: false });
    }
  };

  const {
    mutateAsync,
    isPending,
    error: saveError,
  } = useMutation({
    mutationFn: () => updateNote(id, { title, content, tag }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["notes"] }),
        qc.invalidateQueries({ queryKey: ["note", id] }),
      ]);
      closeToNotes();
    },
  });

  if (isLoading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (isError)
    return (
      <main style={{ padding: 24, color: "crimson" }}>
        {(error as any)?.message ?? "Failed to load"}
      </main>
    );

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 16 }}>Edit note</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void mutateAsync();
        }}
        style={{ display: "grid", gap: 12 }}
      >
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

        {saveError && (
          <p style={{ color: "crimson" }}>
            {(saveError as any)?.response?.data?.message || "Failed to save"}
          </p>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
