"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { Note } from "@/types";
import { getNoteById } from "@/lib/api/clientApi"; // якщо інша назва — підправ

export default function NoteModalPage({
  params,
}: {
  // У Next 15 у клієнтських сторінках params — Promise
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  // Розпаковуємо params без async/await
  const { id } = React.use(params);

  // Закриття по ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Тягнемо нотатку
  const { data, isPending, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    staleTime: 5_000,
  });

  const close = () => router.back();

  return (
    <div
      aria-modal="true"
      role="dialog"
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(760px, 92vw)",
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <h2 style={{ margin: 0 }}>
            {isPending
              ? "Loading…"
              : error
                ? "Error"
                : data?.title || `Note #${id}`}
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            style={{ fontSize: 20, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {isPending && <p style={{ marginTop: 16 }}>Loading note…</p>}

        {error && (
          <p style={{ marginTop: 16, color: "#dc3545" }}>
            {(error as any)?.response?.data?.message || "Failed to load note"}
          </p>
        )}

        {data && (
          <>
            <p style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
              {data.content}
            </p>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  padding: "6px 10px",
                  border: "1px solid #b6d4fe",
                  background: "#e7f1ff",
                  color: "#0d6efd",
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {data.tag}
              </span>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Link
                  href={`/notes/${id}/edit`}
                  prefetch={false}
                  scroll={false}
                  style={{
                    padding: "8px 14px",
                    background: "#0d6efd",
                    color: "#fff",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </Link>
                <Link
                  href={`/notes/${id}/delete`}
                  prefetch={false}
                  scroll={false}
                  style={{
                    padding: "8px 14px",
                    background: "#dc3545",
                    color: "#fff",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Delete
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
