"use client";

import { useEffect, useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/clientApi";
import type { Note, Tag } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

import css from "./NotesClient.module.css";

type Props = {
  initialNotes: Note[];
  initialPage: number;
  initialSearch: string;
  perPage: number;
};

const ALLOWED_TAGS: Tag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
];

export default function FilteredNotesClient({
  initialNotes,
  initialPage,
  initialSearch,
  perPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { slug } = useParams<{ slug: string[] }>();

  // тег з URL
  const rawTag = Array.isArray(slug) && slug.length > 0 ? slug[0] : "All";
  const tag: Tag | "All" = (ALLOWED_TAGS as string[]).includes(rawTag)
    ? (rawTag as Tag)
    : "All";

  const [page, setPage] = useState(initialPage || 1);
  const [search, setSearch] = useState(initialSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || "");

  // debounce для пошуку
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  // синхронізація стану з URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  const queryKey = useMemo(
    () => ["notes", { page, perPage, search: debouncedSearch, tag }],
    [page, perPage, debouncedSearch, tag],
  );

  const { data, isLoading, isError } = useQuery<Note[]>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch,
        tag: tag === "All" ? undefined : tag,
      }),
    initialData: initialNotes,
  });

  // гарантовано масив для подальшої роботи
  const notes = data ?? [];
  const hasMore = notes.length === perPage;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <h1 className={css.title}>Notes — {tag === "All" ? "All" : tag}</h1>

        <Link
          href="/notes/create"
          prefetch={false}
          className={css.createButton}
        >
          + Create note
        </Link>
      </div>

      <div className={css.searchRow}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
        />
      </div>

      {isLoading && <p className={css.infoText}>Loading...</p>}

      {isError && (
        <p className={css.errorText}>Failed to load notes. Please try again.</p>
      )}

      {!isLoading && !notes.length && (
        <p className={css.infoText}>No notes found.</p>
      )}

      {notes.length > 0 && <NoteList notes={notes} />}

      {notes.length > 0 && (
        <Pagination
          page={page}
          hasPrev={page > 1}
          hasNext={hasMore}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
