"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import type { Tag, Note, PaginatedNotes } from "@/types";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";

import listCss from "@/components/NoteList/NoteList.module.css";

type Props = {
  tag?: Tag | "All";
  notes?: Note[];
  page?: number;
  query?: string;
  from?: string;
};

export default function NotesClient({
  tag: tagProp = "All",
  notes,
  page: pageProp = 1,
  query: queryProp = "",
}: Props) {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState(queryProp);

  const currentTag = useMemo<Tag | "All">(() => {
    return tagProp;
  }, [tagProp]);

  const page = useMemo(() => {
    const p = Number(sp.get("page") ?? pageProp ?? 1);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [sp, pageProp]);

  useEffect(() => {
    setSearch(sp.get("search") ?? queryProp ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const basePath =
    currentTag === "All"
      ? "/notes/filter/All"
      : `/notes/filter/${encodeURIComponent(currentTag)}`;

  const { data, isPending, error } = useQuery<PaginatedNotes>({
    queryKey: ["notes", { tag: currentTag, page, search }],
    queryFn: () =>
      fetchNotes({
        tag: currentTag === "All" ? undefined : (currentTag as Tag),
        page,
        perPage: 12,
        search: search || undefined,
      }),
    placeholderData: (prev) => prev,
    initialData: notes
      ? {
          items: notes,
          page,
          perPage: 12,
          totalItems: notes.length,
          totalPages: Math.max(1, Math.ceil(notes.length / 12)),
        }
      : undefined,
  });

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(sp.toString());
    if (search) next.set("search", search);
    else next.delete("search");
    next.delete("page");
    router.replace(`${basePath}?${next.toString()}`, { scroll: false });
  };

  return (
    <main style={{ padding: 24 }}>
      <div className={listCss.pageTitle}>
        <span>Notes {currentTag !== "All" ? `— ${currentTag}` : ""}</span>
        {/* тут відкриваємо модалку створення у @modal */}
        <Link
          href="/notes/new"
          prefetch={false}
          scroll={false}
          className={listCss.link}
        >
          Create
        </Link>
      </div>

      <form onSubmit={onSearchSubmit} className={listCss.controls}>
        <SearchBox value={search} onChange={setSearch} />
        <button type="submit" className={listCss.searchButton}>
          Search
        </button>
      </form>

      {isPending && <p className={listCss.info}>Loading…</p>}
      {error && (
        <p className={listCss.error}>
          {(error as any)?.response?.data?.message || "Failed to load notes"}
        </p>
      )}

      {data && (
        <ul className={listCss.list}>
          {data.items.map((n) => (
            <li key={n.id} className={listCss.listItem}>
              <h3 className={listCss.noteTitle} style={{ margin: 0 }}>
                {n.title}
              </h3>
              <p className={listCss.content}>{n.content}</p>

              <div className={listCss.footer}>
                <span className={listCss.tag}>{n.tag}</span>

                <div className={listCss.actions}>
                  <Link
                    href={`/notes/${n.id}`}
                    prefetch={false}
                    scroll={false}
                    className={listCss.link}
                  >
                    Open
                  </Link>
                  <Link
                    href={`/notes/${n.id}/delete`}
                    prefetch={false}
                    scroll={false}
                    className={listCss.button}
                  >
                    Delete
                  </Link>
                  <Link
                    href={`/notes/${n.id}/edit`}
                    prefetch={false}
                    scroll={false}
                    className={listCss.link}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {data && data.totalPages > 1 && (
        <div style={{ marginTop: 16 }}>
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </main>
  );

  function goToPage(next: number) {
    const nextSP = new URLSearchParams(sp.toString());
    nextSP.set("page", String(next));
    router.replace(`${basePath}?${nextSP.toString()}`, { scroll: false });
  }
}
