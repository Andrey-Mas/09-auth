// app/(private routes)/notes/filter/[...slug]/page.tsx
import NotesClient from "@/app/notes/filter/[...slug]/Notes.client";
import type { Tag } from "@/types";

type Params = { slug?: string[] };
type Search = Record<string, string | string[] | undefined>;

export default async function NotesFilterPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<Search>;
}) {
  const { slug = [] } = await params;
  const sp: Search = (await searchParams) ?? {};

  const allowed = [
    "All",
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
  ] as const;

  const rawTag = decodeURIComponent(slug[0] ?? "All");
  const tag = (allowed as readonly (Tag | "All")[]).includes(rawTag as any)
    ? (rawTag as Tag | "All")
    : ("All" as const);

  const page = Number(sp?.page ?? 1) || 1;
  const query =
    typeof sp?.search === "string"
      ? sp.search
      : Array.isArray(sp?.search)
        ? (sp.search[0] ?? "")
        : "";

  return <NotesClient tag={tag} page={page} query={query} />;
}
