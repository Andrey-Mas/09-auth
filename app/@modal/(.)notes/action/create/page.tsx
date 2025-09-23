"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function CreateNoteModal() {
  const router = useRouter();

  const close = React.useCallback(() => {
    router.back();
  }, [router]);

  // Esc + блок скролу фону
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  // ✅ акуратне закриття модалки після створення (без перезавантаження)
  const handleSuccess = React.useCallback(() => {
    // просто закриваємо модалку; список оновиться через invalidateQueries у NoteForm
    router.back();
  }, [router]);

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(33,37,41,.6)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
      onClick={close}
    >
      <div
        style={{
          background: "#fff",
          width: "min(560px, 92vw)",
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 5px 15px rgba(0,0,0,.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            Create note
          </h2>

          <button
            aria-label="Close"
            onClick={close}
            style={{
              marginLeft: "auto",
              width: 32,
              height: 32,
              borderRadius: 6,
              border: "1px solid #dee2e6",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <NoteForm submitLabel="Create" onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
