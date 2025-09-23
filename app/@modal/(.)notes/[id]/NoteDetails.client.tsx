"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNoteById, deleteNote } from "@/lib/api/clientApi";
import Link from "next/link";

export default function NoteDetails({ id }: { id: string }) {
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteNote(id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["notes"] }),
        qc.invalidateQueries({ queryKey: ["note", id] }),
      ]);
      // закриє модалку, якщо вона відкрита (router.back у обгортці), або можна редіректнути на /notes у сторінковому варіанті
    },
  });

  if (isLoading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (isError)
    return (
      <div style={{ padding: 16, color: "crimson" }}>
        {(error as any)?.message ?? "Failed to load"}
      </div>
    );
  if (!data) return null;

  return (
    <article style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>{data.title}</h2>
      <div style={{ opacity: 0.7, fontSize: 14 }}>{data.tag}</div>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{data.content}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <Link
          href={`/notes/${id}/edit`}
          prefetch={false}
          className="btn-primary"
        >
          Edit
        </Link>
        <button
          onClick={() => mutateAsync()}
          disabled={isPending}
          className="btn-danger"
          type="button"
        >
          {isPending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </article>
  );
}
