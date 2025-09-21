// app/notes/filter/[...slug]/page.tsx
import type { Tag } from "@/types";
import NotesClient from "./Notes.client";

type Params = { slug?: string[] };

export default async function NotesPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug = [] } = await params;
  const sp = await searchParams;

  // перший сегмент у catch-all трактуємо як тег
  const rawTag = slug[0];
  const tag = (rawTag ? decodeURIComponent(rawTag) : "All") as Tag | "All";

  // page з query (?page=)
  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const pageNum = Number(rawPage ?? 1);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  // search з query (?search=)
  const query =
    typeof sp.search === "string"
      ? sp.search
      : Array.isArray(sp.search)
        ? (sp.search[0] ?? "")
        : "";

  return <NotesClient tag={tag} page={page} query={query} />;
}
