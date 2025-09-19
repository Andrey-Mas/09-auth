// app/notes/[id]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import NoteDetails from "./NoteDetails.client";

type Params = { id: string };

// --- SEO (динамічно за даними нотатки) ---
// У твоїй версії Next тут params приходять як Promise, тому чекаємо його
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = `${note.title} — NoteHub`;
    const description =
      (note.content ?? "").trim().slice(0, 140) || "Note details";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/notes/${encodeURIComponent(id)}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  } catch {
    // Нотатка не знайдена або помилка — згенеруємо 404-мету
    return {
      title: "Note — Not found | NoteHub",
      description: "This note does not exist.",
      openGraph: {
        title: "Note — Not found | NoteHub",
        description: "This note does not exist.",
        url: `/notes/${encodeURIComponent(id)}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }
}

// --- Сторінка ---
// Тут params теж Promise у твоїй збірці, тому await
export default async function NotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  // Перевіримо існування нотатки, щоб коректно віддати 404
  try {
    await fetchNoteById(id);
  } catch {
    notFound();
  }

  // Рендеримо існуючий компонент з деталями
  return <NoteDetails id={id} />;
}
