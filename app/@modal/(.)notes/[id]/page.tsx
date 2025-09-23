"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// 🔹 Замініть імпорт, якщо у вас інша назва/шлях:
import { getNoteById } from "@/lib/api/clientApi";
// або: import { getNoteById } from "@/lib/api";

type Note = {
  id: string;
  title: string;
  content: string;
  tag: string; // Work | Personal | ...
};

export default function NoteModalPage({
  params,
}: {
  // у Next 15 на клієнті params — Promise
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  // Розпаковуємо params без async/await
  const { id } = React.use(params);

  // Закриття по Esc
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Блокуємо скрол фону, поки відкрита модалка
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const { data, isPending, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    staleTime: 5_000,
  });

  const onClose = () => router.back();

  // айді для aria
  const titleId = React.useId();
  const descId = React.useId();

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={onClose}
      // overlay
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        // спеціально вирівнюємо по центру з відступом зверху,
        // щоб не злипалась із хедером на малих екранах
        alignItems: "start",
        justifyItems: "center",
        padding: "10vh 16px 16px",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        // вікно
        style={{
          width: "min(760px, 96vw)",
          maxHeight: "80vh",
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          overflow: "auto",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
        >
          <h2 id={titleId} style={{ margin: 0 }}>
            {isPending
              ? "Loading…"
              : error
                ? "Error"
                : data?.title || `Note #${id}`}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              fontSize: 20,
              lineHeight: 1,
              border: "1px solid #ddd",
              background: "#fff",
              borderRadius: 8,
              width: 36,
              height: 36,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div id={descId} style={{ marginTop: 16 }}>
          {isPending && <p>Loading note…</p>}

          {error && (
            <p style={{ color: "#dc3545" }}>
              {(error as any)?.response?.data?.message || "Failed to load note"}
            </p>
          )}

          {data && (
            <>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
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
                  title={data.tag}
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
    </div>
  );
}
