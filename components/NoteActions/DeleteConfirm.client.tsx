"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

export default function DeleteConfirm({ id }: { id: string }) {
  const router = useRouter();
  const qc = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () => deleteNote(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      router.back(); // закриваємо модалку
    },
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Delete note?</h2>
      <p>This action cannot be undone.</p>

      {error && (
        <p style={{ color: "crimson" }}>
          {(error as any)?.response?.data?.message || "Failed to delete"}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => mutateAsync()}
          disabled={isPending}
          className="btn-danger"
        >
          {isPending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
