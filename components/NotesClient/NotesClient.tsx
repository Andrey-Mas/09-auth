"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesClient.module.css";

type Props = {
  initialNotes: Note[];
  initialPage: number;
  initialSearch: string;
  initialTag: string; // "All" або тег
  perPage: number;
};

export default function NotesClient({
  initialNotes,
  initialPage,
  initialSearch,
  initialTag,
  perPage,
}: Props) {
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Зчитуємо актуальні значення з URL
  const page = Number(searchParams.get("page")) || Number(initialPage) || 1;

  const search = searchParams.get("search") ?? initialSearch ?? "";

  const tag = searchParams.get("tag") ?? (initialTag || "All");

  // Хелпер для оновлення query-параметрів
  const updateQuery = (next: {
    page?: number;
    search?: string;
    tag?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      const v = next.search.trim();
      if (v) params.set("search", v);
      else params.delete("search");
      // якщо міняємо пошук — починаємо з 1 сторінки
      params.delete("page");
    }

    if (next.tag !== undefined) {
      const v = next.tag;
      if (v && v !== "All") params.set("tag", v);
      else params.delete("tag");
      // при зміні тегу теж скидаємо сторінку
      params.delete("page");
    }

    if (next.page !== undefined) {
      const v = next.page;
      if (v && v > 1) params.set("page", String(v));
      else params.delete("page");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const queryKey = useMemo(
    () => ["notes", { page, perPage, search, tag }],
    [page, perPage, search, tag],
  );

  const {
    data: notes = [],
    isLoading,
    isError,
  } = useQuery<Note[]>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search,
        tag,
      }),
    initialData: initialNotes,
  });

  // Видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const hasMore = notes.length === perPage;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <h1 className={css.title}>Notes — {tag === "All" ? "All" : tag}</h1>

        <Link href="/notes/create" className={css.createButton}>
          + Create note
        </Link>
      </div>

      <div className={css.searchRow}>
        <SearchBox
          value={search}
          onChange={(value) => updateQuery({ search: value, page: 1 })}
        />
      </div>

      {isLoading && <p className={css.infoText}>Loading...</p>}
      {isError && (
        <p className={css.errorText}>Failed to load notes. Please try again.</p>
      )}

      {notes.length > 0 ? (
        <>
          <NoteList
            notes={notes}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />

          <Pagination
            page={page}
            hasPrev={page > 1}
            hasNext={hasMore}
            onPageChange={(newPage) => updateQuery({ page: newPage })}
          />
        </>
      ) : (
        !isLoading && <p className={css.errorText}>No notes found.</p>
      )}
    </div>
  );
}
