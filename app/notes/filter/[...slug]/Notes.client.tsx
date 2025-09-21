"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi"; // ← беремо прямо з clientApi, щоб не було плутанини з типами
import type { Tag, Note, PaginatedNotes } from "@/types";
import listCss from "@/components/NoteList/NoteList.module.css";

// Локальний тип параметрів, щоб точно був search/page/perPage/tag
type FetchParams = {
  search?: string;
  tag?: Tag;
  page?: number;
  perPage?: number;
};

type Props = {
  tag?: Tag | "All";
  notes?: Note[]; // опційно (для сумісності), не обов’язково використовувати
  page?: number;
  query?: string;
  from?: string;
};

const PER_PAGE = 12;

export default function NotesClient(props: Props) {
  const { tag: tagProp, page: pageProp, query: queryProp } = props;

  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  // Обчислюємо активний тег з пропса або з URL
  const currentTag: Tag | "All" = useMemo(() => {
    if (tagProp) return tagProp;
    const m = pathname?.match(/\/notes\/filter\/([^/]+)/i);
    if (m?.[1]) {
      const decoded = decodeURIComponent(m[1]);
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
      ] as const;
      return allowed.includes(decoded as Tag | "All")
        ? (decoded as Tag | "All")
        : "All";
    }
    return "All";
  }, [pathname, tagProp]);

  // Пошук + сторінка з query string
  const [search, setSearch] = useState<string>(
    sp.get("search") ?? queryProp ?? "",
  );
  const page = useMemo(() => {
    const p = Number(sp.get("page") ?? pageProp ?? 1);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }, [sp, pageProp]);

  // Синхронізуємо інпут, якщо URL змінився ззовні
  useEffect(() => {
    setSearch(sp.get("search") ?? queryProp ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const basePath =
    currentTag === "All"
      ? "/notes/filter/All"
      : `/notes/filter/${encodeURIComponent(currentTag)}`;

  // Параметри для API — локально типізовані, тому 'search' точно існує в типі
  const params: FetchParams = {
    tag: currentTag === "All" ? undefined : (currentTag as Tag),
    page,
    perPage: PER_PAGE,
    search: search || undefined,
  };

  // Запит нотаток
  const { data, isPending, error } = useQuery<PaginatedNotes>({
    queryKey: ["notes", params],
    queryFn: async () => fetchNotes(params as any), // cast на випадок старих сигнатур
    placeholderData: (prev) => prev,
    staleTime: 5_000,
  });

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const qs = new URLSearchParams(sp.toString());
    if (search) qs.set("search", search);
    else qs.delete("search");
    qs.set("page", "1");
    router.replace(`${basePath}?${qs.toString()}`, { scroll: false });
  }

  function goToPage(next: number) {
    const qs = new URLSearchParams(sp.toString());
    qs.set("page", String(next));
    if (search) qs.set("search", search);
    router.replace(`${basePath}?${qs.toString()}`, { scroll: false });
  }

  return (
    <main style={{ padding: 24 }}>
      {/* Заголовок + Create */}
      <div className={listCss.title}>
        <span>Notes {currentTag !== "All" ? `— ${currentTag}` : ""}</span>
        <Link
          href="/notes/new"
          prefetch={false}
          scroll={false}
          className={listCss.link}
        >
          Create
        </Link>
      </div>

      {/* Пошук */}
      <form onSubmit={onSearchSubmit} className={listCss.controls}>
        <input
          className={listCss.searchInput}
          type="search"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className={listCss.searchButton}>
          Search
        </button>
      </form>

      {/* Стан */}
      {isPending && <p className={listCss.info}>Loading…</p>}
      {error && (
        <p className={listCss.error}>
          {(error as any)?.response?.data?.message || "Failed to load notes"}
        </p>
      )}

      {/* Список */}
      {data && (
        <ul className={listCss.list}>
          {data.items.map((n) => (
            <li key={n.id} className={listCss.listItem}>
              <h3 className={listCss.title} style={{ margin: 0 }}>
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

      {/* Порожньо */}
      {data && data.items.length === 0 && (
        <p className={listCss.info}>No notes found.</p>
      )}

      {/* Пагінація */}
      {data && data.totalPages > 1 && (
        <div className={listCss.pagination}>
          <button
            className={listCss.pageButton}
            onClick={() => goToPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className={listCss.pageIndicator}>
            Page {page} of {data.totalPages}
          </span>
          <button
            className={listCss.pageButton}
            onClick={() => goToPage(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
