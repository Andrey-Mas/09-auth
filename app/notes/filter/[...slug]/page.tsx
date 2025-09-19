// app/notes/filter/[...slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NotesClient from "./Notes.client";
import type { UITag } from "@/types/note";

type Params = { slug?: string[] };
type Search = {
  [key: string]: string | string[] | undefined;
  page?: string;
  query?: string;
};

const VALID_TAGS: ReadonlyArray<UITag> = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

// --- SEO (динамічно за фільтром) ---
// У твоїй версії Next тут params треба чекати
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parts = Array.isArray(slug) ? slug : [];

  if (parts.length > 1) {
    return {
      title: "Notes — Not found | NoteHub",
      description: "This page does not exist.",
      openGraph: {
        title: "Notes — Not found | NoteHub",
        description: "This page does not exist.",
        url: `/notes/filter/${parts.map(encodeURIComponent).join("/")}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }

  const rawTag = parts[0] || "All";

  if (!(VALID_TAGS as readonly string[]).includes(rawTag)) {
    return {
      title: "Notes — Invalid tag | NoteHub",
      description: "This tag does not exist in NoteHub.",
      openGraph: {
        title: "Notes — Invalid tag | NoteHub",
        description: "This tag does not exist in NoteHub.",
        url: `/notes/filter/${encodeURIComponent(rawTag)}`,
        images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
      },
    };
  }

  const title = `Notes — ${rawTag} | NoteHub`;
  const description = `Browse notes filtered by tag: ${rawTag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/notes/filter/${encodeURIComponent(rawTag)}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

// --- Сторінка ---
// Тут теж: params/searchParams приходять як Promise у твоїй збірці
export default async function NotesPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<Search>;
}) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};

  const parts = Array.isArray(slug) ? slug : [];

  // 404 якщо зайвих сегментів більше одного
  if (parts.length > 1) {
    notFound();
  }

  const rawTag = parts[0] || "All";

  // 404 якщо тег невалідний
  if (!(VALID_TAGS as readonly string[]).includes(rawTag)) {
    notFound();
  }

  const tag = rawTag as UITag;

  const page =
    typeof sp.page === "string" ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;
  const query = typeof sp.query === "string" ? sp.query : "";

  return (
    <NotesClient initialPage={page} initialQuery={query} initialTag={tag} />
  );
}
