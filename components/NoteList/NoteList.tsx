// components/NoteList/NoteList.tsx
"use client";

import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { getNotes } from "@/lib/api/clientApi";
import type { PaginatedNotes, Tag } from "@/types";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

import css from "./NoteList.module.css";

const PER_PAGE = 12;

export default function NoteList() {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const p = Number(searchParams.get("page") || "1");
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [searchParams]);

  const tag = useMemo(() => {
    const raw = searchParams.get("tag") ?? "All";
    const allowed: ReadonlyArray<Tag | "All"> = [
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
    ];
    return (allowed as readonly (Tag | "All")[]).includes(raw as any)
      ? (raw as Tag | "All")
      : "All";
  }, [searchParams]);

  const { data, isLoading, isError, error } = useQuery<PaginatedNotes>({
    queryKey: ["notes", { page, tag, search }],
    queryFn: () =>
      getNotes({
        page,
        perPage: PER_PAGE,
        tag: tag === "All" ? undefined : (tag as Tag),
        search: search || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const setParam = (name: string, value?: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(name, value);
    else sp.delete(name);
    if (name === "search") sp.delete("page"); // при новому пошуку — на першу сторінку
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
        className={css.pageTitle}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Notes</span>

        {/* ✅ модалка створення з паралельним слотом @modal */}
        <Link
          href="/notes/action/create"
          prefetch={false}
          scroll={false}
          className={css.link}
        >
          Create note +
        </Link>
      </h1>

      {/* пошук */}
      <form
        className={css.controls}
        onSubmit={(e) => {
          e.preventDefault();
          setParam("search", search || undefined);
        }}
      >
        <SearchBox value={search} onChange={setSearch} />
        <button type="submit" className={css.searchButton}>
          Search
        </button>
      </form>

      {/* стан */}
      {isLoading && <p className={css.info}>Loading…</p>}
      {isError && (
        <p className={css.error}>
          {(error as any)?.message || "Failed to load notes"}
        </p>
      )}

      {/* список */}
      {!!data?.items.length && (
        <ul className={css.list}>
          {data.items.map((n) => (
            <li key={n.id} className={css.listItem}>
              <h3 className={css.noteTitle}>{n.title}</h3>

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

      {/* пагінація */}
      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={goToPage}
        />
      )}
    </main>
  );
}
