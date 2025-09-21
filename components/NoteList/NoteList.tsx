"use client";

import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { getNotes } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { PaginatedNotes, Tag } from "@/types";

import css from "./NoteList.module.css";

const PER_PAGE = 12;

export default function NoteList({ tag }: { tag?: Tag }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") ?? "",
  );
  const page = Number(searchParams.get("page") ?? "1");

  const queryKey = useMemo(
    () => ["notes", { page, perPage: PER_PAGE, search, tag }] as const,
    [page, search, tag],
  );

  const { data, isLoading, isError, error } = useQuery<PaginatedNotes, Error>({
    queryKey,
    queryFn: () =>
      getNotes({
        page,
        perPage: PER_PAGE,
        search: search.trim() || undefined,
        tag,
      }),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated, // не фетчимо без сесії
    retry: false,
  });

  const setParam = (name: string, value?: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value && value.length > 0) sp.set(name, value);
    else sp.delete(name);
    if (name === "search") sp.delete("page"); // повертаємо на першу сторінку при новому пошуку
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const goToPage = (nextPage: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("page", String(nextPage));
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  return (
    <main className={css.container}>
      <h1
        className={css.title}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Notes</span>
        <Link href="/notes/new" prefetch={false} className={css.link}>
          Create note +
        </Link>
      </h1>

      {/* Пошук */}
      <form
        className={css.controls}
        onSubmit={(e) => {
          e.preventDefault();
          setParam("search", search);
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or content…"
          className={css.searchInput}
        />
        <button type="submit" className={css.searchButton}>
          Search
        </button>
      </form>

      {/* Стан */}
      {isLoading && <p className={css.info}>Loading…</p>}
      {isError && (
        <p className={css.error}>{error?.message || "Failed to load notes"}</p>
      )}

      {/* Список */}
      {!!data?.items.length && (
        <ul className={css.list}>
          {data.items.map((n) => (
            <li key={n.id} className={css.listItem}>
              <h3 className={css.title}>{n.title}</h3>

              <p className={css.content}>
                {n.content.length > 140
                  ? n.content.slice(0, 140) + "…"
                  : n.content}
              </p>

              <div className={css.footer}>
                <span className={css.tag}>{n.tag}</span>

                <div className={css.actions}>
                  <Link
                    href={`/notes/${n.id}`}
                    prefetch={false}
                    scroll={false}
                    className={css.link}
                  >
                    Open
                  </Link>
                  <Link
                    href={`/notes/${n.id}/delete`}
                    prefetch={false}
                    scroll={false}
                    className={css.button}
                  >
                    Delete
                  </Link>
                  <Link
                    href={`/notes/${n.id}/edit`}
                    prefetch={false}
                    scroll={false}
                    className={css.link}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {data && data.items.length === 0 && (
        <p className={css.info}>No notes found.</p>
      )}

      {/* Пагінація */}
      {data && data.totalPages > 1 && (
        <div className={css.pagination}>
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className={css.pageButton}
          >
            ← Prev
          </button>
          <span className={css.pageIndicator}>
            {page} / {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages}
            onClick={() => goToPage(page + 1)}
            className={css.pageButton}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}
