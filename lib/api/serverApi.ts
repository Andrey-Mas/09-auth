// lib/api/serverApi.ts
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// Безпечний baseURL:
// - якщо NEXT_PUBLIC_API_URL заданий → `${...}/api`
// - якщо ні → `/api` (відносно поточного домену)
const baseURL =
  process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.length > 0
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : "/api";

type FetchNotesArgs = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
};

function buildSearch(params?: Record<string, any>): string {
  if (!params) return "";
  const filtered = Object.entries(params).reduce<Record<string, string>>(
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
  );
  const qs = new URLSearchParams(filtered).toString();
  return qs ? `?${qs}` : "";
}

/**
 * GET з куками поточного запиту (для server components)
 */
async function getJSONWithServerCookies<T>(
  path: string,
  params?: Record<string, any>,
): Promise<{ ok: boolean; data: T | null; status: number }> {
  const cookieHeader = cookies().toString();

  const headers: HeadersInit = {};
  if (cookieHeader) headers["cookie"] = cookieHeader;

  const res = await fetch(`${baseURL}${path}${buildSearch(params)}`, {
    headers,
    cache: "no-store",
  });

  const status = res.status;

  if (!res.ok) {
    return { ok: false, data: null, status };
  }

  const text = await res.text();
  if (!text) {
    return { ok: true, data: null, status };
  }

  try {
    const json = JSON.parse(text) as T;
    return { ok: true, data: json, status };
  } catch {
    return { ok: false, data: null, status };
  }
}

/* ========= Notes ========= */

export async function fetchNotes(args: FetchNotesArgs): Promise<Note[]> {
  const { page = 1, perPage = 12, search = "", tag } = args ?? {};
  const params: Record<string, any> = { page, perPage };

  if (search.trim()) params.search = search.trim();
  if (tag && tag !== "all") params.tag = tag;

  const { ok, data } = await getJSONWithServerCookies<any>("/notes", params);

  if (!ok || !data) return [];
  if (Array.isArray(data)) return data as Note[];
  if (Array.isArray(data.notes)) return data.notes as Note[];

  return [];
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  if (!id) return null;
  const { ok, data } = await getJSONWithServerCookies<Note>(
    `/notes/${encodeURIComponent(id)}`,
  );
  return ok ? data : null;
}

/* ========= User ========= */

/**
 * Основне джерело — /users/me.
 * Якщо з якоїсь причини не спрацювало, робимо fallback на /auth/session.
 */
export async function getMe(): Promise<User | null> {
  // 1. Пробуємо /users/me
  const { ok, data } = await getJSONWithServerCookies<User>("/users/me");
  if (ok && data) {
    return data;
  }

  // 2. Fallback: пробуємо /auth/session через checkSession
  const cookieHeader = cookies().toString();
  const session = await checkSession(cookieHeader);

  if (session.ok && session.data) {
    return session.data as User;
  }

  return null;
}

/* ========= Session ========= */

/**
 * Використовується в middleware.
 * Приймає cookieHeader (рядок Cookie з запиту),
 * ходить на /auth/session (через наш /api) і повертає "axios-like" об'єкт.
 */
export async function checkSession(cookieHeader?: string) {
  const headers: HeadersInit = {};
  if (cookieHeader) {
    headers["cookie"] = cookieHeader;
  }

  const res = await fetch(`${baseURL}/auth/session`, {
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  return {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
    headers: Object.fromEntries(res.headers.entries()),
    data,
  };
}
