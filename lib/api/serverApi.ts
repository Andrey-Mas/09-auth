// lib/api/serverApi.ts

import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

/**
 * Допоміжна функція для серверних запитів:
 * - проброс куків з Next (SSR)
 * - кеш вимкнено
 * - повертає JSON або null
 */
async function getJSON<T>(
  path: string,
  params?: Record<string, any>,
): Promise<T | null> {
  const cookieHeader = cookies().toString();

  const search =
    params && Object.keys(params).length
      ? "?" +
        new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>(
            (acc, [key, value]) => {
              if (
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
              ) {
                acc[key] = String(value);
              }
              return acc;
            },
            {},
          ),
        ).toString()
      : "";

  const res = await fetch(`${baseURL}${path}${search}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/* ========= Notes (server) ========= */

type FetchNotesArgs = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string; // "All" або конкретний Tag
};

export async function fetchNotes(args: FetchNotesArgs): Promise<Note[]> {
  const { page = 1, perPage = 12, search = "", tag } = args ?? {};

  const params: Record<string, any> = { page, perPage };

  if (search.trim()) params.search = search.trim();
  if (tag && tag !== "all" && tag !== "All") params.tag = tag;

  const data = await getJSON<any>("/notes", params);

  if (!data) return [];
  if (Array.isArray(data)) return data as Note[];
  if (Array.isArray(data.notes)) return data.notes as Note[];

  return [];
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  if (!id) return null;

  const data = await getJSON<Note>(`/notes/${encodeURIComponent(id)}`);
  return data ?? null;
}

/* ========= Auth / User (server) ========= */

/**
 * /api/auth/session -> { success: boolean }
 */
export async function checkSession(): Promise<boolean> {
  const data = await getJSON<{ success?: boolean }>("/auth/session");
  return !!data?.success;
}

export async function getMe(): Promise<User | null> {
  const data = await getJSON<User>("/users/me");
  return data ?? null;
}
