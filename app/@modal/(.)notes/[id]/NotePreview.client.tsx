"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function NotePreview({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [router]);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  return (
    <div
      aria-modal
      role="dialog"
      onClick={() => router.back()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", // <-- головний фікс
          width: "min(720px, 96vw)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            border: "1px solid #dee2e6",
            borderRadius: 8,
            background: "#fff",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
