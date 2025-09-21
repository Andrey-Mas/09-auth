"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import type { Tag } from "@/types";
import { useRouter } from "next/navigation";

type Props = { backTo?: string };

const TAGS: Tag[] = [
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
];

export default function NoteForm({ backTo }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("Work");

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: () => createNote({ title, content, tag }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      if (backTo) router.replace(backTo, { scroll: false });
      else router.replace("/notes", { scroll: false });
    },
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await mutateAsync();
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
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
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p style={{ color: "crimson" }}>
          {(error as any)?.response?.data?.message || "Failed to create"}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          onClick={() =>
            backTo ? router.replace(backTo, { scroll: false }) : router.back()
          }
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
